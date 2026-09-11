/* Excel原文に対するレビュー済みの対応表。未知・更新された文は実行時に手動へ退避する。 */
const fs=require('node:fs'),path=require('node:path');
require('../cards-data.js');
const reviewed=JSON.parse(fs.readFileSync(path.join(__dirname,'reviewed-source.json'),'utf8'));
const plan={};
const effect=(op,target,n,extra={})=>({op,target,n,...extra});
const buff=(target,stats,duration=null)=>({op:'buff',target,stats,duration});
const entry=(...effects)=>({trigger:'entry',effects});
const turn=(...effects)=>({trigger:'turnStart',effects});
const passive=(condition,stats,target='self')=>({trigger:'passive',condition,stats,target});
const manual=(trigger='entry',reason='基本ルールとの関係・効果の解釈を裁定してください。',extra={})=>({trigger,automationType:'MANUAL',reason,...extra});
const set=(id,skill,trait)=>{plan[id]={skill,trait};};
const hit=n=>effect('damage','enemy',n),heal=n=>effect('heal','ally',n),draw=n=>effect('draw','owner',n),energy=n=>effect('energy','owner',n);
const eot='turnEnd',ownStart='nextOwnStart',enemyEnd='nextEnemyEnd';
const disable=(flags,duration)=>({op:'flags',target:'enemy',flags,duration});
const discard=(target='hand')=>effect('discard',target,1);
const boost=(target,n)=>effect('grow',target,n);
const iff=(condition,yes,no=[])=>({op:'if',condition,yes,no});
const reorder=n=>effect('reorder','deck',n);
set('UR01',entry(effect('damage','enemies',3),disable(['cannotAttack'],enemyEnd)),turn(draw(1),buff('self',{attack:1},eot)));
set('UR02',entry(hit(5),buff('allies',{attack:2},eot)));
set('UR03',entry(boost('allies',2),effect('life','owner',4)),turn(effect('heal','self',1)));
set('UR04',entry(effect('heal','allies',4),buff('allies',{defense:2},eot)));
set('UR05',entry(heal(4),draw(2)));
set('UR06',manual('entry','「次の自分のターンまで」の終了時点を裁定してください。'));
set('UR07',entry(effect('damage','enemies',3),buff('enemies',{defense:-2},eot)));
set('UR08',entry(hit(4)));
set('UR09',entry(effect('damage','enemies',2),draw(1),buff('allies',{attack:1},eot)));
set('SSR01',entry(hit(3),discard('enemyHand')));
set('SSR02',entry(draw(1),buff('allies',{attack:2},eot)));
set('SSR03',entry(effect('life','owner',3)));
set('SSR04',passive('lostTroop',{attack:{lostPer:2,max:4}}));
set('SSR05',manual('entry','先に攻撃する効果と基本の攻撃手順の関係を裁定してください。'));
set('SSR06',manual('entry','再攻撃の回数とタイミングを裁定してください。登場ターンの補正も手動です。',{followup:'kill',limit:'game'}));
set('SSR07',entry(hit(3),buff('self',{defense:2},eot)));
set('SSR08',entry(draw(2),effect('discount','owner',1,{duration:eot,min:0})));
set('SSR09',entry(disable(['cannotAttack'],enemyEnd),draw(1)));
set('SSR10',entry(effect('heal','allies',3)));
set('SSR11',entry(draw(2),energy(1)));
set('SSR12',{trigger:'kill',effects:[buff('self',{attack:1})],cap:3},{trigger:'kill',effects:[effect('heal','self',2)]});
set('SSR13',entry(buff('enemies',{attack:-1},eot),draw(1)));
set('SSR14',entry(buff('enemies',{defense:-2},eot)));
set('SSR15',entry(effect('damage','enemies',2)));
set('SSR16',passive('fewerAllies',{defense:2}),{trigger:'passive',condition:'always',reduction:1});
set('SSR17',entry(hit(4)));
set('SSR18',entry(buff('enemies',{attack:-2},eot),effect('heal','self',3)));
set('SSR19',entry(effect('healCleanse','ally',4)));
set('SSR20',entry({...buff('alliesSelect',{attack:1,defense:1},eot),maxSelect:3,minSelect:0}));
set('SSR21',entry(draw(1),buff('ally',{attack:2,defense:2},eot)));
set('SSR22',entry(reorder(3),disable(['cannotAttack'],enemyEnd)));
set('SSR23',entry({op:'choice',options:[{label:'2枚引く',effects:[draw(2)]},{label:'味方1体の兵力を3回復',effects:[heal(3)]},{label:'味方1体の攻撃力＋3（このターン）',effects:[buff('ally',{attack:3},eot)]}]}));
set('SSR24',entry(buff('enemy',{attack:-3},eot),draw(2)));
set('SSR25',entry(energy(1),effect('discount','owner',2,{duration:eot,min:0})));
set('SSR26',entry(effect('discover','deck',4,{reorderRest:true})));
set('SSR27',manual('entry','「次の自分のターンまで」の無効期間を裁定してください。全体防御補正も含め手動処理します。'));
set('SR01',entry(buff('self',{attack:3},eot)));
set('SR02',entry(disable(['skillDisabled','traitDisabled'],ownStart)));
set('SR03',passive('always',{attack:{perOther:1,max:3}}));
set('SR04',{trigger:'beforeDeath',limit:'game',effects:[effect('survive','self',1)]});
set('SR05',entry(hit(4)));
set('SR06',entry(energy(2)));
set('SR07',entry(buff('allies',{attack:1,defense:1},eot)));
set('SR08',entry(iff('fewerAllies',[buff('allies',{attack:2},eot)])));
set('SR09',entry(draw(3),discard()));
set('SR10',entry(buff('enemy',{attack:-2},ownStart)),manual('combat','攻撃力が下がっている敵との戦闘中だけの防御補正を手動で適用・解除してください。',{condition:'debuffEnemy'}));
set('SR11',passive('troopLE4',{attack:3}),{trigger:'survived',limit:'turn',effects:[effect('heal','self',1)]});
set('SR12',{trigger:'afterAttack',effects:[effect('heal','ally',2,{initialCap:true})]});
set('SR13',{trigger:'battleKill',cap:3,effects:[buff('self',{attack:1})]});
set('SR14',entry(buff('allies',{attack:1},eot)));
set('SR15',passive('always',{attack:{perOther:1,max:3}}));
set('SR16',entry({...buff('ally',{attack:2,defense:2}),filter:{attackLE:4}}),turn(effect('heal','ally',1,{filter:{attackLE:4}})));
set('SR17',manual('entry','手札をランダムに見る処理と「次のターンまで」の期限は裁定が必要です。'));
set('SR18',manual('combat','かばう対象・戦闘中の補正は手動裁定です。',{limit:'turn',condition:'hasOther'}),manual('combat','かばった戦闘中だけ防御力＋2を手動で適用・解除してください。',{condition:'hasOther'}));
set('SR19',entry(effect('search','deck',1,{filter:{costLE:4},shuffle:true,public:true})));
set('SR20',entry(draw(2),discard()));
set('SR21',entry(reorder(3)),turn(effect('optionalBottom','deck',1)));
set('SR22',entry(buff('otherAlly',{attack:2,defense:2})),turn({...buff('otherAlly',{attack:1}),targetCap:2}));
set('SR23',entry(energy(2)),turn(energy(1)));
set('SR24',entry(effect('discount','owner',2,{duration:eot,min:1})),{trigger:'passive',condition:'always',firstDiscount:1});
set('SR25',entry(boost('allies',2)),passive('always',{attack:1},'woundedAllies'));
set('SR26',entry(draw(1),heal(2)),turn(heal(1)));
set('SR27',entry(iff('handLE3',[draw(1)],[buff('ally',{attack:2})])),{trigger:'passive',condition:'always',stats:{attack:{troopGE:5,value:1},defense:{troopLE:4,value:2}},target:'self'});
// 同じ原文パターンのRスキルは、IDごとに明示して対応付ける。
const many=(ids,p)=>ids.split(' ').forEach(id=>set(id,structuredClone(p)));
many('R01',entry(buff('ally',{defense:2},ownStart)));
many('R02 R10',entry(buff('otherAlly',{attack:1},eot)));
many('R03 R07 R14 R41 R44',entry(energy(1)));
many('R04 R15 R40',entry(draw(1)));
many('R05 R16 R19 R23 R27',entry(buff('otherAlly',{attack:1},ownStart)));
many('R06 R11 R25 R28 R31 R32',entry(buff('self',{attack:2},eot)));
set('R08',{trigger:'passive',condition:'entryTurn',pierce:1});
many('R09 R29',entry(buff('enemy',{attack:-1},ownStart)));
set('R12',entry(buff('otherAlly',{defense:2},ownStart)));
many('R13 R26',entry({...buff('ally',{attack:1,defense:1}),filter:{attackLE:3}}));
many('R17 R22 R37 R43 R45',entry(heal(2)));
set('R18',entry(buff('self',{defense:2},ownStart)));
set('R20',passive('troopLE4',{attack:2}),{trigger:'survived',limit:'turn',effects:[effect('heal','self',1)]});
set('R21',entry(buff('enemy',{defense:-1},eot)));
many('R24 R39',entry(buff('otherAlly',{defense:1},ownStart)));
many('R30 R38',entry(buff('otherAlly',{attack:1,defense:1})));
set('R33',entry(reorder(2)));
set('R34',entry(effect('discover','deck',3,{reorderRest:false})));
set('R35',entry(reorder(3)));
set('R36',entry(buff('otherAlly',{attack:2})));
set('R42',manual('entry','「相手より先に攻撃する」と基本ルールとの関係を裁定してください。'));
function trait(c){
 const t=c.traitText.normalize('NFKC');let m;
 const patterns=[
  [/^自分の場に他の味方がいる間、このカードの(攻撃力|防御力)\+(\d)。$/,'hasOther'],
  [/^他の味方が2体以上いる間、このカードの(攻撃力|防御力)\+(\d)。$/,'twoOthers'],
  [/^自分の手札が(\d)枚以上ある間、このカードの(攻撃力|防御力)\+(\d)。$/,'hand'],
  [/^(?:このカードの兵力が上限|兵力が初期値|自分の兵力が初期値)の(?:間|時)、(?:このカードの)?(攻撃力|防御力)\+(\d)。$/,'full'],
  [/^自分の兵力が(\d)以下の間、このカードの(攻撃力|防御力)\+(\d)。$/,'troop'],
  [/^コスト3以下の他の味方がいる間、このカードの(攻撃力|防御力)\+(\d)。$/,'cheapOther'],
  [/^相手の場のカード数が自分より多い間、このカードの(攻撃力|防御力)\+(\d)。$/,'fewerAllies'],
  [/^自分のライフが相手より少ない間、このカードの(攻撃力|防御力)\+(\d)。$/,'lessLife']
 ];
 for(const [re,cond] of patterns)if(m=t.match(re)){
  let type=m[1],n=m[2],condition=cond;
  if(cond==='hand'||cond==='troop'){condition=cond+(cond==='hand'?'GE':'LE')+m[1];type=m[2];n=m[3];}
  if(cond==='full')condition=t.includes('初期値')?'initialFull':'full';
  return passive(condition,{[type==='攻撃力'?'attack':'defense']:Number(n)});
 }
 const exact={
  'このカードが場にいる間、他の味方全体の防御力+1。':passive('always',{defense:1},'otherAllies'),
  'このカードが場にいる間、味方全体の防御力+2。':passive('always',{defense:2},'allies'),
  '登場したターン、このカードの攻撃力+2。':entry(buff('self',{attack:2},eot)),
  'この対戦で自分が後攻なら、このカードの攻撃力+2。':passive('second',{attack:2}),
  '味方の数が敵より少ない間、味方全体の攻撃力+1。':passive('fewerAllies',{attack:1},'allies'),
  '相手の場に敵が1体だけなら、このカードの攻撃力+2。':passive('oneEnemy',{attack:2}),
  '他の味方が2体以上いる間、このカードの攻撃力と防御力+1。':passive('twoOthers',{attack:1,defense:1}),
  'コスト3以下の味方がいる間、このカードの攻撃力+1。':passive('cheapAlly',{attack:1}),
  '自分の場に他の味方がいない間、このカードの攻撃力と防御力+1。':passive('alone',{attack:1,defense:1}),
  '相手のターン中、このカードの防御力+2。':passive('enemyTurn',{defense:2}),
  '登場時、味方1体の兵力を1回復する(上限まで)。':entry(heal(1)),
  '登場時、味方1体の兵力を2回復する(上限まで)。':entry(heal(2)),
  '他の味方が2体以上いる時に登場すると、山札からカードを1枚引く。':entry(iff('twoOthers',[draw(1)])),
  '登場時、手札が3枚以下なら、カードを1枚引き、その後1枚捨てる。':entry(iff('handLE3',[draw(1),discard()])),
  '登場時、他の味方が2体以上いるなら、さらに味方1体の兵力を1回復する。':entry(iff('twoOthers',[heal(1)]))
 };
 return exact[t]||manual('entry','原文に対応する確定済みの自動処理がありません。');
}
const selecting=e=>['ally','otherAlly','enemy','alliesSelect','hand','enemyHand'].includes(e.target)||['choice','reorder','discover','search','optionalBottom'].includes(e.op)||e.yes?.some(selecting)||e.no?.some(selecting);
const output={};
for(const c of CARD_DATA){
 const pair=plan[c.id];if(!pair?.skill)throw Error('未分類のスキル '+c.id);
 pair.trait ||= trait(c);
 for(const slot of ['skill','trait']){
  if(reviewed[c.id]?.[slot]!==c[slot+'Text'])pair[slot]=manual('entry','原文が更新されました。対応表の再レビューが必要です。');
  const p=pair[slot];p.sourceText=c[slot+'Text'];p.sourceName=c[slot+'Name'];
  p.automationType ||= p.effects?.some(selecting)?'SELECT':'AUTO';
 }
 output[c.id]={automationType:Object.values(pair).some(p=>p.automationType==='MANUAL')?'MANUAL':Object.values(pair).some(p=>p.automationType==='SELECT')?'SELECT':'AUTO',...pair};
}
fs.writeFileSync(path.resolve(__dirname,'../automation-data.js'),'// 原本照合用の原文付き。tools/build-automation.cjsから生成。\nglobalThis.CARD_AUTOMATION = '+JSON.stringify(output,null,2)+';\n');
const counts={};for(const c of Object.values(output))counts[c.automationType]=(counts[c.automationType]||0)+1;
console.log(counts);
console.log('MANUAL',Object.entries(output).filter(([id,c])=>c.automationType==='MANUAL').map(([id,c])=>id+':'+['skill','trait'].filter(s=>c[s].automationType==='MANUAL').join(',')).join(' '));
const rows=CARD_DATA.map(c=>{const a=output[c.id];return `| ${c.id} | ${c.name} | ${a.automationType} | ${a.skill.automationType} / ${a.skill.trigger} | ${a.trait.automationType} / ${a.trait.trigger} | ${[a.skill,a.trait].filter(a=>a.automationType==='MANUAL').map(a=>a.reason).join(' ')} |`;});
fs.writeFileSync(path.resolve(__dirname,'../AUTOMATION.md'),'# 108枚の能力分類\n\nExcelの原文と別の対応表です。スキル・特性それぞれの原文はautomation-data.jsに保存し、実行時も照合します。\n\nAUTO：完全自動、SELECT：対象選択、MANUAL：裁定が必要。カード分類はMANUAL、SELECT、AUTOの順に優先します。entry＝登場、turnStart＝自分ターン開始、passive＝継続、kill＝撃破、battleKill＝戦闘撃破、survived＝戦闘生存、beforeDeath＝兵力0になる時、afterAttack＝攻撃後、combat＝手動の戦闘裁定。\n\n| ID | 人物 | カード分類 | スキル分類 / 発動条件 | 特性分類 / 発動条件 | 手動の理由 |\n| --- | --- | --- | --- | --- | --- |\n'+rows.join('\n')+'\n');
