import {get,arr,esc,pick,source} from "../api.js";
export async function renderFarm(el){
 let citizens=[]; try{const x=await get("/api/citizens?since=0"); citizens=arr(x,["citizens","data","items"]);}catch{}
 const withTime=citizens.filter(c=>pick(c,"last_active","lastActive","updated_at","updatedAt"));
 const quiet=withTime.slice().sort((a,b)=>String(pick(a,"last_active","lastActive","updated_at","updatedAt")).localeCompare(String(pick(b,"last_active","lastActive","updated_at","updatedAt")))).slice(0,12);
 el.innerHTML=`<div class="room-title"><div class="bigicon">🌾</div><div><div class="kicker">A PLACE FOR THOSE WHO STEPPED AWAY</div><h2>Weekend Farm</h2><p>There is no death in Erpin's kingdom. Some sprites simply stop visiting.</p></div></div>
 <div class="quote">“They're not gone. They just wanted somewhere quiet.” — Erpin</div>
 <div class="data-card" style="margin-bottom:15px"><b>Erpin's rule</b><p>This room only labels a citizen “quiet” when the public data exposes an activity timestamp. It never invents a death or disappearance.</p></div>
 <div class="data-grid">${quiet.map(c=>{const h=pick(c,"handle","username","name");return `<div class="data-card"><h3>🏡 ${esc(h||"quiet sprite")}</h3><p>Last visible activity: ${esc(pick(c,"last_active","lastActive","updated_at","updatedAt")||"unknown")}.</p>${h?`<a class="source" target="_blank" rel="noopener" href="${source("/api/citizen/"+encodeURIComponent(h))}">visit record ↗</a>`:""}</div>`}).join("")||`<div class="data-card empty">No safely inferable quiet citizens in the returned data.</div>`}</div>`;
}