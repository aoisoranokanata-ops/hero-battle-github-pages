/* Playwrightが必要。テスト専用ブラウザを開き、実際のUIと保存・復元を検証する。 */
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const base='/hero-battle/';
 const files={'index.html':'text/html','styles.css':'text/css','cards-data.js':'text/javascript','game.js':'text/javascript','storage.js':'text/javascript','app.js':'text/javascript'};
 const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=pathname===base?'index.html':pathname.startsWith(base)?pathname.slice(base.length):'';
  if(!files[file]){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':files[file]+'; charset=utf-8'});
  res.end(fs.readFileSync(path.resolve(__dirname,'..',file)));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(),errors=[],requests=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==origin)requests.push(r.url());});
 page.on('dialog',d=>d.accept());
 const screenshotDir=process.env.SCREENSHOT_DIR;
 if(screenshotDir)fs.mkdirSync(screenshotDir,{recursive:true});
 const shot=async(name)=>{if(screenshotDir)await page.screenshot({path:path.join(screenshotDir,name+'.png'),fullPage:true});};
 const action=(a)=>page.locator(`[data-action="${a}"]`);
 try{
  await page.goto(origin+base);
  await page.locator('h1').waitFor();
  await shot('home-desktop');checks.push('GitHub Pages相当のHTTPサブパスで起動・静的ファイル読込');
  await action('newDeck').click();
  assert.equal(await page.locator('#catalog .card').count(),108);checks.push('カード108枚の表示');
  await page.locator('#search').fill('ゼウス');assert.equal(await page.locator('#catalog .card').count(),1);
  await page.locator('[data-action="detail"][data-id="UR01"]').click();
  const text=await page.locator('#modal-body').textContent();
  const source=await page.evaluate(()=>CARD_DATA[0]);assert.ok(text.includes(source.skillText));assert.ok(text.includes(source.traitText));
  await page.locator('#close-modal').click();await page.locator('#search').fill('');checks.push('検索とスキル・特性原文');
  for(const id of ['UR01','SSR01','SSR02','SR01','SR02','SR03','R01','R02','R03','R04'])await page.locator(`#catalog [data-action="toggleCard"][data-id="${id}"]`).click();
  await page.locator('#deck-name').fill('検証用デッキ');await page.locator('#deck-player').fill('5年2組');await page.locator('#deck-team').fill('チーム雷神');
  assert.equal(await page.locator('#save-deck').isEnabled(),true);await action('saveDeck').click();checks.push('10枚構築・保存');
  await action('copyDeck').click();assert.equal(await action('editDeck').count(),2);await action('editDeck').last().click();await page.locator('#deck-player').fill('5年1組');await action('saveDeck').click();checks.push('複製・編集');
  await page.locator('[data-nav="settings"]').click();await page.locator('[name="startEnergy"]').fill('10');await page.getByRole('button',{name:'設定を保存',exact:true}).click();
  await page.locator('[data-nav="home"]').click();await action('setup').click();await page.locator('#match-deck-1').selectOption({index:1});await action('createMatch').click();
  for(const p of [0,1])for(const id of ['R01','R02','R03'])await page.locator(`[data-action="initial"][data-player="${p}"][data-id="${id}"]`).click();
  await action('start').click();checks.push('2人のデッキ選択と初期手札登録');
  await action('drawPanel').last().click();await page.locator('[data-action="draw"][data-id="R04"]').click();
  await page.locator('[data-action="handCard"][data-player="0"][data-id="R01"]').click();await action('summon').click();
  assert.ok((await page.locator('.player').first().textContent()).includes('今ターン攻撃不可'));checks.push('紙ドロー・召喚とコスト消費');
  await page.locator('[data-action="effects"][data-player="0"]').click();await page.locator('[data-action="adjust"][data-key="attack"][data-delta="2"]').click();
  await page.locator('[data-flag="skillDisabled"]').check();await page.locator('#effect-note').fill('次の自分ターンまで攻撃力＋2');await action('saveNote').click();await page.locator('#close-modal').click();checks.push('効果補正・状態・メモ');
  await page.locator('[data-action="hide"][data-player="0"]').click();assert.equal(await page.locator('.player').first().locator('[data-action="handCard"]').count(),0);
  await page.locator('[data-action="hide"][data-player="0"]').click();checks.push('手札を隠す・表示');
  await action('endTurn').click();await action('drawPanel').last().click();await page.locator('[data-action="draw"][data-id="R04"]').click();
  await page.locator('[data-action="handCard"][data-player="1"][data-id="R01"]').click();await action('summon').click();
  await action('endTurn').click();await action('drawPanel').last().click();await page.locator('[data-action="draw"]').first().click();
  await page.locator('[data-action="effects"][data-player="1"]').click();
  const troop=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-battle-v1:match')).game.players[1].field[0].troop);
  for(let i=1;i<troop;i++)await page.locator('[data-action="adjust"][data-key="troop"][data-delta="-1"]').click();
  await page.locator('#close-modal').click();
  await action('attackPhase').click();await page.locator('[data-action="attackSelect"][data-player="0"]').click();await action('attackConfirm').click();
  await action('trash').click();assert.ok((await page.locator('.notice').first().textContent()).includes('敵陣を突破しました'));
  assert.equal(await action('attackPhase').isDisabled(),true);checks.push('戦闘・兵力0・トラッシュ・敵陣突破の自動終了');
  await action('undo').click();
  let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-battle-v1:match')));assert.equal(saved.game.players[1].field.length,1);assert.equal(saved.game.players[1].field[0].troop,0);checks.push('Undoで撃破後のカードを復元');
  await page.locator('[data-action="trashConfirm"][data-player="1"]').click();
  await action('timer').click();
  saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-battle-v1:match')));
  await page.reload();await action('resume').click();
  const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-battle-v1:match')));assert.deepEqual(restored.game,saved.game);assert.equal(restored.history.length,saved.history.length);checks.push('再読み込み後の全状態・履歴復元');
  await shot('battle-desktop');
  for(const [width,height] of [[1024,768],[768,1024],[390,844]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);const boxes=await page.locator('.player').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y};}));if(height>width){assert.equal(boxes[0].x,boxes[1].x);assert.ok(boxes[1].y>boxes[0].y);}else{assert.equal(boxes[0].y,boxes[1].y);assert.ok(boxes[1].x>boxes[0].x);}await shot('battle-'+width);}
  checks.push('1440/1024/768/390pxで横はみ出しなし');
  for(const [name,viewport] of [['iPad相当',{width:820,height:1180}],['Android相当',{width:412,height:915}]]){
   const mobile=await browser.newContext({viewport,hasTouch:true,isMobile:true});
   const tab=await mobile.newPage();tab.on('pageerror',e=>errors.push(e.message));
   await tab.goto(origin+base);await tab.locator('[data-action="newDeck"]').tap();
   assert.equal(await tab.locator('#catalog .card').count(),108);
   await tab.locator('#search').fill('ゼウス');await tab.locator('[data-action="detail"][data-id="UR01"]').tap();
   assert.ok((await tab.locator('#modal-body').textContent()).includes(source.skillText));
   assert.equal(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await mobile.close();checks.push(name+'のタッチ・検索・カード詳細（Edgeエミュレーション）');
  }
  assert.equal(requests.length,0);assert.deepEqual(errors,[]);checks.push('コンソールエラー0・配信元以外へのHTTP通信0');
  console.log(JSON.stringify({passed:checks.length,checks,errors,externalRequests:requests},null,2));
 } catch(e){console.error({errors,body:await page.locator('body').innerText()});throw e;} finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
