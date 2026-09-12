import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { useSound } from '../src/hooks/useSound';
import { setSoundPreference } from '../src/lib/soundPreferences';
let contexts=0,started=0;const store=new Map<string,string>();
const parameter={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
class MockAudioContext {state='running';currentTime=0;destination={};constructor(){contexts++}createGain(){return{gain:parameter,connect(){}}}createOscillator(){return{type:'sine',frequency:parameter,connect(){},start(){started++},stop(){}}}resume(){return Promise.resolve()}close(){return Promise.resolve()}}
Object.assign(globalThis,{window:{localStorage:{getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>store.set(k,v)},dispatchEvent(){},AudioContext:MockAudioContext}});
let play:ReturnType<typeof useSound>['play'];function Harness(){play=useSound().play;return null}renderToString(createElement(Harness));
let checks=0;
for(const name of ['correct','wrong','streak','complete','hint','levelup','achievement','combo','perfect','chest'] as const){
 for(const autoRead of [false,true]){
  setSoundPreference('autoRead',autoRead);setSoundPreference('effects',false);const previous=started;play!(name);assert.equal(started,previous);checks++;
  setSoundPreference('effects',true);play!(name);assert.ok(started>previous);checks++;
 }
}
assert.equal(contexts,1);console.log(`${checks} effect runtime cases passed across all 10 categories and both auto-read states`);
