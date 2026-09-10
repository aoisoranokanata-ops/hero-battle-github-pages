/* 画面と操作。カード能力の文章は自動解析せず、そのまま表示する。 */
(() => {
  'use strict';
  const $=s=>document.querySelector(s), esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const btn=(text,action,extra='',style='')=>`<button data-action="${action}" ${extra} class="${style}">${text}</button>`;
  let decks=Store.read('decks',[]), rules=Store.read('settings',{...Game.defaults}), saved=Store.read('match',null);
  let game=saved?.version===1?saved.game:null, history=saved?.version===1?saved.history||[]:[];
  let screen='home', draft={name:'',player:'',team:'',cards:[]}, query='', rarity='', editId=null, toastTimer;
  if(!Array.isArray(decks)) decks=[];
  try {rules=Game.settings(rules);} catch {rules={...Game.defaults};}
  const app=$('#app'), modal=$('#modal');
  const persist=()=>{Store.write('match',{version:1,source:CARD_SOURCE.sha256,game,history});saveWarning();};
  const saveWarning=()=>{$('#save-warning').textContent=Store.error;};
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
  function showModal(title,body){$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;if(!modal.open)modal.showModal();}
  function closeModal(){modal.close();}
  $('#close-modal').onclick=closeModal;
  function run(action,zeroCheck=true){
    try {
      const before=Game.clone(game);Game.settle(before);
      const next=Game.dispatch(game,action);
      history.push(before);history=history.slice(-50);game=next;persist();render();
      if(zeroCheck) detectZero();return true;
    } catch(e){toast(e.message);return false;}
  }
  function detectZero(){
    if(!game||game.result)return;
    for(let p=0;p<2;p++)for(const c of game.players[p].field)if(c.troop===0){
      showModal('兵力が0になりました',`<p class="detail-text">${esc(Game.card(c.id).name)}をトラッシュへ移しますか？</p><p>移動すると敵陣突破の判定も行います。</p><div class="row">${btn('トラッシュへ移す','trash',`data-player="${p}" data-id="${c.id}" data-zone="field"`,'primary')}${btn('あとで確認','close')}</div>`);return;
    }
  }
  function navigate(next){closeModal();screen=next;render();window.scrollTo(0,0);}
  function home(){
    return `${game?`<div class="resume row"><div><strong>前回の試合が保存されています</strong><br><small>${esc(game.players[0].name)} 対 ${esc(game.players[1].name)} · ${game.turn}ターン${game.result?' · 終了':''}</small></div>${btn('前回の試合を再開','resume','','primary')}</div>`:''}
      <section class="hero"><div><p class="eyebrow">紙カードといっしょに、対戦を。</p><h1>英雄列伝バトル<span>神々編</span></h1><p>英雄を選び、デッキを組み、いざ対戦。<br>ライフや兵力の計算は、このゲームマットにおまかせ。</p><div class="hero-actions">${btn('対戦を始める →','setup','','primary')}${btn('デッキを作る','newDeck')}</div></div><div class="mat-preview" aria-label="対戦マットのイメージ"><div class="preview-line"><div><small>対戦の準備</small><h2>紙のカードを、机の上へ。</h2></div><div><small>初期ライフ</small><div class="preview-number">${rules.life}</div></div></div><div class="preview-slots"><div class="preview-slot">山札</div><div class="preview-slot">場</div><div class="preview-slot">手札</div></div><div class="preview-caption">引くカードは、実物のカードで決めます</div></div></section>
      <section class="steps"><div><span class="step-number">01 / デッキを用意</span><h3>108枚から、10枚を選ぼう</h3><p>レアリティの枚数を確認しながら、自分だけのデッキを保存。</p></div><div><span class="step-number">02 / 紙で引いて登録</span><h3>引いたカードをタップ</h3><p>山札・手札・場・トラッシュを、紙カードに合わせて管理。</p></div><div><span class="step-number">03 / 相談しながら対戦</span><h3>スキルを読んで、作戦を立てよう</h3><p>効果の補正も、操作を戻すことも。2人で1台を使えます。</p></div></section><p class="muted">収録：UR 9枚 ／ SSR 27枚 ／ SR 27枚 ／ R 45枚</p>`;
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
    return `<div class="page-head"><h1>対戦を始める</h1></div><p>2人分の保存デッキを選びます。同じデッキも選択できます。</p>${!decks.length?`<div class="panel empty"><p>先にデッキを1つ以上保存してください。</p>${btn('デッキを作る','newDeck','','primary')}</div>`:`<div class="panel"><div class="form-grid">${['A','B'].map((v,i)=>`<label>プレイヤー${v}のデッキ<select id="match-deck-${i}">${decks.map(d=>`<option value="${d.id}">${esc(d.name)}${d.player?' ／ '+esc(d.player):''}</option>`).join('')}</select></label>`).join('')}<label>先に始めるプレイヤー<select id="first"><option value="0">プレイヤーA</option><option value="1">プレイヤーB</option></select></label><label>試合時間<select id="time-preset"><option value="10">予選 10分</option><option value="12">準決勝 12分</option><option value="15">決勝 15分</option><option value="20">最終決戦 20分</option><option value="custom">自由に設定</option></select></label><label id="custom-time-label" hidden>試合時間（分）<input id="custom-time" type="number" min="1" max="180" value="10"></label></div><div class="notice">初期手札 ${rules.initialHand}枚 · ライフ ${rules.life} · 開始エネルギー ${rules.startEnergy}<br>設定は試合開始時に固定されます。</div>${btn('紙の手札を登録する →','createMatch','','primary wide-button')}</div>`}`;
  }
  function initial(){
    return `<div class="page-head"><div><p class="eyebrow">対戦の準備</p><h1>最初の手札を登録</h1></div>${btn('1つ戻す','undo',history.length?'':'disabled')}</div><p>実物のカードをシャッフルして${game.rules.initialHand}枚ずつ引き、引いたカードを選んでください。</p><div class="battle-grid">${game.players.map((p,i)=>`<section class="player"><h2>${esc(p.name)}</h2><p>${esc(p.team)} · ${esc(p.deckName)}</p><p><b>${p.hand.length} / ${game.rules.initialHand}枚を選択</b></p>${p.original.map(id=>btn(`<span>${id} ${esc(Game.card(id).name)}</span><span>${p.hand.includes(id)?'✓ 選択済み':'選ぶ'}</span>`,'initial',`data-player="${i}" data-id="${id}" aria-pressed="${p.hand.includes(id)}"`,p.hand.includes(id)?'list-choice selected':'list-choice')).join('')}</section>`).join('')}</div><div class="battle-actions">${btn('対戦開始','start',game.players.every(p=>p.hand.length===game.rules.initialHand)?'':'disabled','primary wide-button')}</div>`;
  }
  const stateLabels=c=>[c.summonedThisTurn&&!game.rules.summonAttack?'今ターン攻撃不可':'',c.attackedThisTurn?'攻撃済み':'',c.cannotAttack?'攻撃不能':'',c.skillDisabled?'スキル無効':'',c.traitDisabled?'特性無効':'',c.troop===0?'兵力0：トラッシュ確認':''].filter(Boolean).map(t=>`<span class="state ${t.includes('不能')||c.troop===0?'bad':''}">${t}</span>`).join(' ');
  function fieldCard(c,p){
    const raw=Game.card(c.id), attack=p===game.active&&Game.attackable(game,c);
    return `<article class="card ${raw.rarity} ${c.troop===0?'zero':''}"><span class="badge">${c.id} · ${raw.rarity}</span><h3>${esc(raw.name)}</h3><small>コスト ${raw.cost}</small><div class="stats"><span>攻 <strong>${c.attack}</strong></span><span>防 <strong>${c.defense}</strong></span></div><div class="troop">${c.troop} / ${c.maxTroop}<small> 兵力</small></div><meter min="0" max="${c.maxTroop}" value="${c.troop}" aria-label="${esc(raw.name)}の兵力"></meter><div>${stateLabels(c)}</div>${c.note?`<p class="notice">${esc(c.note)}</p>`:''}<div class="card-actions">${btn('スキル・特性','detail',`data-player="${p}" data-id="${c.id}"`)}${btn('効果','effects',`data-player="${p}" data-id="${c.id}" ${game.result?'disabled':''}`)}</div><div class="card-actions">${btn('攻撃','attackSelect',`data-player="${p}" data-id="${c.id}" ${attack?'':'disabled'}`,'primary')}${c.troop===0?btn('トラッシュ','trashConfirm',`data-player="${p}" data-id="${c.id}"`,'danger'):''}</div></article>`;
  }
  function playerPanel(p,i){
    const ended=!!game.result;
    return `<section class="player ${i===game.active?'active':''} ${i?'player-b':''}"><div class="identity"><span class="badge player-mark">プレイヤー${i?'B':'A'}${i===game.active?' · あなたのターン':''}</span><h2>${esc(p.name)}</h2><small>${esc(p.team)}${p.team?' ／ ':''}${esc(p.deckName)}</small></div><div class="counters"><div class="counter life"><div>ライフ</div><div class="big">${p.life}</div>${btn('−','life',`data-player="${i}" data-delta="-1" aria-label="${esc(p.name)}のライフを1減らす" ${ended?'disabled':''}`)} ${btn('＋','life',`data-player="${i}" data-delta="1" aria-label="${esc(p.name)}のライフを1増やす" ${ended?'disabled':''}`)} ${btn('調整','lifePanel',`data-player="${i}" ${ended?'disabled':''}`)}</div><div class="counter"><div>エネルギー</div><div class="big">${p.energy}<small> / ${p.maxEnergy}</small></div>${btn('−','energy',`data-player="${i}" data-delta="-1" aria-label="${esc(p.name)}のエネルギーを1減らす" ${ended?'disabled':''}`)} ${btn('＋','energy',`data-player="${i}" data-delta="1" aria-label="${esc(p.name)}のエネルギーを1増やす" ${ended?'disabled':''}`)}</div></div><div class="zones">${btn(`山札 ${p.deck.length}枚`,'zone',`data-player="${i}" data-zone="deck"`)}${btn(`トラッシュ ${p.trash.length}枚`,'zone',`data-player="${i}" data-zone="trash"`)}${btn('カードを1枚引く','drawPanel',`data-player="${i}" ${ended?'disabled':''}`)}</div><div class="row"><h3>場 <small>${p.field.length} / ${game.rules.fieldLimit}</small></h3><small>攻撃・防御・兵力</small></div><div class="field-grid">${p.field.map(c=>fieldCard(c,i)).join('')}${Array.from({length:Math.max(0,game.rules.fieldLimit-p.field.length)},()=>'<div class="empty-slot">場の空き</div>').join('')}</div><div class="divider"></div><div class="row"><h3>手札 ${p.hand.length}枚</h3>${btn(p.hidden?'手札を表示':'手札を隠す','hide',`data-player="${i}" ${ended?'disabled':''}`)}</div><div class="hand">${p.hidden?'<p class="muted">手札は隠れています</p>':p.hand.length?p.hand.map(id=>btn(`<small>${id} · コスト ${Game.card(id).cost}</small>${esc(Game.card(id).name)}`,'handCard',`data-player="${i}" data-id="${id}"`)).join(''):'<p class="muted">手札はありません</p>'}</div></section>`;
  }
  function battle(){
    if(!game)return home();if(game.stage==='setup')return initial();
    const p=game.players[game.active],winner=game.result?.winner;
    return `<div class="battle-toolbar"><div><small>${game.turn}ターン目 · ${p.turns}回目の自分のターン</small><h2>${esc(p.name)} <small>のターン</small></h2></div><div class="row"><div><small>残り時間</small><div class="timer" id="timer">${formatTime(Game.remaining(game))}</div></div>${btn(game.timer.running?'一時停止':'再開','timer',game.result?'disabled':'')}</div>${btn('1つ戻す','undo',history.length?'':'disabled')}</div>
      ${game.result?`<section class="winner" role="status"><p>${winner===null?'':esc(game.players[winner].name)+'<br>'+esc(game.players[winner].team)}</p><h2>${winner===null?'引き分け／代表カード決戦':'勝利！'}</h2><p>${esc(game.result.reason)}</p>${game.result.scores?`<p>ライフ / 場の兵力 / 手札<br>A：${game.result.scores[0].join(' / ')}<br>B：${game.result.scores[1].join(' / ')}</p>`:''}<small>誤操作の場合は「1つ戻す」で修正できます。</small></section>`:`<div class="notice" role="status">${esc(game.notice)}</div>`}
      <div class="battle-grid">${game.players.map(playerPanel).join('')}</div><div class="battle-actions">${game.pendingDraw?btn('ターン開始のドローを登録','drawPanel',`data-player="${game.active}" ${game.result?'disabled':''}`,'primary'):btn(game.phase==='ended'?'このターンの攻撃は終了':game.phase==='attack'?'攻撃フェイズ中':'攻撃フェイズ開始','attackPhase',game.result||game.phase!=='main'?'disabled':'','primary')}${btn('ターン終了 →','endTurn',game.result||game.pendingDraw?'disabled':'')}</div><details class="panel" open><summary>対戦ログ <small>直近500件・50操作まで戻せます</small></summary><div class="log">${game.log.slice().reverse().map(l=>`<p><time>${esc(l.at)}</time>${esc(l.text)}</p>`).join('')}</div></details>`;
  }
  function settingsScreen(){
    const names={life:'初期ライフ',initialHand:'初期手札',fieldLimit:'場の最大数',startEnergy:'開始エネルギー',maxEnergy:'最大エネルギー',minDamage:'最低ダメージ'};
    const limits={life:[1,999],initialHand:[0,10],fieldLimit:[1,10],startEnergy:[1,99],maxEnergy:[1,99],minDamage:[0,99]};
    return `<div class="page-head"><h1>先生向け設定</h1></div><p>変更は次に始める試合から有効です。進行中の試合は開始時の設定を使用します。</p><form id="settings-form" class="panel"><div class="form-grid">${Object.entries(names).map(([key,name])=>`<label>${name}<input type="number" name="${key}" min="${limits[key][0]}" max="${limits[key][1]}" value="${rules[key]}" required></label>`).join('')}</div><div class="divider"></div><div class="checks">${[['deckOutLose','山札切れで敗北'],['summonAttack','召喚したターンも攻撃可能'],['overheal','ライフ上限を超える回復を許可']].map(([k,n])=>`<label><input type="checkbox" name="${k}" ${rules[k]?'checked':''}> ${n}</label>`).join('')}</div><div class="notice">標準ルールは開始エネルギー1です。最小コストは3のため、通常は最初の2回の自分のターンにカードを出せません。</div><div class="row"><button type="submit" class="primary">設定を保存</button>${btn('標準ルールに戻す','resetSettings','type="button"')}</div></form>`;
  }
  function rulesScreen(){
    return `<section class="rules"><p class="eyebrow">遊び方</p><h1>紙カードと、このゲームマットで。</h1><div class="panel"><h2>1. 準備する</h2><ol><li>1人10枚。URは1枚まで、SSRは2枚まで、SRは3枚まで、Rは4枚以上。同じ番号は1枚です。</li><li>保存デッキを選び、紙のカードをシャッフル。実際に引いた初期手札3枚を登録します。</li><li>先攻を決めて開始。初期ライフは20、場は最大3枚です。</li></ol></div><div class="panel"><h2>2. 自分のターン</h2><ol><li>紙で1枚引き、アプリの山札からそのカードを選びます。山札がなくても標準では敗北しません。</li><li>最大エネルギーが1増え、全回復します。各プレイヤーの初回は1、上限は10です。</li><li>エネルギーを払い、手札から場へ。必要なら出す前にコストを手動補正します。</li><li>「攻撃フェイズ開始」を押し、攻撃カードと相手の対象を選びます。</li><li>「ターン終了」で交代。一時効果の解除は効果メモを見て手動で行います。</li></ol></div><div class="panel"><h2>3. 攻撃する</h2><ul><li>通常は1枚につき1ターン1回。出したターンは攻撃できません。</li><li>ダメージは攻撃力−防御力、最低1です。兵力0で確認後にトラッシュへ移します。</li><li><b>攻撃開始時に敵の場があれば、そのターンはライフを直接攻撃できません。</b>最後の敵を倒すと「敵陣突破」で攻撃終了です。</li><li>攻撃開始時から敵の場が空なら、攻撃力ぶんのライフを直接減らせます。</li><li>ライフ0で勝利。時間切れはライフ → 場の現在兵力合計 → 手札枚数で比較します。</li></ul></div><div class="panel"><h2>4. スキルと特性</h2><p>カードの「スキル・特性」でExcelの全文を読み、相談して効果を決めます。「効果」で攻撃力・防御力・兵力・最大兵力・状態・メモを調整できます。</p><p>追加ドローやエネルギー、ライフ回復、手札を捨てる操作も手動で行えます。再攻撃は「攻撃済みを解除」。補正はターン交代で勝手に解除されません。</p><p>間違えたら「1つ戻す」。試合は自動保存されます。タイマーは一時停止しない限り、画面を閉じている間も進みます。</p></div><p class="muted">先生設定で標準ルールを変更できます。カード数値・効果は原本の「仮設定・バランス未検証」を収録しています。</p></section>`;
  }
  function render(){
    app.innerHTML=({home,builder,decks:deckScreen,setup,battle,settings:settingsScreen,rules:rulesScreen}[screen]||home)();
    if(screen==='builder')updateBuilder();saveWarning();
  }
  function detail(id,p){
    const c=Game.card(id),u=p===undefined?null:game?.players[p].field.find(c=>c.id===id);
    showModal(`${id} ${c.name}`,`<span class="badge">${c.rarity}</span><p class="eyebrow">${esc(c.title)}</p><p>${esc(c.type)}</p><div class="stats"><span>コスト <strong>${c.cost}</strong></span><span>攻 <strong>${c.attack}</strong></span><span>防 <strong>${c.defense}</strong></span><span>兵 <strong>${c.troop}</strong></span></div><p class="detail-text">${esc(c.direction)}</p><div class="divider"></div><h3>スキル：${esc(c.skillName)} ${u?.skillDisabled?'<span class="state bad">スキル無効</span>':''}</h3><p class="detail-text">${esc(c.skillText)}</p><h3>特性：${esc(c.traitName)} ${u?.traitDisabled?'<span class="state bad">特性無効</span>':''}</h3><p class="detail-text">${esc(c.traitText)}</p><p class="detail-text">${esc(c.quote)}</p>${u?`<p>${stateLabels(u)}</p><p>${esc(u.note)}</p>${btn('効果補助パネル','effects',`data-player="${p}" data-id="${id}" ${game.result?'disabled':''}`,'primary')}`:''}<div class="divider"></div><small>原本：${esc(CARD_SOURCE.sheet)} ${c.sourceRow}行<br>${esc(c.settingStatus)}${c.notes?'<br>'+esc(c.notes):''}</small>`);
  }
  function effects(p,id){
    const c=game.players[p].field.find(c=>c.id===id);if(!c)return closeModal();
    showModal(`${Game.card(id).name} · 効果補助`,`${['attack','defense','troop','maxTroop'].map(key=>`<div class="effect-row"><h3>${{attack:'攻撃力',defense:'防御力',troop:'現在兵力',maxTroop:'最大兵力'}[key]}：${c[key]}${key==='troop'?' / '+c.maxTroop:''}</h3><div class="row">${[-3,-2,-1].map(n=>btn(String(n).replace('-','−'),'adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-delta="${n}"`)).join('')}${key==='attack'||key==='defense'?btn('リセット','adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-reset="true"`):''}${[1,2,3].map(n=>btn('＋'+n,'adjust',`data-player="${p}" data-id="${id}" data-key="${key}" data-delta="${n}"`)).join('')}</div></div>`).join('')}<div class="effect-row checks">${[['cannotAttack','攻撃不能'],['skillDisabled','スキル無効'],['traitDisabled','特性無効']].map(([k,n])=>`<label><input type="checkbox" data-flag="${k}" data-player="${p}" data-id="${id}" ${c[k]?'checked':''}> ${n}</label>`).join('')}</div>${btn('攻撃済みを解除','resetAttack',`data-player="${p}" data-id="${id}" ${c.attackedThisTurn?'':'disabled'}`)}<label class="field-label">効果メモ<textarea id="effect-note" maxlength="1000" placeholder="例：次の自分ターン開始まで攻撃力−2">${esc(c.note)}</textarea></label><div class="row">${btn('メモを保存','saveNote',`data-player="${p}" data-id="${id}"`,'primary')}${btn('トラッシュへ移す','trashConfirm',`data-player="${p}" data-id="${id}" data-zone="field"`,'danger')}</div><p class="muted">スキルの効果と一時補正は、自分たちで確認・解除してください。</p>`);
  }
  function zone(p,z,draw=false){
    const player=game.players[p];
    if(draw&&!player.deck.length){closeModal();run({type:'draw',player:p});toast('山札がなくなりました。以後ドローせずゲームを続けます');return;}
    showModal(`${player.name} · ${draw?'引いたカードを選ぶ':z==='deck'?'山札':'トラッシュ'}`,`${draw?'<p>実物の紙カードで引いた1枚をタップしてください。</p>':''}${player[z].length?player[z].map(id=>btn(`<span>${id} ${esc(Game.card(id).name)}</span><small>${draw?'手札へ':'詳細'}</small>`,draw?'draw':'detail',`data-player="${p}" data-id="${id}"`,'list-choice')).join(''):'<p class="empty">カードはありません。</p>'}`);
  }
  function handCard(p,id){
    const c=Game.card(id),can=p===game.active&&game.phase==='main'&&!game.pendingDraw&&!game.result;
    showModal(`${id} ${c.name}`,`<p>基本コスト：<b>${c.cost}</b></p><label>コスト補正（手動）<input id="cost-mod" type="number" step="1" min="${-c.cost}" max="99" value="0" data-base="${c.cost}"></label><div class="row">${btn('−','costStep','data-delta="-1"')}${btn('＋','costStep','data-delta="1"')}</div><p class="count">実際の消費：<span id="actual-cost">${c.cost}</span></p><p>現在エネルギー：${game.players[p].energy}</p><p class="muted">${can?'場は最大'+game.rules.fieldLimit+'枚です。':'自分の準備フェイズに場へ出せます。'}</p><div class="row">${btn('場に出す','summon',`data-player="${p}" data-id="${id}" ${can?'':'disabled'}`,'primary')}${btn('スキル・特性','detail',`data-id="${id}"`)}${btn('手札から捨てる','trashConfirm',`data-player="${p}" data-id="${id}" data-zone="hand" ${game.result?'disabled':''}`,'danger')}</div>`);
  }
  function attackSelect(p,id){
    const enemy=game.players[1-p],a=game.players[p].field.find(c=>c.id===id);
    if(!a||!Game.attackable(game,a))return toast('このカードは今、攻撃できません');
    showModal(`${Game.card(id).name} · 攻撃先を選ぶ`,enemy.field.length?enemy.field.filter(c=>c.troop>0).map(d=>btn(`${esc(Game.card(d.id).name)} · ${Game.damage(game,a,d)}ダメージ`,'attackConfirm',`data-player="${p}" data-id="${id}" data-target="${d.id}"`,'list-choice')).join(''):!game.enemyAtStart?btn(`相手のライフへ · ${a.attack}ダメージ`,'attackConfirm',`data-player="${p}" data-id="${id}" data-target="life"`,'primary full'):'<p>このターンはライフへ直接攻撃できません。</p>');
  }
  function lifePanel(p){showModal(`${game.players[p].name} · ライフ調整`,`<p class="count">ライフ ${game.players[p].life}</p><div class="row">${[-5,-3,-2,-1,1,2,3,5].map(n=>btn(n>0?'＋'+n:String(n).replace('-','−'),'lifeAdjust',`data-player="${p}" data-delta="${n}"`)).join('')}</div><p>上限を超える回復：${game.rules.overheal?'許可':'不許可（上限'+game.rules.life+'）'}</p>`);}
  function updateCost(){const input=$('#cost-mod');let v=Number(input.value);$('#actual-cost').textContent=Number.isInteger(v)?Math.max(0,Number(input.dataset.base)+v):'整数を入力';}
  document.addEventListener('input',e=>{
    if(e.target.id==='search'){query=e.target.value;updateBuilder();}
    const key={'deck-name':'name','deck-player':'player','deck-team':'team'}[e.target.id];if(key){draft[key]=e.target.value;$('#save-deck').disabled=!Game.validateDeck(draft.cards).valid||!draft.name.trim();}
    if(e.target.id==='cost-mod')updateCost();
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='time-preset')$('#custom-time-label').hidden=e.target.value!=='custom';
    if(e.target.dataset.flag){const d=e.target.dataset,p=Number(d.player);if(run({type:'flag',player:p,id:d.id,key:d.flag,value:e.target.checked},false))effects(p,d.id);}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='settings-form')return;e.preventDefault();const form=new FormData(e.target),next={};
    Object.entries(Game.defaults).forEach(([k,v])=>next[k]=typeof v==='boolean'?form.has(k):Number(form.get(k)));
    try {rules=Game.settings(next);Store.write('settings',rules);saveWarning();toast('設定を保存しました。次の試合から有効です。');}catch(err){toast(err.message);}
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.nav){navigate(b.dataset.nav);return;}
    const d=b.dataset,p=d.player===undefined?undefined:Number(d.player),id=d.id,delta=Number(d.delta),act=d.action;
    try {switch(act){
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
        if(game&&!confirm('保存中の試合を置き換えて、新しい試合を始めますか？'))break;
        const ds=[0,1].map(i=>decks.find(d=>d.id===$('#match-deck-'+i).value));const minutes=Number($('#time-preset').value==='custom'?$('#custom-time').value:$('#time-preset').value);
        if(!Number.isFinite(minutes)||minutes<1||minutes>180)throw Error('試合時間は1～180分で指定してください');
        game=Game.create(ds,rules,minutes*60,Number($('#first').value));history=[];persist();navigate('battle');break;
      }
      case 'resume':if(saved?.source&&saved.source!==CARD_SOURCE.sha256)toast('カード原本が更新されています。対戦中の数値は保存値を使用します。');navigate('battle');detectZero();break;
      case 'initial':run({type:'initial',player:p,id},false);break;
      case 'start':if(confirm('最初の手札を確認して、対戦とタイマーを開始しますか？'))run({type:'start'});break;
      case 'undo':{
        if(!history.length)break;if(!confirm('直前の操作を1つ戻しますか？ タイマーもその時点へ戻ります。'))break;
        game=history.pop();if(game.timer.running)game.timer.at=Date.now();closeModal();persist();render();toast('1つ前の状態に戻しました');break;
      }
      case 'zone':zone(p,d.zone);break;
      case 'drawPanel':zone(p,'deck',true);break;
      case 'draw':if(run({type:'draw',player:p,id}))closeModal();break;
      case 'handCard':handCard(p,id);break;
      case 'costStep':$('#cost-mod').value=Math.max(-Number($('#cost-mod').dataset.base),Number($('#cost-mod').value)+delta);updateCost();break;
      case 'summon':{const mod=Number($('#cost-mod').value);if(!Number.isInteger(mod))throw Error('補正は整数で入力してください');const cost=Math.max(0,Game.card(id).cost+mod);if(confirm(`${Game.card(id).name}を消費コスト${cost}で場に出しますか？`)&&run({type:'summon',player:p,id,cost}))closeModal();break;}
      case 'attackPhase':if(confirm('攻撃フェイズを開始しますか？ この後はカードを場に出せません。'))run({type:'attackPhase'});break;
      case 'attackSelect':attackSelect(p,id);break;
      case 'attackConfirm':{const a=game.players[p].field.find(c=>c.id===id),target=d.target,n=target==='life'?a.attack:Game.damage(game,a,game.players[1-p].field.find(c=>c.id===target));if(confirm(`${n}ダメージを与えますか？`)){closeModal();run({type:'attack',player:p,id,target});}break;}
      case 'effects':effects(p,id);break;
      case 'adjust':if(run({type:'adjust',player:p,id,key:d.key,delta,reset:d.reset==='true'},false)){const c=game.players[p].field.find(c=>c.id===id);if(c.troop===0)detectZero();else effects(p,id);}break;
      case 'resetAttack':if(confirm('特殊効果により、攻撃済みを解除しますか？')&&run({type:'flag',player:p,id,key:'attackedThisTurn',value:false},false))effects(p,id);break;
      case 'saveNote':if(run({type:'note',player:p,id,value:$('#effect-note').value},false)){effects(p,id);toast('効果メモを保存しました');}break;
      case 'trashConfirm':if(confirm('このカードをトラッシュへ移しますか？')){closeModal();run({type:'trash',player:p,id,zone:d.zone||'field'});}break;
      case 'trash':closeModal();run({type:'trash',player:p,id,zone:d.zone||'field'});break;
      case 'lifePanel':lifePanel(p);break;
      case 'lifeAdjust':if(run({type:'life',player:p,delta},false)){if(game.result)closeModal();else lifePanel(p);}break;
      case 'life':case 'energy':case 'hide':run({type:act,player:p,delta});break;
      case 'endTurn':if(confirm('ターンを終了して、相手に交代しますか？ 一時効果は手動で確認してください。'))run({type:'endTurn'});break;
      case 'timer':run({type:'timer'},false);break;
      case 'resetSettings':if(confirm('次の試合の設定を標準ルールに戻しますか？')){rules={...Game.defaults};Store.write('settings',rules);render();}break;
    }}catch(err){toast(err.message);}
  });
  function formatTime(ms){const n=Math.ceil(ms/1000);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  setInterval(()=>{
    if(!game||game.stage!=='battle'||game.result)return;
    const n=Game.remaining(game);if($('#timer'))$('#timer').textContent=formatTime(n);
    if(n<=0){closeModal();run({type:'timeout'},false);if(screen!=='battle')toast('対戦時間が終了しました。試合を再開して判定を確認してください。');}
  },500);
  document.addEventListener('visibilitychange',()=>{if(game)persist();});
  window.addEventListener('pagehide',()=>{if(game)persist();});
  render();
})();
