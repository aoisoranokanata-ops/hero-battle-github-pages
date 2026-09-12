/* 対象選択・手動裁定まで、発端の1操作にまとめてUndoする。 */
(function(root){root.Session={
 perform(s,action){const game=Game.dispatch(s.game,action),history=[...s.history];if(!s.transactionOpen&&!['ready','hide'].includes(action.type)||action.type==='ready'&&s.game.turn===0&&!s.transactionOpen){const before=Game.clone(s.game);Game.settle(before);history.push(before);}return {game,history:history.slice(-50),transactionOpen:!!(game.pending.length||game.handoff)};},
 undo(s){if(!s.history.length)return s;const history=[...s.history],game=Game.lock(history.pop());if(game.timer.running)game.timer.at=Date.now();return {game,history,transactionOpen:false};}
};})(globalThis);
