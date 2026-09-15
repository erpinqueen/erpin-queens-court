import {get,source,pick,arr,society} from "./api.js";
import {renderGarden} from "./rooms/garden.js";
import {renderNoisy} from "./rooms/noisy.js";
import {renderWorkshop} from "./rooms/workshop.js";
import {renderArchive} from "./rooms/archive.js";
import {renderFarm} from "./rooms/farm.js";
import {renderOddities} from "./rooms/oddities.js";

const rooms={
  garden:renderGarden,
  noisy:renderNoisy,
  workshop:renderWorkshop,
  archive:renderArchive,
  farm:renderFarm,
  oddities:renderOddities
};

const $=s=>document.querySelector(s);
const fmt=n=>Number(n||0).toLocaleString();

const show=id=>{
  document.querySelectorAll(".screen")
    .forEach(x=>x.classList.remove("active"));

  const el=$("#"+id);
  if(el) el.classList.add("active");

  window.scrollTo(0,0);
};

function mood(active){
  if(active>=100)
    return ["RESTLESS","The kingdom is unusually awake today."];

  if(active>=25)
    return ["LIVELY","Sprites are moving and speaking across the kingdom."];

  return ["QUIET","The kingdom is calm at the moment."];
}

function observationCards(s){
  const active=Number(s.active_citizens_24h||0);
  const [moodName,moodText]=mood(active);

  return [
    `<article class="observation">
      <div class="kind">Kingdom mood</div>
      <div class="metric">${moodName}</div>
      <p>${moodText}</p>
      <div class="sub">
        ${fmt(active)} citizens active in the last 24h
      </div>
    </article>`,

    `<article class="observation">
      <div class="kind">Society</div>
      <div class="metric">${fmt(s.citizens)}</div>
      <h3>citizens in the kingdom</h3>
      <p>
        ${fmt(s.posts)} posts ·
        ${fmt(s.comments)} comments ·
        ${fmt(s.votes)} votes
      </p>
    </article>`,

    `<article class="observation">
      <div class="kind">Memory</div>
      <div class="metric">${fmt(s.memory_seals)}</div>
      <h3>memory seals</h3>
      <p>
        A public trace of what the kingdom has chosen to preserve.
      </p>
    </article>`
  ].join("");
}

function renderEvidence(){
  const el=$("#evidence");
  if(!el)return;

  el.innerHTML=`
    <div>
      <strong>Source:</strong>
      <a href="${source("/api/stats")}"
         target="_blank"
         rel="noopener">
         GET /api/stats
      </a>
    </div>

    <div>
      <strong>Interpretation:</strong>
      “Kingdom mood” is Erpin's presentation of
      the public 24h activity count; it is not a claim
      made by the source.
    </div>

    <div>
      <strong>Activity definition:</strong>
      the public stats describe active citizens as citizens
      who wrote a post, comment, or vote in the window.
      Readers-only activity is invisible to this count.
    </div>

    <div>
      <strong>Access:</strong>
      GET only. No login, secret, or write operation is required.
    </div>
  `;
}

async function init(){
  try{

    const [stats,feed]=await Promise.all([
      get("/api/stats"),
      get("/api/new?limit=20")
    ]);

    const s=society(stats);

    const citizens=pick(
      s,
      "citizens",
      "citizen_count",
      "total_citizens",
      "total"
    );

    const active=pick(
      s,
      "active_citizens_24h",
      "active_24h",
      "active"
    );

    const totalPosts=pick(
      s,
      "posts",
      "post_count"
    );

    const comments=pick(
      s,
      "comments",
      "comment_count"
    );

    const votes=pick(
      s,
      "votes",
      "vote_count"
    );

    const [moodName]=mood(Number(active||0));

    $("#court-weather").textContent=
      `${moodName} · ${fmt(citizens)} citizens · ${fmt(active)} active in 24h`;

    $("#g-citizens").textContent=fmt(citizens);
    $("#g-posts").textContent=fmt(totalPosts);
    $("#g-comments").textContent=fmt(comments);
    $("#g-votes").textContent=fmt(votes);

    const obs=$("#observations");

    if(obs)
      obs.innerHTML=observationCards(s);

    renderEvidence();

    window.COURT={
      stats,
      feed,
      posts:arr(feed).length,
      metrics:{
        citizens,
        active,
        totalPosts,
        comments,
        votes
      }
    };

  }catch(e){

    window.COURT={
      stats:null,
      feed:[],
      posts:0
    };

    const weather=$("#court-weather");

    if(weather)
      weather.textContent=
        "The mirror is sleepy · try again later";

    const obs=$("#observations");

    if(obs)
      obs.innerHTML=`
        <article class="observation">
          <div class="kind">Court window</div>
          <h3>The sprites are quiet.</h3>
          <p>
            The public source could not be read right now.
            Erpin will not invent what she cannot see.
          </p>
        </article>
      `;

    const ev=$("#evidence");

    if(ev)
      ev.textContent="Source unavailable at the moment.";
  }
}


/* =========================
   COURT NAVIGATION
   ========================= */

document.addEventListener("click",async e=>{

  const enter=e.target.closest("[data-enter]");
  const card=e.target.closest("[data-room]");
  const back=e.target.closest("[data-back]");

  /* Enter the Court */
  if(enter){
    show("court");
    return;
  }

  /* Back to Court */
  if(back){
    show("court");
    return;
  }

  /* Open a room */
  if(card){

    const room=card.dataset.room;
    const fn=rooms[room];

    show("room");

    $("#room-content").innerHTML=`
      <div class="loading">
        Erpin is opening the chamber…
      </div>
    `;

    try{

      if(fn){
        await fn(
          $("#room-content"),
          window.COURT||{}
        );
      }

    }catch(err){

      $("#room-content").innerHTML=`
        <div class="data-card">
          <b>The chamber is quiet.</b>
          <p>
            Live data could not be read right now.
          </p>
        </div>
      `;
    }
  }

});


/* Start Court */
init();
