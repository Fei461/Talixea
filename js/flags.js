// ── FLAGS ──────────────────────────────────────────────────────────────────────
const FLAGS={
  en:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'ce'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#ce)'},h('rect',{width:36,height:36,fill:'#012169'}),h('path',{d:'M0,0 L36,36 M36,0 L0,36',stroke:'#fff',strokeWidth:6}),h('path',{d:'M0,0 L36,36 M36,0 L0,36',stroke:'#C8102E',strokeWidth:3.6}),h('path',{d:'M18,0 V36 M0,18 H36',stroke:'#fff',strokeWidth:9}),h('path',{d:'M18,0 V36 M0,18 H36',stroke:'#C8102E',strokeWidth:5.4}))),
  fr:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'cf'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#cf)'},h('rect',{width:12,height:36,fill:'#002395'}),h('rect',{x:12,width:12,height:36,fill:'#fff'}),h('rect',{x:24,width:12,height:36,fill:'#ED2939'}))),
  de:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'cg'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#cg)'},h('rect',{width:36,height:12,fill:'#000'}),h('rect',{y:12,width:36,height:12,fill:'#DD0000'}),h('rect',{y:24,width:36,height:12,fill:'#FFCE00'}))),
  it:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'ci'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#ci)'},h('rect',{width:12,height:36,fill:'#009246'}),h('rect',{x:12,width:12,height:36,fill:'#fff'}),h('rect',{x:24,width:12,height:36,fill:'#CE2B37'}))),
  pt:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'cp'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#cp)'},h('rect',{width:15,height:36,fill:'#006600'}),h('rect',{x:15,width:21,height:36,fill:'#FF0000'}),h('circle',{cx:15,cy:18,r:7,fill:'#FFD700',stroke:'#006600',strokeWidth:1}),h('circle',{cx:15,cy:18,r:4.5,fill:'#fff',stroke:'#003399',strokeWidth:1.5}))),
  ca:()=>h('svg',{viewBox:'0 0 36 36'},h('defs',null,h('clipPath',{id:'cca'},h('circle',{cx:18,cy:18,r:18}))),h('g',{clipPath:'url(#cca)'},h('rect',{width:36,height:36,fill:'#FCDD09'}),...[0,1,2,3].map(i=>h('rect',{key:i,x:0,y:i*9,width:36,height:4.5,fill:'#DA121A'})))),
};
const Flag=({id,size=36})=>{const C=FLAGS[id];return C?h('div',{style:{width:size,height:size,borderRadius:'50%',overflow:'hidden',flexShrink:0}},h(C)):null;};

const IDIOMAS=[{id:'en',n:'Inglés'},{id:'fr',n:'Francés'},{id:'de',n:'Alemán'},{id:'it',n:'Italiano'},{id:'pt',n:'Portugués'},{id:'ca',n:'Catalán'}];
