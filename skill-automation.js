/* 原文とは別の完全自動処理方針。 */
(function(root){
 const defaults={skillMode:'full',autoSkills:true,autoTraits:true,difficultFallback:'buff',abilityConfirmations:false,abilityNotifications:true,notificationSeconds:1.5,fiveMinuteNotice:true,oneMinuteNotice:true};
 const mode=g=>g.rules.skillMode||'semi';
 const enabled=(g,slot)=>mode(g)!=='manual'&&(slot==='skill'?g.rules.autoSkills:g.rules.autoTraits)!==false;
 function decorate(g,id,slot,a){if(!g)return a;const raw=root.CARD_AUTOMATION[id]?.[slot];if(mode(g)==='manual')return {...a,automationType:'MANUAL',reason:'手動モード：本文に従って調整してください。'};if(mode(g)==='full'&&a.automationType==='MANUAL'&&enabled(g,slot)&&g.rules.difficultFallback!=='manual')return {...a,trigger:a.trigger==='configuredManual'?(['entry','turnStart','turnEnd','kill','afterAttack'].includes(raw?.trigger)?raw.trigger:'combat'):a.trigger,limit:a.limit||'turn',automationType:'AUTO',fallback:true,effects:[{op:'buff',target:'self',stats:{attack:2},duration:'turnEnd'}]};if(a.automationType==='PRESET')return {...a,autoTrigger:raw?.trigger||'entry',autoCondition:raw?.condition||'always'};return a;}
 function choose(g,e,options){const ids=options.map(o=>o.id);if(['reorder','reorderBottom'].includes(e.op))return ids;if(e.op==='optionalBottom')return ['keep'];if(e.op==='choice')return [ids[0]];const effect=e.op==='presetChoice'?g.presetBatch.effects[e.index]:e,p=e.owner,target=effect.target,enemy=target==='enemy'||target==='enemies';const units=g.players[enemy?1-p:p].field;const stat=effect.stat,delta=effect.delta;
 const score=c=>{if(enemy){if(effect.op==='damage'||stat==='troop'&&delta<0)return c.troop;if((effect.stats?.attack||0)<0||stat==='attack'&&delta<0)return -c.attack;if((effect.stats?.defense||0)<0||stat==='defense'&&delta<0)return -c.defense;return c.troop;}if(['heal','healCleanse'].includes(effect.op)||stat==='troop'&&delta>0||(effect.stats?.defense||0)>0||stat==='defense'&&delta>0)return c.troop/c.maxTroop;if((effect.stats?.attack||0)>0||stat==='attack'&&delta>0)return -c.attack;return 0;};
 if(['ally','otherAlly','enemy','alliesSelect'].includes(target)){const ranked=units.filter(c=>ids.includes(c.id)).map((c,index)=>({c,index})).sort((a,b)=>score(a.c)-score(b.c)||Game.card(b.c.id).cost-Game.card(a.c.id).cost||a.index-b.index);return ranked.slice(0,target==='alliesSelect'?(e.maxSelect||3):1).map(x=>x.c.id);}
 // 山札検索・選択は高コスト優先、同値は現在の順序。破棄は低コスト優先。
 return [[...ids].sort((a,b)=>(e.op==='discard'?1:-1)*(Game.card(a).cost-Game.card(b).cost))[0]];
 }
 root.SkillAutomation={defaults,mode,enabled,decorate,choose};
})(globalThis);
