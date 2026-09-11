/* 対戦のルール。カード原本と対戦中の数値を分離する。 */
(function (root) {
  'use strict';
  const defaults = {life:20, initialHand:3, fieldLimit:3, startEnergy:1, maxEnergy:10, minDamage:1, deckOutLose:false, summonAttack:false, overheal:false};
  const clone = x => JSON.parse(JSON.stringify(x));
  const card = id => { const c = root.CARD_DATA.find(c => c.id === id); if (!c) throw Error('カードが見つかりません：' + id); return c; };
  const requireRule = (ok, message) => { if (!ok) throw Error(message); };
  function validateDeck(ids) {
    const counts = {UR:0,SSR:0,SR:0,R:0}, errors = [];
    for (const id of ids) { const c = root.CARD_DATA.find(c => c.id === id); if (c) counts[c.rarity]++; else errors.push('不明なカードがあります'); }
    if (ids.length !== 10) errors.push(`カードを10枚選んでください（現在${ids.length}枚）`);
    if (new Set(ids).size !== ids.length) errors.push('同じ番号のカードは1枚までです');
    for (const [r, n] of [['UR',1],['SSR',2],['SR',3]]) if (counts[r] > n) errors.push(`${r}は${n}枚までです`);
    if (counts.R < 4) errors.push(`Rがあと${4-counts.R}枚必要です`);
    return {counts, errors, valid:errors.length === 0};
  }
  function settings(input) {
    const s = {...defaults, ...input};
    for (const [key,min,max] of [['life',1,999],['initialHand',0,10],['fieldLimit',1,10],['startEnergy',1,99],['maxEnergy',1,99],['minDamage',0,99]])
      requireRule(Number.isInteger(s[key]) && s[key]>=min && s[key]<=max, '設定値の範囲を確認してください');
    requireRule(s.startEnergy <= s.maxEnergy, '開始エネルギーは最大エネルギー以下にしてください');
    return s;
  }
  function unit(id) { const c = card(id); return {id, attack:c.attack, defense:c.defense, troop:c.troop, maxTroop:c.troop, summonedThisTurn:true, attackedThisTurn:false, cannotAttack:false, skillDisabled:false, traitDisabled:false, note:''}; }
  function create(decks, rules, seconds, first=0) {
    const s = settings(rules);
    decks.forEach(d => requireRule(validateDeck(d.cards).valid, '対戦にはルールに合う10枚のデッキが必要です'));
    requireRule(Number.isFinite(seconds) && seconds >= 1, '対戦時間を設定してください');
    return {version:1, rules:s, players:decks.map((d,i)=>({name:d.player || `プレイヤー${i?'B':'A'}`, team:d.team || '', deckName:d.name, original:[...d.cards], deck:[...d.cards], hand:[], field:[], trash:[], life:s.life, energy:0, maxEnergy:0, turns:0, hidden:false})), active:first, turn:0, stage:'setup', phase:'main', enemyAtStart:false, pendingDraw:false, result:null, notice:'紙カードをシャッフルして、最初の手札を登録してください。', timer:{remaining:seconds*1000,running:false,at:null}, log:[]};
  }
  function remaining(g, now=Date.now()) { return Math.max(0, g.timer.remaining - (g.timer.running ? Math.max(0,now-g.timer.at) : 0)); }
  function settle(g, now=Date.now()) { g.timer.remaining=remaining(g,now); g.timer.at=g.timer.running?now:null; }
  function finish(g, winner, reason) { g.result={winner,reason}; settle(g); g.timer.running=false; g.timer.at=null; }
  function lifeCheck(g) { const dead=g.players.map(p=>p.life<=0); if(dead[0]||dead[1]) finish(g,dead[0]&&dead[1]?null:dead[0]?1:0,'ライフが0になりました'); }
  function timeout(g) {
    const score=p=>[p.life,p.field.reduce((n,c)=>n+c.troop,0),p.hand.length];
    const a=score(g.players[0]),b=score(g.players[1]); let winner=null,reason='引き分け／代表カード決戦';
    for(let i=0;i<3;i++) if(a[i]!==b[i]) {winner=a[i]>b[i]?0:1;reason=['ライフ','場の現在兵力合計','手札枚数'][i]+'による時間切れ判定';break;}
    finish(g,winner,reason); g.result.scores=[a,b];
  }
  function startTurn(g) {
    const p=g.players[g.active]; g.turn++; p.turns++;
    p.maxEnergy=p.turns===1?g.rules.startEnergy:Math.min(g.rules.maxEnergy,p.maxEnergy+1); p.energy=p.maxEnergy;
    p.field.forEach(c=>{c.summonedThisTurn=false;c.attackedThisTurn=false;});
    g.phase='main';g.enemyAtStart=false;g.pendingDraw=p.deck.length>0;
    g.notice=g.pendingDraw?'紙でカードを1枚引き、引いたカードを登録してください。':'山札がなくなりました。以後ドローせずゲームを続けます';
    if(!p.deck.length && g.rules.deckOutLose) finish(g,1-g.active,'山札切れ（先生設定）');
  }
  function attackable(g,c) {return g.stage==='battle' && !g.result && g.phase==='attack' && !g.pendingDraw && c.troop>0 && !c.attackedThisTurn && !c.cannotAttack && (g.rules.summonAttack || !c.summonedThisTurn);}
  function damage(g,a,d) {return Math.max(g.rules.minDamage,a.attack-d.defense);}
  function breakthrough(g) {
    if(g.phase==='attack' && g.enemyAtStart && !g.players[1-g.active].field.length) {
      g.phase='ended';g.notice='敵陣を突破しました！ このターンの攻撃はここで終了します。ライフへの直接攻撃は次の攻撃フェイズから可能です。';
    }
  }
  function dispatch(original, action) {
    const g=clone(original);settle(g);
    requireRule(!g.result,'この試合は終了しています。「1つ戻す」で修正できます');
    const p=g.players[action.player ?? g.active], active=g.players[g.active];
    let message='', c;
    const field=()=> { const c=p.field.find(c=>c.id===action.id);requireRule(c,'場のカードが見つかりません');return c;};
    const own=()=>requireRule((action.player??g.active)===g.active,'自分のターンに操作してください');
    const main=()=>{own();requireRule(g.stage==='battle'&&g.phase==='main'&&!g.pendingDraw,'ターン開始のドローを登録し、攻撃前に操作してください');};
    if(g.stage==='setup') requireRule(['initial','start'].includes(action.type),'まず最初の手札を登録してください');
    switch(action.type) {
      case 'initial': {
        requireRule(g.stage==='setup','初期手札の登録は終了しています');
        const i=p.deck.indexOf(action.id),j=p.hand.indexOf(action.id);
        if(j>=0) {p.hand.splice(j,1);p.deck.push(action.id);}
        else {requireRule(i>=0,'山札にないカードです');requireRule(p.hand.length<g.rules.initialHand,'初期手札は'+g.rules.initialHand+'枚です');p.deck.splice(i,1);p.hand.push(action.id);}
        message=p.name+'：初期手札を変更';break;
      }
      case 'start': requireRule(g.stage==='setup'&&g.players.every(p=>p.hand.length===g.rules.initialHand),'両プレイヤーの初期手札を登録してください');g.stage='battle';g.timer.running=true;g.timer.at=Date.now();startTurn(g);message='対戦開始';break;
      case 'draw': {
        requireRule(g.stage==='battle','対戦を開始してください');
        if(!p.deck.length) {g.notice='山札がなくなりました。以後ドローせずゲームを続けます';if(g.rules.deckOutLose)finish(g,1-(action.player??g.active),'山札切れ（先生設定）');message=p.name+'：山札なし';break;}
        const i=p.deck.indexOf(action.id);requireRule(i>=0,'山札から実際に引いたカードを選んでください');p.deck.splice(i,1);p.hand.push(action.id);
        if((action.player??g.active)===g.active&&g.pendingDraw) {g.pendingDraw=false;g.notice='準備フェイズ：手札からカードを場に出せます。';}
        message=p.name+'：'+card(action.id).name+'を引く';break;
      }
      case 'summon': {
        main();const i=p.hand.indexOf(action.id);requireRule(i>=0,'手札にないカードです');requireRule(p.field.length<g.rules.fieldLimit,'場は最大'+g.rules.fieldLimit+'枚です');
        const cost=action.cost??card(action.id).cost;requireRule(Number.isInteger(cost)&&cost>=0,'消費コストは0以上の整数です');requireRule(p.energy>=cost,'エネルギーが足りません');
        p.energy-=cost;p.hand.splice(i,1);p.field.push(unit(action.id));message=card(action.id).name+'を場に出す（消費'+cost+'）';break;
      }
      case 'attackPhase': main();g.phase='attack';g.enemyAtStart=g.players[1-g.active].field.length>0;g.notice=g.enemyAtStart?'相手の場のカードを攻撃できます。敵陣突破で攻撃終了です。':'この攻撃フェイズではライフへ直接攻撃できます。';message='攻撃フェイズ開始（敵陣'+g.players[1-g.active].field.length+'枚）';break;
      case 'attack': {
        own();c=field();requireRule(attackable(g,c),'このカードは今、攻撃できません');const enemy=g.players[1-g.active];
        if(action.target==='life') {
          requireRule(!g.enemyAtStart&&!enemy.field.length,'このフェイズはライフへ直接攻撃できません');
          enemy.life=Math.max(0,enemy.life-c.attack);message=card(c.id).name+' → '+enemy.name+'のライフ '+c.attack+'ダメージ';lifeCheck(g);
        } else {
          const d=enemy.field.find(c=>c.id===action.target);requireRule(d&&d.troop>0,'攻撃対象を確認してください');const n=damage(g,c,d);d.troop=Math.max(0,d.troop-n);message=card(c.id).name+' → '+card(d.id).name+' '+n+'ダメージ';
        }
        c.attackedThisTurn=true;break;
      }
      case 'trash': {
        const zone=action.zone||'field';requireRule(['field','hand'].includes(zone),'移動元が不正です');const i=p[zone].findIndex(x=>(typeof x==='string'?x:x.id)===action.id);requireRule(i>=0,'カードが見つかりません');p[zone].splice(i,1);p.trash.push(action.id);breakthrough(g);message=card(action.id).name+'をトラッシュへ';break;
      }
      case 'adjust': {
        c=field();const key=action.key;requireRule(['attack','defense','troop','maxTroop'].includes(key),'変更項目が不正です');const old=c[key];const value=action.reset?card(c.id)[key==='maxTroop'?'troop':key]:c[key]+action.delta;
        requireRule(Number.isInteger(value),'数値を確認してください');c[key]=Math.max(key==='maxTroop'?1:0,value);c.troop=Math.min(c.maxTroop,c.troop);
        message=card(c.id).name+' '+({attack:'攻撃力',defense:'防御力',troop:'兵力',maxTroop:'最大兵力'}[key])+` ${old} → ${c[key]}`;break;
      }
      case 'flag': c=field();requireRule(['cannotAttack','skillDisabled','traitDisabled','attackedThisTurn'].includes(action.key),'状態が不正です');c[action.key]=!!action.value;message=card(c.id).name+'：状態を変更';break;
      case 'note': c=field();c.note=String(action.value).slice(0,1000);message=card(c.id).name+'：効果メモを保存';break;
      case 'energy': {const old=p.energy;p.energy=Math.max(0,Math.min(g.rules.maxEnergy,p.energy+action.delta));message=p.name+` エネルギー ${old} → ${p.energy}`;break;}
      case 'life': {const old=p.life;p.life=Math.max(0,p.life+action.delta);if(!g.rules.overheal)p.life=Math.min(g.rules.life,p.life);message=p.name+` ライフ ${old} → ${p.life}`;lifeCheck(g);break;}
      case 'hide': p.hidden=!p.hidden;message=p.name+'：手札の表示を変更';break;
      case 'endTurn': own();requireRule(!g.pendingDraw,'ターン開始のドローを登録してください');requireRule(!g.players.some(p=>p.field.some(c=>c.troop===0)),'兵力0のカードをトラッシュへ移してください');g.active=1-g.active;startTurn(g);message=active.name+'のターン終了 → '+g.players[g.active].name;break;
      case 'timer': g.timer.running=!g.timer.running;g.timer.at=g.timer.running?Date.now():null;message=g.timer.running?'タイマー再開':'タイマー一時停止';break;
      case 'timeout': requireRule(remaining(g)<=0,'まだ対戦時間が残っています');timeout(g);message='時間切れ判定';break;
      default: throw Error('不明な操作です');
    }
    g.log.push({at:new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),text:message});g.log=g.log.slice(-500);
    return g;
  }
  root.Game={defaults,clone,card,validateDeck,settings,unit,create,remaining,settle,attackable,damage,dispatch};
})(globalThis);
