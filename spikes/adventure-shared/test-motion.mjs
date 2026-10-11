import assert from 'node:assert/strict';
import {crossingPose,ease,SCENE_SECONDS} from './motion.mjs';
import {homePose,homeDoor,HOME_SECONDS,HOME} from '../woodland-adventure/homecoming.mjs';
let checks=0;
for(const span of[180,500,850])for(const height of[48,80,120]){let previous=-1;for(let i=0;i<=250;i++){const p=crossingPose(i/100,span,height);assert(p.progress>=previous&&p.progress<=1);assert(p.distance>=0&&p.distance<=span);assert(p.frame>=0&&p.frame<4);previous=p.progress;checks+=3;}assert.equal(crossingPose(SCENE_SECONDS,span,height).progress,1);checks++;}
for(let i=0;i<=650;i++){const t=i/100,p=homePose(t);assert([p.footX,p.footY,p.height,p.opacity].every(Number.isFinite));assert(p.opacity>=0&&p.opacity<=1);assert(homeDoor(t)>=0&&homeDoor(t)<=1);checks+=3;}
assert(homePose(HOME_SECONDS).inside);assert(homePose(HOME_SECONDS,5400,430,.85,true).inside);assert.equal(homeDoor(HOME_SECONDS),0);assert.equal(homePose(0,5488,430).footY,430);assert.equal(HOME.sillY,322);assert.equal(ease(0),0);assert.equal(ease(1),1);checks+=7;
console.log({checks,groundedPivots:true,easedCrossings:true,completeHomeEntry:true,doorClosedAtFinish:true});
