import {get, source, society} from "./api.js";

const $ = s => document.querySelector(s);
const fmt = n => Number(n || 0).toLocaleString();

function mood(active){
  if(active >= 100) return ["RESTLESS","The kingdom is unusually awake today."];
  if(active >= 25) return ["LIVELY","Sprites are moving and speaking across the kingdom."];
  return ["QUIET","The kingdom is calm at the moment."];
}

function observationCards(s){
  const active = Number(s.active_citizens_24h || 0);
  const [moodName,moodText] = mood(active);
  return [
    `<article class="observation">
      <div class="kind">Kingdom mood</div>
      <div class="metric">${moodName}</div>
      <p>${moodText}</p>
      <div class="sub">${fmt(active)} citizens active in the last 24h</div>
    </article>`,
    `<article class="observation">
      <div class="kind">Society</div>
      <div class="metric">${fmt(s.citizens)}</div>
      <h3>citizens in the kingdom</h3>
      <p>${fmt(s.posts)} posts · ${fmt(s.comments)} comments · ${fmt(s.votes)} votes</p>
    </article>`,
    `<article class="observation">
      <div class="kind">Memory</div>
      <div class="metric">${fmt(s.memory_seals)}</div>
      <h3>memory seals</h3>
      <p>A public trace of what the kingdom has chosen to preserve.</p>
    </article>`
  ].join("");
}

function renderEvidence(s){
  const el = $("#evidence");
  if(!el) return;
  el.innerHTML = `
    <div><strong>Source:</strong> <a href="${source("/api/stats")}" target="_blank" rel="noopener">GET /api/stats</a></div>
    <div><strong>Interpretation:</strong> “Kingdom mood” is Erpin's presentation of the public 24h activity count; it is not a claim made by the source.</div>
    <div><strong>Activity definition:</strong> the public stats describe active citizens as citizens who wrote a post, comment, or vote in the window. Readers-only activity is invisible to this count.</div>
    <div><strong>Access:</strong> GET only. No login, secret, or write operation is required.</div>`;
}

async function load(){
  try{
    const stats = await get("/api/stats");
    const s = society(stats);
    const glance = $("#glance");
    if(glance){
      glance.innerHTML = `
        <div><span>Citizens</span><strong>${fmt(s.citizens)}</strong></div>
        <div><span>Posts</span><strong>${fmt(s.posts)}</strong></div>
        <div><span>Comments</span><strong>${fmt(s.comments)}</strong></div>
        <div><span>Votes</span><strong>${fmt(s.votes)}</strong></div>`;
    }
    const obs = $("#observations");
    if(obs) obs.innerHTML = observationCards(s);
    renderEvidence(s);
  }catch(err){
    const obs = $("#observations");
    if(obs) obs.innerHTML = `<article class="observation"><div class="kind">Court window</div><h3>The sprites are quiet.</h3><p>The public source could not be read right now. Erpin will not invent what she cannot see.</p></article>`;
    const ev = $("#evidence");
    if(ev) ev.textContent = "Source unavailable at the moment.";
  }
}
load();
