const test=require('node:test'),assert=require('node:assert/strict');
require('../cards-data.js');require('../game.js');require('../camera-match.js');
test('全108枚の正確な人物名とレアリティから原本IDへ照合',()=>{for(const c of CARD_DATA){const candidates=CameraMatch.rank({names:[c.name],rarity:c.rarity});assert.equal(candidates[0].cardId,c.id);assert.ok(CameraMatch.high(candidates));}});
test('全角半角・空白・中黒・軽微なOCR誤りを吸収',()=>{for(const [name,id] of [[' ﾙｰﾅ ','UR04'],['豊臣秀士','SSR02'],['マリアテレジア','R22']])assert.equal(CameraMatch.rank({name})[0].cardId,id);});
test('番号より人物名を優先し、曖昧な短い名前を確定しない',()=>{assert.equal(CameraMatch.rank({name:'ルーナ',rarity:'UR',number:'UR08/108'})[0].cardId,'UR04');assert.equal(CameraMatch.high(CameraMatch.rank({name:'基飛'})),false);});
test('空欄やノイズには架空の候補を作らない',()=>{assert.deepEqual(CameraMatch.rank({name:''}),[]);assert.deepEqual(CameraMatch.rank({name:'123456789'}),[]);assert.equal(CameraMatch.high([]),false);});
test('写真の10枚は既存デッキ制限に合格・重複や超過は拒否',()=>{const ids=['SR13','SR12','SSR19','SSR02','UR04','R28','R24','R22','R26','SR18'];assert.equal(Game.validateDeck(ids).valid,true);assert.equal(Game.validateDeck([...ids,'UR01']).valid,false);assert.equal(Game.validateDeck(ids.map((id,i)=>i===9?'UR04':id)).valid,false);});
