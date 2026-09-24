/* 非停止通知。ゲーム状態・タイマーには触れない。 */
(function(root){let queue=[],active=false,timer=null,prefs=()=>({});const node=document.createElement('div');node.id='ability-toast';node.setAttribute('role','status');node.setAttribute('aria-live','polite');document.body.append(node);
 function clear(){queue=[];active=false;clearTimeout(timer);node.className='';node.textContent='';}
 function next(){if(active||!queue.length)return;const e=queue.shift(),p=prefs();const show=e.type==='timer'?(e.warning==='five'?p.fiveMinuteNotice:p.oneMinuteNotice)!==false:p.abilityNotifications!==false&&Number(p.notificationSeconds??1.5)>0;if(!show){next();return;}active=true;node.textContent=e.text;node.className='visible';if(e.type==='timer')Presentation.warning(e.warning==='five'?1:2);timer=setTimeout(()=>{node.className='';timer=setTimeout(()=>{active=false;next();},180);},e.type==='timer'?2000:1000*(p.notificationSeconds??1.5));}
 root.Notifications={configure:fn=>prefs=fn,clear,push:events=>{queue.push(...events);next();}};
})(globalThis);
