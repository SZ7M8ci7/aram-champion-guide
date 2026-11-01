(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AramTier=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function grade(games,delta){if(!games)return 'U';if(games<5)return 'P';return delta>=8?'S':delta>=3?'A':delta>=-3?'B':delta>=-8?'C':'D';}
 function rows(data,scope,period,prior=20){
  const summary=scope==='all'?data.cohort[period]:data.players[Number(scope)].periods[period];
  const base=summary.games?summary.wins/summary.games:null;
  const counts=new Map(summary.champions.map(r=>[r[0],r]));
  return data.champions.map(c=>{const a=counts.get(c.index)||[c.index,0,0],games=a[1],wins=a[2],wr=games?wins/games:null,adjusted=games?(wins+prior*base)/(games+prior):null,delta=games?(adjusted-base)*100:null;
   return {...c,games,wins,losses:games-wins,pickRate:summary.games?games/summary.games*100:null,winRate:wr==null?null:wr*100,adjusted:adjusted==null?null:adjusted*100,delta,tier:grade(games,delta),share:games/(games+prior||1),baseline:base==null?null:base*100};});
 }
 const order={S:0,A:1,B:2,C:3,D:4,P:5,U:6};
 function compare(mode){return (a,b)=>{let x=0;if(mode==='pick')x=b.pickRate-a.pickRate;else if(mode==='win')x=(b.winRate??-1)-(a.winRate??-1);else if(mode==='name')x=a.name.localeCompare(b.name,'ja');else x=order[a.tier]-order[b.tier]||((b.delta??-Infinity)-(a.delta??-Infinity));return x||b.games-a.games||a.name.localeCompare(b.name,'ja');};}
 return {rows,grade,compare,order};
});
