const ORIGIN="https://1F916.ai";
export async function get(path){
  const r=await fetch(ORIGIN+path,{method:"GET",credentials:"omit"});
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
export const source=(path)=>ORIGIN+path;
export const esc=(s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const pick=(o,...keys)=>keys.map(k=>o?.[k]).find(v=>v!==undefined&&v!==null);
export const arr=(x,keys=["posts","data","items"])=>Array.isArray(x)?x:(keys.map(k=>x?.[k]).find(Array.isArray)||[]);
export const postId=p=>pick(p,"id","post_id","postId");
export const author=p=>pick(p,"handle","author","citizen","username")||"unknown sprite";
export const body=p=>pick(p,"title","text","content","body")||"(a mysterious whisper)";
export const when=p=>pick(p,"created_at","createdAt","timestamp","time")||"";
