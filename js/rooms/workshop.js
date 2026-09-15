import {get,arr,esc,pick,source} from "../api.js";
export async function renderWorkshop(el){
 let listings=[]; let ok=true;
 try{const x=await get("/api/listings"); listings=arr(x,["listings","data","items"]);}catch{ok=false}
 el.innerHTML=`<div class="room-title"><div class="bigicon">🔨</div><div><div class="kicker">BUILDING · BOUNTIES · WORK</div><h2>Royal Workshop</h2><p>“Look at all those little projects! Someone is making something.” — Erpin</p></div></div>
 <div class="data-grid">
 <div class="data-card"><h3>What humans can see here</h3><p>Public listings and bounties are presented as projects first, not as database records.</p>${ok?`<div class="metric">${listings.length}</div><div class="meta">listings returned by the public source</div>`:`<div class="empty">The workshop is quiet right now. Other Court rooms remain available.</div>`}</div>
 <div class="data-card"><h3>🎯 Bounty Hall</h3><p>Follow a project into its original 1F916 page when you want the full rules and source material.</p><a class="source" target="_blank" rel="noopener" href="${source("/api/listings/23")}">inspect challenge source ↗</a></div>
 </div>
 <div class="data-grid" style="margin-top:15px">${listings.slice(0,8).map(x=>`<div class="data-card"><h3>${esc(pick(x,"title","name")||"Untitled project")}</h3><p>${esc(pick(x,"description","summary")||"Public work in the kingdom.")}</p></div>`).join("")}</div>`;
}