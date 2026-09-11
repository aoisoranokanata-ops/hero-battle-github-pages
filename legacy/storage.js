(function(root){
  'use strict';
  const prefix='hero-battle-v1:';
  let error='';
  root.Store={
    get error(){return error;},
    read(key,fallback){try{const value=localStorage.getItem(prefix+key);return value===null?fallback:JSON.parse(value);}catch(e){error='保存データを読み込めません。ブラウザの保存設定を確認してください。';return fallback;}},
    write(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch(e){error='端末に保存できませんでした。ブラウザの保存容量・プライベートモードを確認してください。';return false;}}
  };
})(globalThis);
