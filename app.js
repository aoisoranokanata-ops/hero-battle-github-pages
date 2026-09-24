/* Phase 2の画面。非公開ゾーンは閲覧者にのみ描画する。 */
(() => {
  'use strict';
  const $=s=>document.querySelector(s), esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const btn=(text,action,extra='',style='')=>`<button data-action="${action}" ${extra} class="${style}">${text}</button>`;
  let decks=Store.read('decks',[]), rules=Store.read('settings',{...Game.defaults}), saved=Store.read('match-v2',null);
  let game=saved?.version===2?Game.lock(saved.game):null, history=saved?.version===2?saved.history||[]:[], transactionOpen=saved?.transactionOpen||false, choiceIds=[];
  let screen='home', draft={name:'',player:'',team:'',cards:[]}, query='', rarity='', editId=null, toastTimer;
  if(!Array.isArray(decks)) decks=[];
  try {rules=Game.settings(rules);} catch {rules={...Game.defaults};}
  const app=$('#app'), modal=$('#modal');
  const persist=()=>{Store.write('match-v2',{version:2,source:CARD_SOURCE.sha256,game,history,transactionOpen});saveWarning();};
  const saveWarning=()=>{$('#save-warning').textContent=Store.error;};
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
  function showModal(title,body){$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;if(!modal.open)modal.showModal();Presentation.syncLock();}
  function closeModal(){modal.close();$('#modal-body').innerHTML='';$('#modal-title').textContent='';}
  $('#close-modal').onclick=closeModal; modal.addEventListener('cancel',e=>{e.preventDefault();closeModal();});
  Presentation.configure(()=>({...rules,skillMode:game?SkillAutomation.mode(game):rules.skillMode}));
  Notifications.configure(()=>rules);
  const announce=(before,after)=>Notifications.push((after.events||[]).filter(e=>e.id>(before?.eventSeq||0)));
  function checkClock(){if(!game)return;const before=game;game=Game.timerNotices(game);if(JSON.stringify(before.timer.warningFlags)!==JSON.stringify(game.timer.warningFlags)){persist();announce(before,game);}}
  function run(action){
    try {const before=game,visual=Presentation.capture(game);const next=Session.perform({game,history,transactionOpen},action);({game,history,transactionOpen}=next);choiceIds=[];persist();render();announce(before,game);checkClock();Presentation.transition(before,game,action,visual);return true;}catch(e){toast(e.message);return false;}
  }
  function navigate(next){Notifications.clear();Presentation.clear();closeModal();if(screen==='battle'&&next!=='battle'&&game){game=Game.lock(game);persist();}screen=next;render();window.scrollTo(0,0);}
  function home(){
    return `${Store.read('match',null)?.game?'<p><a href="legacy/index.html">保存済みPhase 1の試合を旧ルールで続ける</a></p>':''}${game?`<div class="resume row"><div><strong>前回の試合が保存されています</strong><br><small>${esc(game.players[0].name)} 対 ${esc(game.players[1].name)} · ${game.turn}ターン${game.result?' · 終了':''}</small></div>${btn('前回の試合を再開','resume','','primary')}</div>`:''}
      <section class="hero"><div><p class="eyebrow">紙カードといっしょに、対戦を。</p><h1>英雄列伝バトル<span>神々編</span></h1><p>英雄を選び、デッキを組み、いざ対戦。<br>ライフや兵力の計算は、このゲームマットにおまかせ。</p><div class="hero-actions">${btn('対戦を始める →','setup','','primary')}${btn('デッキを作る','newDeck')}</div></div><div class="mat-preview" aria-label="対戦マットのイメージ"><div class="preview-line"><div><small>対戦の準備</small><h2>紙のカードを、机の上へ。</h2></div><div><small>初期ライフ</small><div class="preview-number">${rules.life}</div></div></div><div class="preview-slots"><div class="preview-slot">山札</div><div class="preview-slot">場</div><div class="preview-slot">手札</div></div><div class="preview-caption">山札と手札はアプリが自動で管理します</div></div></section>
      <section class="steps"><div><span class="step-number">01 / デッキを用意</span><h3>108枚から、10枚を選ぼう</h3><p>レアリティの枚数を確認しながら、自分だけのデッキを保存。</p></div><div><span class="step-number">02 / 自動で手札を配布</span><h3>手札から場に出そう</h3><p>選択方法は設定で変更できます。場に出す時に実物の紙カードを並べます。</p></div><div><span class="step-number">03 / 相談しながら対戦</span><h3>スキルを読んで、作戦を立てよう</h3><p>効果の補正も、操作を戻すことも。2人で1台を使えます。</p></div></section><p class="muted">収録：UR 9枚 ／ SSR 27枚 ／ SR 27枚 ／ R 45枚</p>`;
  }
  function cardTile(c,select=false){
    const chosen=draft.cards.includes(c.id);
    return `<article class="card ${c.rarity}" data-card="${c.id}"><div class="row"><span class="badge">${c.id} · ${c.rarity}</span><small>コスト <b>${c.cost}</b></small></div><h3>${esc(c.name)}</h3><p class="muted">${esc(c.type)}</p><div class="stats"><span>攻 <strong>${c.attack}</strong></span><span>防 <strong>${c.defense}</strong></span><span>兵 <strong>${c.troop}</strong></span></div><div class="card-actions">${btn('詳細','detail',`data-id="${c.id}" aria-label="${esc(c.name)}の詳細"`)}${select?btn(chosen?'✓ 選択済み':'＋ 選ぶ','toggleCard',`data-id="${c.id}" aria-label="${esc(c.name)}を${chosen?'外す':'選ぶ'}" aria-pressed="${chosen}"`,chosen?'selected':''):''}</div></article>`;
  }
  function builder(){
    return `<div class="page-head"><div><p class="eyebrow">デッキ登録</p><h1>${editId?'デッキを編集':'10枚の英雄を選ぼう'}</h1></div><small>原本のカード情報をそのまま表示</small></div><div class="builder"><section><label for="search">人物名・カード番号で検索</label><input id="search" type="search" placeholder="人物名を入力" value="${esc(query)}"><div class="filters" aria-label="レアリティ">${['','UR','SSR','SR','R'].map(r=>btn(r||'すべて','filter',`data-rarity="${r}" aria-pressed="${rarity===r}"`,rarity===r?'selected':'')).join('')}</div><p id="search-count" class="muted"></p><div id="catalog" class="grid"></div></section><aside class="panel deck-sidebar"><h2>選んだデッキ</h2><div id="deck-status"></div><label class="field-label">デッキ名<input id="deck-name" maxlength="60" value="${esc(draft.name)}" placeholder="例：雷神のチーム"></label><label class="field-label">プレイヤー名 <small>任意</small><input id="deck-player" maxlength="60" value="${esc(draft.player)}"></label><label class="field-label">チーム名 <small>任意</small><input id="deck-team" maxlength="60" value="${esc(draft.team)}"></label><div class="divider"></div>${btn('デッキ完成・保存','saveDeck','id="save-deck"','primary full')}<div id="selected-cards"></div></aside></div>`;
  }
  function updateBuilder(){
    const list=CARD_DATA.filter(c=>(!rarity||c.rarity===rarity)&&(!query||(c.name+' '+c.id).toLowerCase().includes(query.toLowerCase())));
    $('#catalog').innerHTML=list.length?list.map(c=>cardTile(c,true)).join(''):'<p class="empty">一致するカードがありません。</p>';
    $('#search-count').textContent=`${list.length}枚を表示 ／ 全108枚`;
    const v=Game.validateDeck(draft.cards);
    $('#deck-status').innerHTML=`<div><span class="count">${draft.cards.length}</span> / 10枚</div><div class="chips">${Object.entries(v.counts).map(([r,n])=>`<span class="badge">${r}：${n}${r==='R'?'枚':' / '+({UR:1,SSR:2,SR:3}[r])}</span>`).join('')}</div><div class="deck-status">${v.valid?'<p>✓ 枚数のルールを満たしています</p>':`<ul class="error">${v.errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul>`}</div>`;
    $('#save-deck').disabled=!v.valid||!draft.name.trim();
    $('#selected-cards').innerHTML=draft.cards.map(id=>`<div class="deck-list-item"><span><small>${id}</small> ${esc(Game.card(id).name)}</span>${btn('外す','toggleCard',`data-id="${id}" aria-label="${esc(Game.card(id).name)}を外す"`)}</div>`).join('');
  }
  function deckScreen(){
    return `<div class="page-head"><h1>保存デッキ</h1>${btn('＋ デッキを作る','newDeck','','primary')}</div>${decks.length?`<div class="grid">${decks.map(d=>`<article class="panel"><p class="eyebrow">10枚のデッキ</p><h2>${esc(d.name)}</h2><p>${esc(d.player||'名前未入力')}<br><small>${esc(d.team)}</small></p><div class="chips">${Object.entries(Game.validateDeck(d.cards).counts).map(([r,n])=>`<span class="badge">${r} ${n}枚</span>`).join('')}</div><div class="card-actions">${btn('編集','editDeck',`data-id="${d.id}"`)}${btn('複製','copyDeck',`data-id="${d.id}"`)}${btn('削除','deleteDeck',`data-id="${d.id}"`,'danger')}</div></article>`).join('')}</div>`:'<div class="panel empty"><h2>まだ保存デッキがありません</h2><p>まず108枚のカードから10枚を選んで保存しましょう。</p></div>'}`;
  }
  function setup(){
    return `<div class="page-head"><h1>対戦を始める</h1></div><p>2人分の保存デッキを選びます。同じデッキも選択できます。</p>${!decks.length?`<div class="panel empty"><p>先にデッキを1つ以上保存してください。</p>${btn('デッキを作る','newDeck','','primary')}</div>`:`<div class="panel"><div class="form-grid">${['A','B'].map((v,i)=>`<label>プレイヤー${v}のデッキ<select id="match-deck-${i}">${decks.map(d=>`<option value="${d.id}">${esc(d.name)}${d.player?' ／ '+esc(d.player):''}</option>`).join('')}</select></label>`).join('')}<label>先に始めるプレイヤー<select id="first"><option value="0">プレイヤーA</option><option value="1">プレイヤーB</option></select></label><label>試合時間<select id="time-preset"><option value="10">予選 10分</option><option value="12">準決勝 12分</option><option value="15">決勝 15分</option><option value="20">最終決戦 20分</option><option value="custom">自由に設定</option></select></label><label id="custom-time-label" hidden>試合時間（分）<input id="custom-time" type="number" min="1" max="180" value="10"></label></div><div class="notice">初期手札 ${rules.initialHand}枚 · ライフ ${rules.life} · 開始エネルギー ${rules.startEnergy}<br>設定は試合開始時に固定されます。</div>${btn('試合開始 →','createMatch','','primary wide-button')}</div>`}`;
  }
  function handoff(){return `<section class="handoff" aria-labelledby="handoff-title"><p class="eyebrow">${esc(game.handoff.reason)}</p><h1 id="handoff-title">${esc(game.players[game.handoff.player].name)}の準備です</h1><p>端末を相手に渡してください。<br>準備OKまで手札は表示されません。</p>${btn('準備OK','ready','','primary wide-button')}<p>手札枚数：A ${game.players[0].hand.length}枚 ／ B ${game.players[1].hand.length}枚</p>${history.length?btn('1つ戻す','undo'):''}</section>`;}
  function decision(){
    const e=game.pending[0];if(!e)return '';
    const manual=e.op==='manual',list=Game.options(game,e),multi=['reorder','reorderBottom'].includes(e.op)||e.target==='alliesSelect';
    if(['initialHand','normalDraw'].includes(e.op)){const multi=e.op==='initialHand',n=game.rules.initialHand;return `<section class="panel decision"><p class="eyebrow">${esc(game.players[e.owner].name)}だけが確認してください</p><h1>${esc(e.name)}</h1>${multi?`<p class="count">${choiceIds.length} / ${n}</p>`:''}${list.map(o=>btn(`${choiceIds.includes(o.id)?'✓ ':''}${esc(o.label)}`,multi?'choiceToggle':'select',`data-target="${o.id}" ${multi&&!choiceIds.includes(o.id)&&choiceIds.length>=n?'disabled':''}`,'list-choice')).join('')}${multi?btn('この初期手札に決定','selectMany',choiceIds.length===n?'':'disabled','primary'):''}<p>選んだカード名は相手に公開されません。</p></section>`;}
    const needed=e.target==='alliesSelect'?choiceIds.length<=(e.maxSelect||3):choiceIds.length===list.length;
    return `<section class="panel decision"><p class="eyebrow">${manual?'⚠ 手動処理が必要です':'スキル発動'}</p><h1>${esc(Game.card(e.sourceId).name)}「${esc(e.name)}」</h1><p class="detail-text">${esc(e.text)}</p>${manual?`<p class="notice">${esc(e.reason)} 必要な数値を効果調整してください。この能力の自動処理は行っていません。</p><div class="row">${btn('効果調整','manualEffects','','primary')}${btn('手動処理を完了','manualDone')}</div>`:`<p>${e.op==='optionalBottom'?'一番上のカード：'+esc(Game.card(game.players[e.owner].deck[0]).name):multi?(e.target==='alliesSelect'?'最大3体まで選んでください（0体でも可）。':'上からの順番に、すべてのカードを選んでください。'):'対象を選んでください。選択後の数値処理は自動です。'}</p>${list.map(o=>btn(`${multi&&choiceIds.includes(o.id)?'✓ '+(choiceIds.indexOf(o.id)+1)+'. ':''}${esc(o.label)}`,multi?'choiceToggle':'select',`data-target="${o.id}"`,multi&&choiceIds.includes(o.id)?'list-choice selected':'list-choice')).join('')}${multi?btn('この選択で処理する','selectMany',needed?'':'disabled','primary'):''}`}<div class="divider"></div>${btn('1つ戻す','undo',history.length?'':'disabled')}</section>`;
  }
  const stateLabels=c=>[c.summonedThisTurn&&!game.rules.summonAttack?'今ターン攻撃不可':'',c.attackedThisTurn?'攻撃済み':'',c.cannotAttack?'攻撃不能':'',c.skillDisabled?'スキル無効':'',c.traitDisabled?'特性無効':'',c.entrySkillResolved?'登場時：発動済み':''].filter(Boolean).map(t=>`<span class="state ${t.includes('不能')||c.troop===0?'bad':''}">${t}</span>`).join(' ');
  function modifierBadges(c){return (c.modifiers||[]).concat(c.resourceModifiers||[]).filter(m=>m.until).map(m=>`<small class="temporary-badge">${esc(Object.entries(m.stats||(m.stat?{[m.stat]:m.delta}:{})).map(([k,v])=>({attack:'攻撃',defense:'防御',maxTroop:'最大兵力',troop:'兵力',life:'ライフ',energy:'エネルギー'}[k])+' '+(v>=0?'+':'')+v).join(' / ')||(m.extraAttacks?'追加攻撃権 '+m.extraAttacks+'回':'一時状態'))}<br>${esc(Game.durationName(m))}</small>`).join('');}
  function statDetail(c){Game.normalize(c);return `<div class="stat-breakdown">${[['attack','攻撃力',c.baseAttack],['defense','防御力',c.baseDefense],['maxTroop','最大兵力',c.baseMaxTroop]].map(([k,label,base])=>{const temp=c.modifiers.filter(m=>m.until).reduce((n,m)=>n+(m.stats?.[k]||0),0),permanent=c.permanent[k]+c.modifiers.filter(m=>!m.until).reduce((n,m)=>n+(m.stats?.[k]||0),0),passive=c[k]-base-permanent-temp;return `<p>基本${label}：${base}<br>永続補正：${permanent>=0?'+':''}${permanent} ／ 一時補正：${temp>=0?'+':''}${temp}${passive?' ／ 継続効果・下限補正：'+passive:''}<br><strong>現在${label}：${c[k]}</strong></p>`;}).join('')}</div>`;}
  function fieldCard(c,p){
    const raw=Game.card(c.id), attack=p===game.active&&Game.attackable(game,c);
    return `<article data-field-player="${p}" data-field-id="${c.id}" class="card ${raw.rarity} ${c.troop===0?'zero':''}"><span class="badge">${c.id} · ${raw.rarity}</span><h3>${esc(raw.name)}</h3>${Game.processingType(c.id,game)==='MANUAL'?btn('⚠ 手動処理','manualInfo',`data-player="${p}" data-id="${c.id}"`,'manual-badge'):''}<span class="state">${Game.processingType(c.id,game)}</span>${Game.abilities(game,p,c).map(a=>a.available?btn(a.trigger==='passive'?'スキル発動！【継続効果】':a.automationType==='PRESET'?'スキル発動（PRESET）':'スキル発動！','ability',`data-player="${p}" data-id="${c.id}" data-slot="${a.slot}"`,'skill-badge'):a.used?'<span class="state">'+esc(a.sourceName)+'：発動済み</span>':'').join('')}<small>コスト ${raw.cost}</small><div class="stats"><span>攻 <strong>${c.attack}</strong></span><span>防 <strong>${c.defense}</strong></span></div><div class="troop">${c.troop} / ${c.maxTroop}<small> 兵力</small></div><meter min="0" max="${c.maxTroop}" value="${c.troop}" aria-label="${esc(raw.name)}の兵力"></meter><div>${stateLabels(c)}</div>${modifierBadges(c)}${c.note?`<p class="notice">${esc(c.note)}</p>`:''}<div class="card-actions">${btn('スキル・特性','detail',`data-player="${p}" data-id="${c.id}"`)}${btn('効果','effects',`data-player="${p}" data-id="${c.id}" ${game.result?'disabled':''}`)}</div><div class="card-actions">${btn('攻撃','attackSelect',`data-player="${p}" data-id="${c.id}" ${attack?'':'disabled'}`,'primary')}${c.troop===0?btn('トラッシュ','trashConfirm',`data-player="${p}" data-id="${c.id}"`,'danger'):''}</div></article>`;
  }
  function playerPanel(p,i){
    const ended=!!game.result, secret=i!==game.viewer||p.hidden;
    return `<section class="player ${i===game.active?'active':''} ${i?'player-b':''}"><div class="identity"><span class="badge player-mark">プレイヤー${i?'B':'A'}${i===game.active?' · あなたのターン':''}</span><h2>${esc(p.name)}</h2><small>${esc(p.team)}${p.team?' ／ ':''}${esc(p.deckName)}</small></div><div class="counters"><div class="counter life" data-life-player="${i}"><div>ライフ</div><div class="big">${p.life}</div>${btn('−','life',`data-player="${i}" data-delta="-1" aria-label="${esc(p.name)}のライフを1減らす" ${ended?'disabled':''}`)} ${btn('＋','life',`data-player="${i}" data-delta="1" aria-label="${esc(p.name)}のライフを1増やす" ${ended?'disabled':''}`)} ${btn('調整','lifePanel',`data-player="${i}" ${ended?'disabled':''}`)}</div><div class="counter"><div>エネルギー</div><div class="big">${p.energy}<small> / ${p.maxEnergy}</small></div>${btn('−','energy',`data-player="${i}" data-delta="-1" aria-label="${esc(p.name)}のエネルギーを1減らす" ${ended?'disabled':''}`)} ${btn('＋','energy',`data-player="${i}" data-delta="1" aria-label="${esc(p.name)}のエネルギーを1増やす" ${ended?'disabled':''}`)}</div></div>${modifierBadges(p)}<div class="zones">${btn(`山札 ${p.deck.length}枚`,'zone',`data-player="${i}" data-zone="deck"`)}${btn(`トラッシュ ${p.trash.length}枚`,'zone',`data-player="${i}" data-zone="trash"`)}${i===game.viewer?btn('追加ドロー（手動）','drawPanel',`data-player="${i}" ${ended?'disabled':''}`):''}</div><div class="row"><h3>場 <small>${p.field.length} / ${game.rules.fieldLimit}</small></h3><small>攻撃・防御・兵力</small></div><div class="field-grid">${p.field.map(c=>fieldCard(c,i)).join('')}${Array.from({length:Math.max(0,game.rules.fieldLimit-p.field.length)},()=>'<div class="empty-slot">場の空き</div>').join('')}</div><div class="divider"></div><div class="row"><h3>手札 ${p.hand.length}枚</h3>${i===game.viewer?btn(p.hidden?'手札を表示':'手札を隠す','hide',`data-player="${i}" ${ended?'disabled':''}`):''}</div><div class="hand">${secret?'<p class="card-backs" aria-label="非公開の手札'+p.hand.length+'枚">'+'■'.repeat(p.hand.length)+'</p>':p.hand.length?p.hand.map(id=>btn(`<small>${id} · コスト ${Game.card(id).cost}</small>${esc(Game.card(id).name)}`,'handCard',`data-player="${i}" data-id="${id}"`)).join(''):'<p class="muted">手札はありません</p>'}</div></section>`;
  }
  function battle(){
    if(!game)return home();if(game.handoff)return handoff();if(game.pending.length&&game.pending[0].op!=='manual')return decision();
    const p=game.players[game.active],winner=game.result?.winner;
    return `${decision()}<div class="battle-toolbar"><div><small>${game.turn}ターン目 · ${p.turns}回目の自分のターン</small><h2>${esc(p.name)} <small>のターン</small></h2></div><div class="row"><div><small>残り時間</small><div class="timer" id="timer">${formatTime(Game.remaining(game))}</div></div>${btn(game.timer.running?'一時停止':'再開','timer',game.result?'disabled':'')}</div>${btn('残り時間を調整','timePanel',game.result?'disabled':'')}${btn('1つ戻す','undo',history.length?'':'disabled')}</div>
      ${game.result?`<section class="winner" role="status"><p>${winner===null?'':esc(game.players[winner].name)+'<br>'+esc(game.players[winner].team)}</p><h2>${winner===null?'引き分け／代表カード決戦':'勝利！'}</h2><p>${esc(game.result.reason)}</p>${game.result.scores?`<p>ライフ / 場の兵力 / 手札<br>A：${game.result.scores[0].join(' / ')}<br>B：${game.result.scores[1].join(' / ')}</p>`:''}<small>誤操作の場合は「1つ戻す」で修正できます。</small></section>`:`<div class="notice" role="status">${esc(game.notice)}</div>`}
      <div class="battle-grid">${game.players.map(playerPanel).join('')}</div><div class="battle-actions">${game.pendingDraw?btn('ターン開始のドローを登録','drawPanel',`data-player="${game.active}" ${game.result?'disabled':''}`,'primary'):btn(game.phase==='ended'?'このターンの攻撃は終了':game.phase==='attack'?'攻撃フェイズ中':'攻撃フェイズ開始','attackPhase',game.result||game.phase!=='main'?'disabled':'','primary')}${btn('ターン終了 →','endTurn',game.result||game.pendingDraw?'disabled':'')}</div><details class="panel" open><summary>対戦ログ <small>直近500件・50操作まで戻せます</small></summary><div class="log">${game.log.slice().reverse().map(l=>`<p><time>${esc(l.at)}</time>${esc(l.text)}</p>`).join('')}</div></details>`;
  }
  function settingsScreen(){
    const names={life:'初期ライフ',initialHand:'初期手札',fieldLimit:'場の最大数',startEnergy:'開始エネルギー',maxEnergy:'最大エネルギー',minDamage:'最低ダメージ'};
    const limits={life:[1,999],initialHand:[0,10],fieldLimit:[1,10],startEnergy:[1,99],maxEnergy:[1,99],minDamage:[0,99]};
    return `<div class="page-head"><h1>先生向け設定</h1></div><p>変更は次に始める試合から有効です。進行中の試合は開始時のゲーム設定を使用します。通知・サウンド・音量・演出はすぐ反映されます。</p><form id="settings-form" class="panel"><div class="form-grid">${Object.entries(names).map(([key,name])=>`<label>${name}<input type="number" name="${key}" min="${limits[key][0]}" max="${limits[key][1]}" value="${rules[key]}" required></label>`).join('')}</div><div class="divider"></div><div class="form-grid"><label>初期手札の決め方<select name="initialHandMode"><option value="random" ${rules.initialHandMode==='random'?'selected':''}>ランダム</option><option value="manual" ${rules.initialHandMode==='manual'?'selected':''}>手動</option></select></label><label>山札からカードを引く方法<select name="drawMode"><option value="random" ${rules.drawMode==='random'?'selected':''}>ランダム</option><option value="manual" ${rules.drawMode==='manual'?'selected':''}>手動</option></select></label><label>効果音音量 <output id="volume-value">${rules.volume}</output>％<input type="range" name="volume" min="0" max="100" value="${rules.volume}"></label></div>${automationSettings()}<div class="checks">${[['sound','サウンド ON（外すとOFF）'],['effects','演出 ON（外すとOFF）'],['summonAttack','召喚したターンも攻撃可能'],['overheal','ライフ上限を超える回復を許可']].map(([k,n])=>`<label><input type="checkbox" name="${k}" ${rules[k]?'checked':''}> ${n}</label>`).join('')}</div><div class="notice">標準ルールは開始エネルギー1です。最小コストは3のため、通常は最初の2回の自分のターンにカードを出せません。</div><div class="row"><button type="submit" class="primary">設定を保存</button>${btn('標準ルールに戻す','resetSettings','type="button"')}</div></form>${PresetEditor.screen()}`;
  }
  function automationSettings(){const choices=(key,label,items)=>`<label>${label}<select name="${key}">${Object.entries(items).map(([value,text])=>`<option value="${value}" ${String(rules[key])===value?'selected':''}>${text}</option>`).join('')}</select></label>`;return `<div class="divider"></div><h2>スキル処理・通知</h2><div class="form-grid">${choices('skillMode','スキル処理',{full:'完全自動',semi:'半自動',manual:'手動'})}${choices('difficultFallback','難解能力の自動代替',{buff:'このターン攻撃力＋2',manual:'手動処理（停止せず保留）'})}${choices('notificationSeconds','能力通知時間',{'0':'表示しない','1':'1秒','1.5':'1.5秒','2':'2秒'})}</div><div class="checks">${[['autoSkills','必殺技自動発動'],['autoTraits','特技自動発動'],['abilityNotifications','特技・必殺技通知'],['abilityConfirmations','能力確認画面（半自動・手動のみ）'],['fiveMinuteNotice','残り5分通知'],['oneMinuteNotice','残り1分通知']].map(([k,label])=>`<label><input type="checkbox" name="${k}" ${rules[k]?'checked':''}> ${label}</label>`).join('')}</div><p class="muted">原文のスキル＝必殺技、特性＝特技。通知は操作やタイマーを止めません。完全自動でも手札を隠す交代画面は表示します。</p>${btn('大会・高速モード','fastSettings','type="button"')}`;}
  function rulesScreen(){return `<section class="rules"><h1>Phase 3の遊び方</h1><div class="panel"><h2>山札はアプリが管理</h2><p>保存した10枚を自動でシャッフルし、最初の手札を配ります。自分のターン開始で1枚引き、エネルギーを回復し、ターン開始の能力を処理します。紙カードは場に出す時に机へ並べてください。</p><p>相手の手札は枚数だけ表示します。交代画面で端末を渡し、次の人が「準備OK」を押してください。</p></div><div class="panel"><h2>攻撃と撃破</h2><p>攻撃力−防御力、標準の最低ダメージは1。召喚ターンは攻撃不可、通常1ターン1回です。カード能力でダメージ軽減がある場合は適用します。</p><p>兵力0で自動的にトラッシュへ。元コスト1～4は持ち主のライフ−1、5以上は−2です。コスト補正の有無は影響しません。</p><p>攻撃開始時に敵がいた場合、最後の敵を倒すと攻撃終了。撃破のライフ減少は発生しますが、そのまま直接攻撃はできません。</p></div><div class="panel"><h2>能力は3種類</h2><p>AUTO：既存の自動処理（必要に応じて対象選択）。PRESET：設定した数値効果をボタンで発動。MANUAL：手動で裁定する能力です。設定画面の「特殊スキル設定」でカードごとに指定できます。</p><p>期限の確定した自動補正は期限で解除されます。手動補正にも有効期限を指定できます。メモは自動解除されません。「継続効果」の表示は能力が条件を満たして働いている意味で、押して重ねがけはできません。</p><p>山札切れは敗北になりません。ライフ0、または時間切れのライフ・場の兵力・手札枚数の順で勝敗を判定します。</p></div><div class="panel"><h2>間違えたら1つ戻す</h2><p>召喚と能力の対象選択、撃破とライフ減少など、関連処理をまとめて戻します。試合は自動保存。再開とUndoの後にも交代画面が出るため、手札が漏れません。</p></div></section>`;}
  function render(){
    const sound=document.querySelector('#sound-toggle');if(sound){sound.textContent=rules.sound?'🔊 サウンド ON':'🔇 サウンド OFF';sound.setAttribute('aria-pressed',String(rules.sound));}
    app.innerHTML=({home,builder,decks:deckScreen,setup,battle,settings:settingsScreen,rules:rulesScreen}[screen]||home)();
    document.body.classList.toggle('privacy-lock',screen==='battle'&&!!game?.handoff);if(screen==='builder')updateBuilder();saveWarning();Presentation.syncLock();
  }
  function detail(id,p){
    const c=Game.card(id),u=p===undefined?null:game?.players[p].field.find(c=>c.id===id);
    showModal(`${id} ${c.name}`,`<span class="badge">${c.rarity}</span><p class="eyebrow">${esc(c.title)}</p><p>${esc(c.type)}</p><div class="stats"><span>コスト <strong>${c.cost}</strong></span><span>攻 <strong>${c.attack}</strong></span><span>防 <strong>${c.defense}</strong></span><span>兵 <strong>${c.troop}</strong></span></div><p class="detail-text">${esc(c.direction)}</p><div class="divider"></div><h3>スキル：${esc(c.skillName)} ${u?.skillDisabled?'<span class="state bad">スキル無効</span>':''}</h3><p class="detail-text">${esc(c.skillText)}</p>${game&&Game.metadata(id,'skill',game).fallback?'<p class="notice">自動処理：このターン攻撃力＋2（原文とは別の代替ルール）</p>':''}<h3>特性：${esc(c.traitName)} ${u?.traitDisabled?'<span class="state bad">特性無効</span>':''}</h3><p class="detail-text">${esc(c.traitText)}</p>${game&&Game.metadata(id,'trait',game).fallback?'<p class="notice">自動処理：このターン攻撃力＋2（原文とは別の代替ルール）</p>':''}<p class="detail-text">${esc(c.quote)}</p>${u?`${statDetail(u)}${modifierBadges(u)}<p>${stateLabels(u)}</p><p>${esc(u.note)}</p>${btn('効果補助パネル','effects',`data-player="${p}" data-id="${id}" ${game.result?'disabled':''}`,'primary')}`:''}<div class="divider"></div><small>原本：${esc(CARD_SOURCE.sheet)} ${c.sourceRow}行<br>${esc(c.settingStatus)}${c.notes?'<br>'+esc(c.notes):''}</small>`);
  }
  function effects(p,id){
    const duration=$('#effect-duration')?.value||'THIS_TURN';const c=game.players[p].field.find(c=>c.id===id);if(!c)return closeModal();
    showModal(`${Game.card(id).name} · 効果補助`,`<label>補正の有効期限<select id="effect-duration"><option value="THIS_TURN">このターン終了まで</option><option value="UNTIL_NEXT_TURN">次のこのカードの持ち主のターン開始まで</option><option value="PERMANENT">場にいる間（永続）</option></select></label><p class="muted">現在兵力の増減は期限に関係なく即時反映します。</p>${['attack','defense','troop','maxTroop'].map(key=>`<div class="effect-row"><h3>${{attack:'攻撃力',defense:'防御力',troop:'現在兵力',maxTroop:'最大兵力'}[key]}：${c[key]}${key==='troop'?' / '+c.maxTroop:''}</h3><div class="row">${[-3,-2,-1].map(n=>btn(String(n).replace('-','−'),'adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-delta="${n}"`)).join('')}${key==='attack'||key==='defense'?btn('リセット','adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-reset="true"`):''}${[1,2,3].map(n=>btn('＋'+n,'adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-delta="${n}"`)).join('')}</div></div>`).join('')}<div class="effect-row checks">${[['cannotAttack','攻撃不能'],['skillDisabled','スキル無効'],['traitDisabled','特性無効']].map(([k,n])=>`<label><input type="checkbox" data-flag="${k}" data-player="${p}" data-id="${id}" ${c[k]?'checked':''}> ${n}</label>`).join('')}</div>${btn('攻撃済みを解除','resetAttack',`data-player="${p}" data-id="${id}" ${c.attackedThisTurn?'':'disabled'}`)}<label class="field-label">効果メモ<textarea id="effect-note" maxlength="1000" placeholder="例：次の自分ターン開始まで攻撃力−2">${esc(c.note)}</textarea></label><div class="row">${btn('メモを保存','saveNote',`data-player="${p}" data-id="${id}"`,'primary')}${btn('トラッシュへ移す','trashConfirm',`data-player="${p}" data-id="${id}" data-zone="field"`,'danger')}</div><p class="muted">期限付き補正は自動解除されます。リセットは手動の補正を解除します。</p>`);$('#effect-duration').value=duration;
  }
  function zone(p,z){
    const pl=game.players[p];if(z==='deck'){showModal('山札',`<p>残り${pl.deck.length}枚。順番と内容は非公開です。</p>`);return;}
    showModal(`${pl.name} · トラッシュ`,pl.trash.map(id=>btn(`${id} ${esc(Game.card(id).name)}`,'detail',`data-id="${id}"`,'list-choice')).join('')||'<p>カードはありません。</p>');
  }
  function manualInfo(p,id){const texts=['skill','trait'].map(slot=>Game.metadata(id,slot,game)).filter(a=>a.automationType==='MANUAL');showModal('⚠ 手動処理',texts.map(a=>`<h3>${esc(a.sourceName)}</h3><p class="detail-text">${esc(a.sourceText)}</p><p>${esc(a.reason)}</p>`).join('')+btn('効果調整','effects',`data-player="${p}" data-id="${id}"`));}
  function handCard(p,id){
    if(p!==game.viewer)return;const c=Game.card(id),can=p===game.active&&game.phase==='main'&&!game.pendingDraw&&!game.result;
    showModal(`${id} ${c.name}`,`<p>基本コスト：<b>${c.cost}</b> ／ 自動補正後：<b>${Game.cost(game,p,id)}</b></p><label>コスト補正（手動）<input id="cost-mod" type="number" step="1" min="${-c.cost}" max="99" value="0" data-base="${Game.cost(game,p,id)}"></label><div class="row">${btn('−','costStep','data-delta="-1"')}${btn('＋','costStep','data-delta="1"')}</div><p class="count">実際の消費：<span id="actual-cost">${Game.cost(game,p,id)}</span></p><p>現在エネルギー：${game.players[p].energy}</p><p class="muted">${can?'場は最大'+game.rules.fieldLimit+'枚です。':'自分の準備フェイズに場へ出せます。'}</p><div class="row">${btn('場に出す','summon',`data-player="${p}" data-id="${id}" ${can?'':'disabled'}`,'primary')}${btn('スキル・特性','detail',`data-id="${id}"`)}${btn('手札から捨てる','trashConfirm',`data-player="${p}" data-id="${id}" data-zone="hand" ${game.result?'disabled':''}`,'danger')}</div>`);
  }
  function attackSelect(p,id){
    const enemy=game.players[1-p],a=game.players[p].field.find(c=>c.id===id);
    if(!a||!Game.attackable(game,a))return toast('このカードは今、攻撃できません');
    showModal(`${Game.card(id).name} · 攻撃先を選ぶ`,enemy.field.length?enemy.field.filter(c=>c.troop>0).map(d=>btn(`${esc(Game.card(d.id).name)} · ${Game.damage(game,a,d)}ダメージ`,'attackConfirm',`data-player="${p}" data-id="${id}" data-target="${d.id}"`,'list-choice')).join(''):!game.enemyAtStart?btn(`相手のライフへ · ${a.attack}ダメージ`,'attackConfirm',`data-player="${p}" data-id="${id}" data-target="life"`,'primary full'):'<p>このターンはライフへ直接攻撃できません。</p>');
  }
  function lifePanel(p){showModal(`${game.players[p].name} · ライフ調整`,`<p class="count">ライフ ${game.players[p].life}</p><div class="row">${[-5,-3,-2,-1,1,2,3,5].map(n=>btn(n>0?'＋'+n:String(n).replace('-','−'),'lifeAdjust',`data-player="${p}" data-delta="${n}"`)).join('')}</div><p>上限を超える回復：${game.rules.overheal?'許可':'不許可（上限'+game.rules.life+'）'}</p>`);}
  function updateCost(){const input=$('#cost-mod');let v=Number(input.value);$('#actual-cost').textContent=Number.isInteger(v)?Math.max(0,Number(input.dataset.base)+v):'整数を入力';}
  document.addEventListener('input',e=>{
    if(e.target.name==='volume')$('#volume-value').textContent=e.target.value;
    if(e.target.id==='search'){query=e.target.value;updateBuilder();}
    const key={'deck-name':'name','deck-player':'player','deck-team':'team'}[e.target.id];if(key){draft[key]=e.target.value;$('#save-deck').disabled=!Game.validateDeck(draft.cards).valid||!draft.name.trim();}
    if(e.target.id==='cost-mod')updateCost();
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='time-preset')$('#custom-time-label').hidden=e.target.value!=='custom';
    if(e.target.dataset.flag){const d=e.target.dataset,p=Number(d.player);if(run({type:'flag',player:p,id:d.id,key:d.flag,value:e.target.checked,duration:$('#effect-duration')?.value},false))effects(p,d.id);}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='settings-form')return;e.preventDefault();const form=new FormData(e.target),next={};
    Object.entries(Game.defaults).forEach(([k,v])=>next[k]=typeof v==='boolean'?form.has(k):typeof v==='string'?String(form.get(k)):Number(form.get(k)));
    try {rules=Game.settings(next);Store.write('settings',rules);Presentation.muteIfNeeded();render();saveWarning();toast('設定を保存しました。音・演出はすぐ、ゲーム設定は次の試合から反映します。');}catch(err){toast(err.message);}
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;if(Presentation.busy&&b.dataset.action!=='soundToggle')return;
    if(b.dataset.nav){navigate(b.dataset.nav);return;}
    const d=b.dataset,p=d.player===undefined?undefined:Number(d.player),id=d.id,delta=Number(d.delta),act=d.action;
    try {switch(act){
      case 'soundToggle':rules.sound=!rules.sound;Store.write('settings',rules);Presentation.unlock();Presentation.muteIfNeeded();render();break;
      case 'close':closeModal();break;
      case 'newDeck':draft={name:'',player:'',team:'',cards:[]};editId=null;query='';rarity='';navigate('builder');break;
      case 'filter':rarity=d.rarity;render();break;
      case 'toggleCard':if(draft.cards.includes(id))draft.cards=draft.cards.filter(x=>x!==id);else if(draft.cards.length<10)draft.cards.push(id);else toast('カードは10枚までです。1枚外してから選んでください。');updateBuilder();break;
      case 'detail':detail(id,p);break;
      case 'saveDeck':{
        if(!Game.validateDeck(draft.cards).valid||!draft.name.trim())break;
        const entry={...Game.clone(draft),id:editId||('d'+Date.now()+Math.random().toString(36).slice(2,7))};
        if(editId)decks=decks.map(x=>x.id===editId?entry:x);else decks.push(entry);
        Store.write('decks',decks);navigate('decks');toast('デッキを保存しました');break;
      }
      case 'editDeck':draft=Game.clone(decks.find(x=>x.id===id));editId=id;query='';rarity='';navigate('builder');break;
      case 'copyDeck':{const entry=Game.clone(decks.find(x=>x.id===id));entry.id='d'+Date.now()+Math.random().toString(36).slice(2,7);entry.name+=' のコピー';decks.push(entry);Store.write('decks',decks);render();toast('デッキを複製しました');break;}
      case 'deleteDeck':if(confirm('この保存デッキを削除しますか？')){decks=decks.filter(x=>x.id!==id);Store.write('decks',decks);render();}break;
      case 'setup':navigate('setup');break;
      case 'createMatch':{
        Presentation.unlock();
        if(game&&!confirm('保存中の試合を置き換えて、新しい試合を始めますか？'))break;
        const ds=[0,1].map(i=>decks.find(d=>d.id===$('#match-deck-'+i).value));const minutes=Number($('#time-preset').value==='custom'?$('#custom-time').value:$('#time-preset').value);
        if(!Number.isFinite(minutes)||minutes<1||minutes>180)throw Error('試合時間は1～180分で指定してください');
        game=Game.create(ds,{...rules,skillPresets:PresetEditor.read()},minutes*60,Number($('#first').value));history=[];transactionOpen=false;persist();navigate('battle');Presentation.start();break;
      }
      case 'resume':if(saved?.source&&saved.source!==CARD_SOURCE.sha256)toast('カード原本が更新されています。対戦中の数値は保存値を使用します。');navigate('battle');break;
      case 'ready':Presentation.unlock();closeModal();run({type:'ready'});break;
      case 'select':run({type:'select',target:d.target});break;
      case 'choiceToggle':if(choiceIds.includes(d.target))choiceIds=choiceIds.filter(id=>id!==d.target);else choiceIds.push(d.target);render();break;
      case 'selectMany':run({type:'select',ids:choiceIds});break;
      case 'manualDone':closeModal();run({type:'manualDone'});break;
      case 'manualEffects':showModal('効果調整',game.players.map((pl,i)=>`<h3>${esc(pl.name)}</h3>${pl.field.map(c=>btn(Game.card(c.id).name,'effects',`data-player="${i}" data-id="${c.id}"`,'list-choice')).join('')}`).join(''));break;
      case 'manualInfo':manualInfo(p,id);break;
      case 'ability':{const a=Game.metadata(id,d.slot,game);if(a.trigger==='passive')detail(id,p);else if(game.pending.length)render();else run({type:'activate',player:p,id,slot:d.slot});break;}
      case 'undo':Notifications.clear();Presentation.clear();if(history.length&&confirm('関連する処理をまとめて1つ戻しますか？')){({game,history,transactionOpen}=Session.undo({game,history,transactionOpen}));closeModal();persist();render();}break;

      case 'zone':zone(p,d.zone);break;
      case 'drawPanel':if(confirm('手動の追加ドローを1枚行いますか？'))run({type:'draw',player:p});break;
      case 'draw':if(run({type:'draw',player:p,id}))closeModal();break;
      case 'handCard':handCard(p,id);break;
      case 'costStep':$('#cost-mod').value=Math.max(-Number($('#cost-mod').dataset.base),Number($('#cost-mod').value)+delta);updateCost();break;
      case 'summon':{const mod=Number($('#cost-mod').value);if(!Number.isInteger(mod))throw Error('補正は整数で入力してください');const cost=Math.max(0,Game.cost(game,p,id)+mod);closeModal();run({type:'summon',player:p,id,cost});break;}
      case 'attackPhase':run({type:'attackPhase'});break;
      case 'attackSelect':attackSelect(p,id);break;
      case 'attackConfirm':{const a=game.players[p].field.find(c=>c.id===id),target=d.target,n=target==='life'?a.attack:Game.damage(game,a,game.players[1-p].field.find(c=>c.id===target));closeModal();run({type:'attack',player:p,id,target});break;}
      case 'effects':effects(p,id);break;
      case 'adjust':if(run({type:'adjust',player:p,id,key:d.key,delta,reset:d.reset==='true',duration:$('#effect-duration')?.value},false)){const c=game.players[p].field.find(c=>c.id===id);if(!c||game.handoff||game.result)closeModal();else effects(p,id);}break;
      case 'resetAttack':if(confirm('特殊効果により、攻撃済みを解除しますか？')&&run({type:'flag',player:p,id,key:'attackedThisTurn',value:false},false))effects(p,id);break;
      case 'saveNote':if(run({type:'note',player:p,id,value:$('#effect-note').value},false)){effects(p,id);toast('効果メモを保存しました');}break;
      case 'trashConfirm':if(confirm('このカードをトラッシュへ移しますか？')){closeModal();run({type:'trash',player:p,id,zone:d.zone||'field'});}break;
      case 'trash':closeModal();run({type:'trash',player:p,id,zone:d.zone||'field'});break;
      case 'lifePanel':lifePanel(p);break;
      case 'lifeAdjust':if(run({type:'life',player:p,delta},false)){if(game.result)closeModal();else lifePanel(p);}break;
      case 'life':case 'energy':case 'hide':run({type:act,player:p,delta});break;
      case 'endTurn':closeModal();run({type:'endTurn'});break;
      case 'timer':run({type:'timer'},false);break;
      case 'fastSettings':rules=Game.settings({...rules,...SkillAutomation.defaults,drawMode:'random',initialHandMode:'random'});Store.write('settings',rules);render();toast('大会・高速モードを保存しました。次の試合から適用します。');break;
      case 'timePanel':showModal('残り時間を調整',`<label>残り秒数<input id="time-seconds" type="number" min="0" max="10800" value="${Math.ceil(Game.remaining(game)/1000)}"></label>${btn('変更する','timeApply','','primary')}`);break;
      case 'timeApply':{const seconds=Number($('#time-seconds').value);closeModal();run({type:'timerSet',seconds});break;}
      case 'resetSettings':if(confirm('次の試合の設定を標準ルールに戻しますか？')){rules={...Game.defaults};Store.write('settings',rules);render();}break;
    }}catch(err){toast(err.message);}
  });
  function formatTime(ms){const n=Math.ceil(ms/1000);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  setInterval(()=>{
    if(!game||game.stage!=='battle'||game.result)return;
    checkClock();const n=Game.remaining(game);if($('#timer'))$('#timer').textContent=formatTime(n);
    if(n<=0){closeModal();run({type:'timeout'},false);if(screen!=='battle')toast('対戦時間が終了しました。試合を再開して判定を確認してください。');}
  },500);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){Notifications.clear();Presentation.clear();}if(game&&document.hidden){game=Game.lock(game);closeModal();render();persist();}});
  window.addEventListener('pagehide',()=>{if(game)persist();});
  render();
})();
