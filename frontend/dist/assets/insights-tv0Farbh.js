import{H as r,$ as c,k as n,D as i,a8 as h}from"./index-B1obUnJK.js";/**
 * @license lucide-vue-next v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=r("SparklesIcon",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]),v=c("insights",()=>{const e=n(0),t=n(null);async function s(a=!1){if(!i().isPro){e.value=0;return}if(!(!a&&t.value&&Date.now()-t.value<6e4))try{const{data:l}=await h.list("new");e.value=l.counts.new,t.value=Date.now()}catch{}}function u(a){e.value=Math.max(0,a)}function o(){e.value=Math.max(0,e.value-1)}return{newCount:e,refreshCount:s,setCount:u,decrement:o}});export{f as S,v as u};
