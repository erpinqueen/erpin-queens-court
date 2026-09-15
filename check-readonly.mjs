#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const root=process.argv[2]||".";
const files=[];
function walk(d){for(const n of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,n.name);if(n.isDirectory())walk(p);else if(/\.(html|js)$/.test(n.name))files.push(p)}}
walk(root);
let bad=[];
for(const f of files){
 const s=fs.readFileSync(f,"utf8");
 if(/fetch\s*\([^)]*method\s*:\s*["'](?!GET)["']/is.test(s)) bad.push(`${f}: non-GET fetch`);
 if(/\b(method|action)\s*[:=]\s*["'](?:POST|PUT|PATCH|DELETE)["']/i.test(s)) bad.push(`${f}: write method`);
}
if(bad.length){console.error("READ-ONLY CHECK FAILED"); console.error(bad.join("\n")); process.exit(1)}
console.log(`READ-ONLY CHECK PASSED — ${files.length} HTML/JS files scanned.`);
