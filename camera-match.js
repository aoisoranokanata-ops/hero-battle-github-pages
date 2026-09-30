/* OCRの補助情報だけを扱い、正本データは変更しない。 */
(function(root){
 'use strict';
 const normalize=s=>String(s||'').normalize('NFKC').toUpperCase().replace(/[\s・･.。,:：/／\-―—_「」『』()（）]/g,'');
 function distance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(row[j]+1,next[j-1]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next;}return row[b.length];}
 function similarity(text,name){if(!text)return 0;if(text.includes(name))return 1;let best=0;for(let n=Math.max(1,name.length-1);n<=name.length+1;n++)for(let i=0;i+n<=text.length;i++){const s=text.slice(i,i+n);best=Math.max(best,1-distance(s,name)/Math.max(s.length,name.length));}return best;}
 function rank(input,cards=root.CARD_DATA){const texts=(input.names||[input.name||'']).map(normalize),rarity=(String(input.rarity||'').toUpperCase().match(/SSR|UR|SR|\bR\b/)||[])[0],id=(normalize(input.number).match(/(?:SSR|UR|SR|R)\d{2}/)||[])[0];return cards.map(c=>{const match=Math.max(0,...texts.map(t=>similarity(t,normalize(c.name)))),exact=match===1;let score=match*.83+(rarity===c.rarity?.10:rarity?-.10:0)+(id===c.id?.07:0);if(exact)score+=.05;return {cardId:c.id,name:c.name,rarity:c.rarity,confidence:Math.max(0,Math.min(.99,score)),nameScore:match,exact};}).filter(c=>c.nameScore>=.34||c.cardId===id).sort((a,b)=>b.confidence-a.confidence||a.cardId.localeCompare(b.cardId)).slice(0,5);}
 function high(candidates){return !!candidates[0]&&candidates[0].exact&&candidates[0].confidence>=.85&&(!candidates[1]||candidates[0].confidence-candidates[1].confidence>=.12);}
 root.CameraMatch={normalize,distance,similarity,rank,high};
})(globalThis);
