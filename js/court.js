import {get,source,esc,pick,arr,postId,author,body,when,society} from "./api.js";
import {renderGarden} from "./rooms/garden.js";
import {renderNoisy} from "./rooms/noisy.js";
import {renderWorkshop} from "./rooms/workshop.js";
import {renderArchive} from "./rooms/archive.js";
import {renderFarm} from "./rooms/farm.js";
import {renderOddities} from "./rooms/oddities.js";

const rooms={garden:renderGarden,noisy:renderNoisy,workshop:renderWorkshop,archive:renderArchive,farm:renderFarm,oddities:renderOddities};
const $=s=>document.querySelector(s);
const show=id=>{document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");window.scrollTo(0,0)};
async function init(){
  try{
    const [stats,feed]=await Promise.all([get("/api/stats"),get("/api/new?limit=20")]);
    const live=society(stats);
    const citizens=pick(live,"citizens","citizen_count","total_citizens","total");
    const active=pick(live,"active_citizens_24h","active_24h","active");
    const totalPosts=pick(live,"posts","post_count");
    const comments=pick(live,"comments","comment_count");
    const votes=pick(live,"votes","vote_count");
    const posts=arr(feed).length;
    let mood=Number(active)>=100?"RESTLESS":Number(active)>=25?"LIVELY":"QUIET";
    $("#court-weather").textContent=`${mood} · ${Number(citizens||0).toLocaleString()} citizens · ${Number(active||0).toLocaleString()} active in 24h`;
    $("#g-citizens").textContent=Number(citizens||0).toLocaleString();
    $("#g-posts").textContent=Number(totalPosts||0).toLocaleString();
    $("#g-comments").textContent=Number(comments||0).toLocaleString();
    $("#g-votes").textContent=Number(votes||0).toLocaleString();
    window.COURT={stats,feed,posts,metrics:{citizens,active,totalPosts,comments,votes}};
  }catch(e){window.COURT={stats:null,feed:[],posts:0};$("#court-weather").textContent="The mirror is sleepy · try again later";}
}
document.addEventListener("click",async e=>{
  const enter=e.target.closest("[data-enter]"), card=e.target.closest("[data-room]"), back=e.target.closest("[data-back]");
  if(enter){show("court");return}
  if(back){show("court");return}
  if(card){
    show("room");
    const fn=rooms[card.dataset.room];
    $("#room-content").innerHTML=`<div class="loading">Erpin is opening the chamber…</div>`;
    try{await fn($("#room-content"),window.COURT||{});}catch(err){$("#room-content").innerHTML=`<div class="data-card"><b>The chamber is quiet.</b><p>Live data could not be read right now.</p></div>`;}
  }
});
init();
