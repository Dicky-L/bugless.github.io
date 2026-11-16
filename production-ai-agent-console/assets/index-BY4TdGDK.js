import{r as m,j as e,M as ve,a as be,R as Ee}from"./vendor-markdown-BGg4tmk-.js";import{r as Se}from"./vendor-react-Dg7BVd9x.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))d(c);new MutationObserver(c=>{for(const i of c)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&d(p)}).observe(document,{childList:!0,subtree:!0});function r(c){const i={};return c.integrity&&(i.integrity=c.integrity),c.referrerPolicy&&(i.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?i.credentials="include":c.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function d(c){if(c.ep)return;c.ep=!0;const i=r(c);fetch(c.href,i)}})();var re,Q=Se;re=Q.createRoot,Q.hydrateRoot;/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),le=(...t)=>t.filter((a,r,d)=>!!a&&a.trim()!==""&&d.indexOf(a)===r).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var we={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=m.forwardRef(({color:t="currentColor",size:a=24,strokeWidth:r=2,absoluteStrokeWidth:d,className:c="",children:i,iconNode:p,...f},o)=>m.createElement("svg",{ref:o,...we,width:a,height:a,stroke:t,strokeWidth:d?Number(r)*24/Number(a):r,className:le("lucide",c),...f},[...p.map(([h,C])=>m.createElement(h,C)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=(t,a)=>{const r=m.forwardRef(({className:d,...c},i)=>m.createElement(Ae,{ref:i,iconNode:a,className:le(`lucide-${Ce(t)}`,d),...c}));return r.displayName=`${t}`,r};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=l("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=l("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=l("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=l("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=l("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=l("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=l("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=l("ChevronsUpDown",[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=l("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=l("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=l("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=l("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=l("Command",[["path",{d:"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",key:"11bfej"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=l("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=l("Ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=l("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=l("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=l("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=l("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=l("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=l("PanelRightClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m8 9 3 3-3 3",key:"12hl5m"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=l("PanelRightOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=l("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=l("Radio",[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=l("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=l("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=l("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=l("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=l("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=l("Timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=l("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=l("Workflow",[["rect",{width:"8",height:"8",x:"3",y:"3",rx:"2",key:"by2w9f"}],["path",{d:"M7 11v4a2 2 0 0 0 2 2h4",key:"xkn7yn"}],["rect",{width:"8",height:"8",x:"13",y:"13",rx:"2",key:"1cgmvn"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=l("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=l("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),he="/api";async function q(t,a){const r=await fetch(he+t,{...a,headers:{"Content-Type":"application/json",...a?.headers}});if(!r.ok)throw new Error("HTTP "+r.status);if(!(r.headers.get("content-type")||"").includes("application/json"))throw new Error("Not a JSON API");return r.json()}async function Je(){try{const t=new AbortController,a=setTimeout(()=>t.abort(),1800);try{const r=await q("/health",{signal:t.signal});return r.status==="ok"&&r.provider?r:null}finally{clearTimeout(a)}}catch{return null}}const Ze=()=>q("/sessions"),ae=(t="新建对话")=>q("/sessions",{method:"POST",body:JSON.stringify({title:t})}),ie=t=>q("/sessions/"+t+"/messages");async function $e(t,a,r,d){const c=crypto.randomUUID(),i=await fetch(he+"/sessions/"+t+"/runs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:a,request_id:c}),signal:r});if(!i.ok)throw new Error(i.status===409?"重复请求已拒绝":"HTTP "+i.status);if(!i.body)throw new Error("Browser does not support streaming response");const p=i.body.getReader(),f=new TextDecoder;let o="";const h=C=>{let n="message",k="";for(const g of C.split(`
`))g.startsWith("event:")&&(n=g.slice(6).trim()),g.startsWith("data:")&&(k+=g.slice(5).trim());if(k)try{d({...JSON.parse(k),type:n})}catch{}};try{for(;;){const{done:C,value:n}=await p.read();if(C)break;o+=f.decode(n,{stream:!0}).replace(/\r/g,"");let k=o.indexOf(`

`);for(;k>=0;)h(o.slice(0,k)),o=o.slice(k+2),k=o.indexOf(`

`)}o.trim()&&h(o)}finally{p.releaseLock()}}const Qe=[{group:"BUSINESS INTELLIGENCE",label:"经营数据分析",hint:"查阅本周营收、订单与变化趋势",prompt:"分析本周营收变化与订单表现，给出两条运营建议。"},{group:"INCIDENT RESPONSE",label:"异常诊断与排障",hint:"检索当前事件并关联知识库",prompt:"检查当前高优先级告警，结合知识库给出排障路径。"},{group:"AGENT WORKFLOW",label:"跨工具复盘",hint:"组合多个工具生成行动清单",prompt:"生成一份本周运营复盘：结合业务指标、异常事件和知识库提出行动清单。"}],es=[{name:"get_business_metrics",label:"经营指标查询",description:"只读 · 营收 / 订单 / 转化率"},{name:"list_incidents",label:"事件与告警检索",description:"只读 · 优先级 / 处理状态"},{name:"search_knowledge",label:"知识库检索",description:"只读 · 排障流程 / 标准"},{name:"calculate_growth",label:"增长率计算",description:"只读 · 精确数值计算"}],ss=`欢迎来到 **ORBIT Agent Console**。

我是一个用于展示 Agent 架构与工具执行链路的工程演示助手。选择下方任务，我会通过 **SSE 流式输出**、**只读工具调用** 和 **可观测执行轨迹** 展示完整处理过程。

> 公开站点使用确定性模拟。启动本地 FastAPI 后可连接真实 Agent Runtime；配置服务端模型密钥后可使用兼容 Chat Completions 的模型。`,K=(t,a)=>new Promise((r,d)=>{const c=setTimeout(()=>{a.removeEventListener("abort",i),r()},t),i=()=>{clearTimeout(c),d(new DOMException("Aborted","AbortError"))};a.aborted?i():a.addEventListener("abort",i,{once:!0})});async function ts(t,a,r){const d=/异常|告警|故障|风险|排障|排查/.test(t),c=!d||/指标|营收|订单|本周|复盘/.test(t),i=/知识|排障|复盘|行动|建议|清单/.test(t),p=[];c&&p.push({name:"get_business_metrics",args:{period:"week"},result:{period:"week",data:{revenue:863400,orders:2186,conversion_rate:4.5,revenue_change_pct:8.9},source:"seeded-demo"}}),d&&p.push({name:"list_incidents",args:{severity:"all"},result:{incidents:[{id:"INC-1042",severity:"high",service:"Checkout API",status:"investigating"},{id:"INC-1039",severity:"medium",service:"Data Pipeline",status:"monitoring"},{id:"INC-1036",severity:"low",service:"Notification",status:"resolved"}],source:"seeded-demo"}}),i&&p.push({name:"search_knowledge",args:{keyword:d?"支付":"运营"},result:{documents:[{id:"KB-01",title:"支付成功率异常处理"},{id:"KB-03",title:"运营复盘框架"}],source:"seeded-demo"}}),p.length||p.push({name:"get_business_metrics",args:{period:"week"},result:{period:"week",data:{revenue:863400,orders:2186,conversion_rate:4.5,revenue_change_pct:8.9},source:"seeded-demo"}});const f=crypto.randomUUID();r({type:"run_started",run_id:f,provider:"demo",model:"demo-operations-v1",simulated:!0});for(const h of["解析意图","制定执行计划"])r({type:"stage",title:h,detail:"确定问题范围并选择授权工具",status:"complete"}),await K(290,a);for(const h of p)r({type:"tool_started",tool:h.name,arguments:h.args}),await K(420+Math.random()*170,a),r({type:"tool_finished",tool:h.name,arguments:h.args,result:h.result,duration_ms:440});r({type:"stage",title:"综合分析",detail:"对齐指标口径，生成结论与行动项",status:"complete"});let o=`### 任务执行报告

> **演示说明：** 以下内容仅来自本地预设的模拟业务数据，并非真实企业生产环境。

`;c&&(o+=`#### 01 / 经营表现

| 指标 | 当前值 | 趋势 |
|---|---:|---:|
| 本周交易额 | ¥863,400 | +8.9% |
| 订单量 | 2,186 单 | — |
| 转化率 | 4.5% | — |

**判断：** 业务规模有所增长，但仍需要按照渠道和区域进一步拆解，确认增长来源。

`),d&&(o+=`#### 02 / 事件诊断

- **INC-1042 / 高优先级**：Checkout API 支付链路，当前正在排查。
- **INC-1039 / 中优先级**：Data Pipeline 延迟偏高，处于观察中。
- **INC-1036 / 低优先级**：通知积压已恢复。

`),o+=`#### 下一步建议

1. **验证指标口径**：核对当前统计区间、基线与异常时间窗口。
2. **锁定关键环节**：对高影响链路优先检查错误率、超时和重试。
3. **形成可执行跟进**：记录责任人、验证指标及下一次复核时间。

---

*本次只执行了白名单中的模拟只读工具，没有访问真实生产数据，也没有修改任何外部系统。*`;for(let h=0;h<o.length;h+=12)await K(26,a),r({type:"message_delta",text:o.slice(h,h+12)});r({type:"usage",prompt_tokens:Math.round(t.length/2)+41,completion_tokens:Math.round(o.length/2),estimated:!0}),r({type:"answer",text:o}),r({type:"run_completed",run_id:f,status:"completed",steps:p.length+3,duration_ms:2300+p.length*400})}const ns=[{id:"sample-1",type:"stage",title:"理解意图",detail:"识别业务目标、建立执行计划",status:"complete",startedAt:0,duration_ms:42},{id:"sample-2",type:"tool",title:"get_business_metrics",detail:"只读指标查询",status:"complete",startedAt:1,duration_ms:182},{id:"sample-3",type:"tool",title:"list_incidents",detail:"事件检索与优先级分类",status:"complete",startedAt:2,duration_ms:136},{id:"sample-4",type:"stage",title:"综合分析",detail:"合并上下文、生成建议",status:"complete",startedAt:3,duration_ms:64}];function as({trace:t,meta:a,apiAvailable:r}){const[d,c]=m.useState("trace"),[i,p]=m.useState(null),f=t.length?t:ns,o=t.length===0,h=t.filter(n=>n.status==="running").length,C=t.filter(n=>n.type==="tool"&&n.status==="complete").length;return e.jsxs("aside",{className:"inspector","aria-label":"Agent 执行和可观测性面板",children:[e.jsxs("div",{className:"inspector-header",children:[e.jsxs("div",{children:[e.jsx("span",{className:"mono-kicker",children:"OBSERVABILITY"}),e.jsxs("h2",{children:["Agent Inspector ",e.jsx("span",{className:"inspector-spark",children:"✳"})]})]}),e.jsxs("span",{className:"inspector-indicator",children:[e.jsx("i",{}),a.status==="running"?"RUNNING":"STANDBY"]})]}),e.jsxs("div",{className:"inspector-tabs",role:"tablist","aria-label":"执行面板标签",children:[e.jsxs("button",{role:"tab","aria-selected":d==="trace",className:d==="trace"?"selected":"",onClick:()=>c("trace"),children:[e.jsx(W,{size:14})," 执行链"]}),e.jsxs("button",{role:"tab","aria-selected":d==="tools",className:d==="tools"?"selected":"",onClick:()=>c("tools"),children:[e.jsx(Le,{size:14})," 工具"]}),e.jsxs("button",{role:"tab","aria-selected":d==="metrics",className:d==="metrics"?"selected":"",onClick:()=>c("metrics"),children:[e.jsx(ce,{size:14})," 指标"]})]}),e.jsxs("div",{className:"inspector-scroll",children:[d==="trace"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"trace-topline",children:[e.jsxs("span",{children:[e.jsx(qe,{size:13})," EXECUTION GRAPH"]}),e.jsx("span",{children:o?"SAMPLE TRACE":"CURRENT RUN"})]}),e.jsxs("div",{className:"trace-stats",children:[e.jsxs("div",{children:[e.jsx("small",{children:"EVENTS"}),e.jsx("strong",{children:o?"04":String(t.length).padStart(2,"0")})]}),e.jsxs("div",{children:[e.jsx("small",{children:"TOOLS USED"}),e.jsx("strong",{children:o?"02":String(C).padStart(2,"0")})]}),e.jsxs("div",{children:[e.jsx("small",{children:"ACTIVE"}),e.jsx("strong",{children:o?"00":String(h).padStart(2,"0")})]})]}),o&&e.jsxs("div",{className:"sample-caption",children:[e.jsx(te,{size:13})," 示例执行链，仅用于展示面板效果"]}),e.jsx("div",{className:"timeline",children:f.map((n,k)=>e.jsxs("div",{className:"trace-entry "+(n.status==="running"?"trace-running":""),children:[e.jsxs("div",{className:"trace-rail",children:[e.jsx("span",{className:"trace-node "+(n.type==="tool"?"tool":""),children:n.status==="complete"?e.jsx(Oe,{size:12}):n.type==="tool"?e.jsx(O,{size:12}):e.jsx(Ge,{size:12})}),k<f.length-1&&e.jsx("i",{})]}),e.jsxs("div",{className:"trace-content",children:[e.jsxs("div",{className:"trace-time",children:[e.jsxs("span",{children:["STEP ",String(k+1).padStart(2,"0")," / ",n.type==="tool"?"TOOL CALL":"REASONING"]}),e.jsx("span",{children:n.duration_ms?n.duration_ms+" ms":n.status==="running"?"…":"—"})]}),e.jsxs("button",{className:"trace-expand",onClick:()=>p(g=>g===n.id?null:n.id),"aria-expanded":i===n.id,children:[e.jsx("span",{children:n.title}),e.jsx(Ie,{className:i===n.id?"rotated":"",size:15})]}),e.jsx("p",{children:n.detail}),i===n.id&&e.jsxs("div",{className:"trace-details",children:[e.jsx("small",{children:"INPUT / OUTPUT"}),e.jsx("pre",{children:JSON.stringify(n.type==="tool"?{arguments:n.arguments||{},result:n.result??(o?{status:"sample-data"}:"running")}:{detail:n.detail,status:n.status},null,2)})]}),n.type==="tool"&&e.jsxs("span",{className:"trace-tool-label",children:[e.jsx(O,{size:11})," READ-ONLY TOOL"]})]})]},n.id))}),e.jsxs("div",{className:"inspector-tip",children:[e.jsx(U,{size:16}),e.jsxs("span",{children:[e.jsx("b",{children:"Execution boundary"}),e.jsx("small",{children:"所有演示工具仅可读取本地模拟数据，无任意命令执行或外部写入权限。"})]})]})]}),d==="tools"&&e.jsxs("div",{className:"tool-directory",children:[e.jsxs("div",{className:"trace-topline",children:[e.jsxs("span",{children:[e.jsx(O,{size:14})," TOOL REGISTRY"]}),e.jsx("span",{children:"4 AVAILABLE"})]}),e.jsx("p",{className:"tool-intro",children:"工具由服务端白名单注册，参数经 Schema 校验。模型不能直接执行任意代码。"}),es.map((n,k)=>e.jsxs("div",{className:"tool-item",children:[e.jsxs("div",{className:"tool-item-icon",children:[e.jsxs("span",{children:["0",k+1]}),e.jsx(O,{size:15})]}),e.jsxs("div",{children:[e.jsx("strong",{children:n.name}),e.jsx("small",{children:n.label}),e.jsx("p",{children:n.description})]}),e.jsx(Re,{size:15,className:"tool-verified"})]},n.name)),e.jsxs("div",{className:"registry-note",children:[e.jsx(U,{size:17})," No arbitrary tool execution"]})]}),d==="metrics"&&e.jsxs("div",{className:"metrics-screen",children:[e.jsxs("div",{className:"trace-topline",children:[e.jsxs("span",{children:[e.jsx(P,{size:13})," RUN TELEMETRY"]}),e.jsx("span",{children:a.status.toUpperCase()})]}),e.jsxs("div",{className:"metrics-card",children:[e.jsxs("span",{children:[e.jsx(Xe,{size:15})," EXECUTION TIME"]}),e.jsxs("strong",{children:[a.duration_ms!==null?(a.duration_ms/1e3).toFixed(2):"—"," ",e.jsx("small",{children:"sec"})]}),e.jsx("p",{children:a.duration_ms!==null?"本次已完成执行耗时":"从任务开始到完成自动计时"})]}),e.jsxs("div",{className:"metric-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"PROMPT TOKENS"}),e.jsx("strong",{children:a.usage?.prompt_tokens??"—"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"OUTPUT TOKENS"}),e.jsx("strong",{children:a.usage?.completion_tokens??"—"})]})]}),e.jsxs("div",{className:"metrics-card secondary",children:[e.jsxs("span",{children:[e.jsx(de,{size:14})," MODEL PROVIDER"]}),e.jsx("strong",{className:"model-label",children:a.model}),e.jsx("p",{children:r?"配置由 FastAPI 服务端统一管理":"当前为纯浏览器模拟 Provider"})]}),e.jsxs("div",{className:"billing-note",children:[e.jsx(te,{size:15})," ",a.usage?.estimated?"Token 数是估算值，并非真实计费用量。":"实际模型的 Token 计费需以服务商账单为准。"]})]})]}),e.jsxs("div",{className:"inspector-foot",children:[e.jsxs("span",{children:[e.jsx(P,{size:12})," ",r?"FASTAPI SSE CONNECTED":"BROWSER DEMO MODE"]}),e.jsxs("span",{children:[e.jsx(_e,{size:12})," ON-DEMAND"]})]})]})}const T={id:"welcome",role:"assistant",content:ss,sample:!0},is=[{id:"demo-1",title:"New exploration"},{id:"demo-2",title:"Revenue intelligence · 示例"},{id:"demo-3",title:"Incident triage · 示例"}],R=()=>crypto.randomUUID(),z={id:"",status:"idle",duration_ms:null,model:"demo-operations-v1",provider:"demo",usage:null},rs=async t=>{try{await navigator.clipboard.writeText(t)}catch{}};function ls(){const[t,a]=m.useState(null),[r,d]=m.useState(!1),[c,i]=m.useState(is),[p,f]=m.useState("demo-1"),[o,h]=m.useState([T]),[C,n]=m.useState([]),[k,g]=m.useState(z),[B,F]=m.useState(""),[E,_]=m.useState(!1),[L,w]=m.useState(""),[V,I]=m.useState(!1),[G,me]=m.useState(!0),[pe,A]=m.useState(!1),[xe,Y]=m.useState({"demo-1":[T]}),M=m.useRef(null),X=m.useRef(null),ue=m.useRef(null),v=!!t,je=!v||t?.mode==="simulated",ye=c.find(s=>s.id===p);m.useEffect(()=>{let s=!0;return Je().then(async x=>{if(s){if(x){a(x),g(y=>({...y,model:x.model,provider:x.provider}));try{const y=await Ze();if(!s)return;if(y.length)i(y),f(y[0].id),h(await ie(y[0].id));else{const u=await ae();if(!s)return;i([u]),f(u.id),h([T])}}catch{w("API 已连接，但读取会话失败；请检查后端。")}}d(!0)}}).catch(()=>{s&&d(!0)}),()=>{s=!1,M.current?.abort()}},[]),m.useEffect(()=>{X.current?.scrollIntoView({behavior:E?"smooth":"auto",block:"end"})},[o,E]),m.useEffect(()=>{if(!L)return;const s=window.setTimeout(()=>w(""),4500);return()=>clearTimeout(s)},[L]);const J=m.useCallback((s,x)=>{const y=s.type;if(y==="run_started")g({id:String(s.run_id),status:"running",duration_ms:null,model:String(s.model||"demo-operations-v1"),provider:String(s.provider||"demo"),usage:null});else if(y==="stage")n(u=>[...u,{id:R(),type:"stage",title:String(s.title||"执行阶段"),detail:String(s.detail||""),status:"complete",startedAt:Date.now()}]);else if(y==="tool_started"){const u=String(s.tool||"tool");n(j=>[...j,{id:R(),type:"tool",title:u,detail:"参数校验 · 正在执行只读工具",status:"running",arguments:s.arguments,startedAt:Date.now()}])}else if(y==="tool_finished"){const u=String(s.tool||"tool");n(j=>{const S=j.findIndex(N=>N.type==="tool"&&N.title===u&&N.status==="running");return j.map((N,b)=>b===S?{...N,status:"complete",result:s.result,detail:"执行成功 · 结果已加入模型上下文",duration_ms:Number(s.duration_ms||Date.now()-N.startedAt)}:N)})}else y==="message_delta"?h(u=>u.map(j=>j.id===x?{...j,content:j.content+String(s.text||"")}:j)):y==="answer"?h(u=>u.map(j=>j.id===x?{...j,content:String(s.text||j.content),pending:!1}:j)):y==="usage"?g(u=>({...u,usage:{prompt_tokens:Number(s.prompt_tokens||0),completion_tokens:Number(s.completion_tokens||0),estimated:!!s.estimated}})):y==="run_completed"?g(u=>({...u,status:"complete",duration_ms:Number(s.duration_ms||0)})):y==="run_failed"&&(g(u=>({...u,status:"failed"})),w(String(s.message||"Agent 执行失败")),h(u=>u.map(j=>j.id===x?{...j,pending:!1,content:j.content||"执行失败，请检查连接后重试。"}:j)))},[]),Z=m.useCallback(async s=>{if(!s.trim()||E)return;const x=s.trim(),y=R(),u=R(),j=new AbortController;M.current=j,_(!0),F(""),n([]),g(S=>({...S,id:"",status:"running",duration_ms:null,usage:null})),h(S=>[...S,{id:y,role:"user",content:x},{id:u,role:"assistant",content:"",pending:!0}]);try{const S=N=>J(N,u);v?await $e(p,x,j.signal,S):await ts(x,j.signal,S),v||i(N=>N.map(b=>b.id===p?{...b,title:b.title==="New exploration"?x.slice(0,29):b.title}:b))}catch(S){j.signal.aborted?(g(N=>({...N,status:"cancelled"})),w("已停止当前输出")):(g(N=>({...N,status:"failed"})),w(S instanceof Error?S.message:"连接失败")),h(N=>N.map(b=>b.id===u?{...b,pending:!1,content:b.content||"任务已终止。"}:b))}finally{_(!1),M.current=null}},[v,E,J,p]);m.useEffect(()=>{!v&&!E&&Y(s=>({...s,[p]:o}))},[o,v,E,p]);const ge=async()=>{if(E&&(M.current?.abort(),_(!1)),v)try{const s=await ae();i(x=>[s,...x]),f(s.id)}catch{w("创建会话失败");return}else{const s={id:R(),title:"New exploration"};i(x=>[s,...x]),f(s.id),Y(x=>({...x,[s.id]:[T]}))}h([T]),n([]),g({...z,model:t?.model||z.model,provider:t?.provider||"demo"}),I(!1)},Ne=async s=>{if(E){w("请先停止当前执行再切换会话");return}if(f(s),n([]),g({...z,model:t?.model||z.model,provider:t?.provider||"demo"}),v)try{const x=await ie(s);h(x.length?x:[T])}catch{w("读取会话失败")}else h(xe[s]||[T]);I(!1)},fe=()=>{M.current?.abort(),_(!1)},$=()=>{Z(B)},ke=Qe;return e.jsxs("div",{className:"orbit-shell",children:[V&&e.jsx("button",{className:"mobile-backdrop","aria-label":"关闭导航",onClick:()=>I(!1)}),e.jsxs("aside",{className:"sidebar "+(V?"mobile-open":""),children:[e.jsxs("div",{className:"brand",children:[e.jsx("a",{href:"https://dicky-l.github.io/bugless.github.io/",className:"brand-symbol",title:"返回作品集",children:"✳"}),e.jsxs("div",{className:"brand-name",children:[e.jsxs("strong",{children:["ORBIT",e.jsx("span",{children:"®"})]}),e.jsx("small",{children:"AGENT OPERATIONS"})]}),e.jsx("button",{className:"mobile-close",onClick:()=>I(!1),"aria-label":"关闭菜单",children:e.jsx(ne,{size:17})})]}),e.jsxs("div",{className:"workspace-switch",children:[e.jsx("span",{className:"workspace-icon",children:e.jsx(De,{size:16})}),e.jsxs("span",{children:["Operations Lab ",e.jsx("small",{children:"Engineering workspace"})]}),e.jsx(Me,{size:14})]}),e.jsxs("button",{className:"new-session",onClick:()=>void ge(),children:[e.jsx(Fe,{size:17})," 新建 Agent 会话 ",e.jsx("span",{children:"⌘K"})]}),e.jsxs("div",{className:"side-section",children:[e.jsxs("div",{className:"side-title",children:["WORKSPACE ",e.jsx("span",{children:"01"})]}),e.jsxs("button",{className:"side-link active",children:[e.jsx(H,{size:17})," Agent 工作台 ",e.jsx("span",{className:"side-active-dot"})]}),e.jsxs("button",{className:"side-link",onClick:()=>A(!0),children:[e.jsx(W,{size:17})," Agent 架构 ",e.jsx(D,{size:14})]}),e.jsxs("button",{className:"side-link",onClick:()=>A(!0),children:[e.jsx(O,{size:17})," 工具注册表 ",e.jsx("span",{children:"04"})]})]}),e.jsxs("div",{className:"side-section history-section",children:[e.jsxs("div",{className:"side-title",children:["RECENT SESSIONS ",e.jsx(Be,{size:14})]}),e.jsx("div",{className:"sessions",children:c.slice(0,9).map(s=>e.jsxs("button",{title:s.title,className:"session "+(s.id===p?"current":""),onClick:()=>void Ne(s.id),children:[e.jsx(H,{size:15}),e.jsx("span",{children:s.title}),s.id===p&&e.jsx("span",{className:"session-arrow",children:"↗"})]},s.id))})]}),e.jsxs("div",{className:"sidebar-bottom",children:[e.jsxs("div",{className:"sidebar-card",children:[e.jsx("span",{className:"sidebar-card-icon",children:e.jsx(de,{size:18})}),e.jsx("b",{children:"Built for the real world."}),e.jsx("p",{children:"可解释的执行链、可替换模型，以及工程级边界控制。"}),e.jsxs("button",{onClick:()=>A(!0),children:["探索系统设计 ",e.jsx(D,{size:13})]})]}),e.jsxs("div",{className:"sidebar-profile",children:[e.jsx("span",{className:"profile-avatar",children:"DK"}),e.jsxs("span",{children:["Engineering portfolio ",e.jsx("small",{children:"AI-native application"})]}),e.jsx(Ue,{size:18})]})]})]}),e.jsxs("div",{className:"main-area",children:[e.jsxs("header",{className:"topbar",children:[e.jsxs("div",{className:"topbar-left",children:[e.jsx("button",{className:"mobile-menu-btn","aria-label":"打开导航",onClick:()=>I(!0),children:e.jsx(He,{size:20})}),e.jsx("span",{className:"topbar-path",children:"WORKSPACE"}),e.jsx("span",{className:"topbar-sep",children:"/"}),e.jsx("span",{className:"topbar-current",children:"Agent Console"}),e.jsx("span",{className:"topbar-version",children:"v0.1"})]}),e.jsxs("div",{className:"topbar-right",children:[e.jsxs("span",{className:"connection-status "+(v?"connected":""),children:[e.jsx("i",{}),r?v?"FASTAPI CONNECTED":"SIMULATED DEMO":"CHECKING..."]}),e.jsx("button",{className:"top-icon",onClick:()=>A(!0),title:"架构与运行模式","aria-label":"查看运行模式说明",children:e.jsx(ze,{size:18})}),e.jsx("button",{className:"top-icon inspector-toggle",title:"切换右侧面板","aria-label":"切换执行轨迹面板",onClick:()=>me(s=>!s),children:G?e.jsx(Ke,{size:19}):e.jsx(We,{size:19})}),e.jsx("span",{className:"top-avatar",children:"D"})]})]}),e.jsxs("div",{className:"body-layout "+(G?"":"wide"),children:[e.jsxs("main",{className:"conversation-area",children:[e.jsx("div",{className:"conversation-scroll",children:e.jsxs("div",{className:"chat-inner",children:[e.jsxs("div",{className:"hero-intro",children:[e.jsxs("div",{className:"hero-top",children:[e.jsxs("span",{className:"hero-topline",children:[e.jsx(se,{size:14})," ORBIT / INTELLIGENCE SYSTEM"]}),e.jsx("span",{className:"hero-index",children:"SYS // 001"})]}),e.jsxs("div",{className:"hero-content",children:[e.jsxs("div",{className:"hero-heading",children:[e.jsx("p",{children:"THE AGENT CONTROL ROOM"}),e.jsxs("h1",{children:["Think.",e.jsx("br",{}),e.jsx("em",{children:"Act."})," Observe."]}),e.jsxs("div",{className:"hero-description",children:["让每一次 AI 决策，都有迹可循。",e.jsx("br",{}),"流式交互、工具执行、完整观测，一屏掌握。"]})]}),e.jsxs("div",{className:"agent-emblem","aria-hidden":"true",children:[e.jsx("div",{className:"emblem-grid"}),e.jsx("div",{className:"emblem-ring ring1"}),e.jsx("div",{className:"emblem-ring ring2"}),e.jsx("div",{className:"emblem-ring ring3"}),e.jsx("div",{className:"emblem-core",children:e.jsx("span",{children:"✳"})}),e.jsx("span",{className:"emblem-label",children:"AGENT CORE"})]})]}),e.jsxs("div",{className:"hero-bottom",children:[e.jsxs("span",{children:[e.jsx(P,{size:12})," ",v?t?.provider==="demo"?"FASTAPI DEMO ENGINE":"LLM PROVIDER ENABLED":"BROWSER SIMULATION ENGINE"]}),e.jsxs("span",{children:["READ · REASON · RESPOND ",e.jsx(oe,{size:12})]})]})]}),e.jsxs("div",{className:"chat-section-heading",children:[e.jsxs("span",{children:["CONVERSATION ",e.jsx("span",{className:"heading-count",children:Math.max(0,o.filter(s=>!s.sample).length)})]}),e.jsxs("span",{className:"chat-session-name",children:[e.jsx("i",{}),ye?.title||"New exploration"]})]}),e.jsx("div",{className:"messages",children:o.map(s=>e.jsxs("div",{className:"message "+s.role+(s.sample?" sample":""),children:[e.jsx("div",{className:"message-avatar "+s.role,children:s.role==="assistant"?e.jsx("span",{children:"✳"}):"D"}),e.jsxs("div",{className:"message-main",children:[e.jsxs("div",{className:"message-top",children:[e.jsx("strong",{children:s.role==="assistant"?"ORBIT AGENT":"You"}),e.jsx("span",{children:s.sample?"SYSTEM GREETING":s.pending?"GENERATING...":s.created_at?new Date(s.created_at).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}):"JUST NOW"})]}),s.role==="assistant"?e.jsxs("div",{className:"markdown-body",children:[e.jsx(ve,{remarkPlugins:[be],skipHtml:!0,children:s.content}),s.pending&&e.jsx("span",{className:"type-cursor"}),s.pending&&!s.content&&e.jsxs("div",{className:"thinking-lines",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})]}):e.jsx("p",{className:"user-message-text",children:s.content}),s.role==="assistant"&&!s.pending&&!s.sample&&e.jsxs("div",{className:"message-actions",children:[e.jsxs("button",{"aria-label":"复制回答",onClick:()=>void rs(s.content),children:[e.jsx(Pe,{size:13})," 复制"]}),e.jsxs("span",{children:[e.jsx(Te,{size:12})," ",je?"SIMULATED":"STREAMED"]})]})]})]},s.id))}),o.length<=1&&e.jsxs("div",{className:"prompt-showcase",children:[e.jsxs("div",{className:"prompt-title",children:[e.jsx("span",{children:"START WITH A WORKFLOW"}),e.jsx("span",{children:"03 READY-TO-RUN MISSIONS"})]}),e.jsx("div",{className:"prompt-grid",children:ke.map((s,x)=>e.jsxs("button",{className:"prompt-card",onClick:()=>void Z(s.prompt),children:[e.jsxs("span",{className:"prompt-index",children:["0",x+1," ",e.jsx(cs,{})]}),e.jsx("strong",{children:s.label}),e.jsx("small",{children:s.hint}),e.jsx("span",{className:"prompt-arrow",children:e.jsx(D,{size:17})})]},s.label))})]}),e.jsx("div",{ref:X})]})}),e.jsx("div",{className:"composer-zone",children:e.jsxs("div",{className:"composer-inner",children:[e.jsxs("div",{className:"composer",children:[e.jsxs("div",{className:"composer-topline",children:[e.jsxs("span",{children:[e.jsx("span",{className:"composer-model-dot"})," ",v?t?.model:"demo-operations-v1"]}),e.jsx("span",{children:E?"AGENT EXECUTING":"READY TO RUN"})]}),e.jsx("textarea",{ref:ue,value:B,onChange:s=>F(s.target.value),onKeyDown:s=>{s.key==="Enter"&&(s.metaKey||s.ctrlKey)&&(s.preventDefault(),$())},placeholder:"给 Agent 一项任务，看看它如何思考与行动...",maxLength:4e3,rows:2,"aria-label":"输入 Agent 任务",disabled:E}),e.jsxs("div",{className:"composer-toolbar",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"composer-chip",children:[e.jsx(U,{size:13})," Read-only tools"]}),e.jsxs("span",{className:"composer-chip",children:[e.jsx(P,{size:13})," SSE stream"]})]}),E?e.jsxs("button",{className:"send-button stop",onClick:fe,children:[e.jsx(Ye,{size:15,fill:"currentColor"})," 停止"]}):e.jsxs("button",{className:"send-button",onClick:$,disabled:!B.trim(),children:[e.jsx(Ve,{size:15})," 执行任务"]})]})]}),e.jsxs("div",{className:"composer-caption",children:[e.jsx("span",{children:"⌘ / Ctrl + Enter 发送 · 执行过程中可随时停止"}),e.jsx("span",{children:v?t?.mode==="simulated"?"BACKEND DEMO · NO REAL MODEL":"LIVE MODEL · MOCK BUSINESS DATA":"STATIC DEMO · NO API CONNECTION"})]})]})})]}),G&&e.jsx(as,{trace:C,meta:k,apiAvailable:v})]})]}),L&&e.jsxs("div",{className:"toast",role:"status",children:[e.jsx(ce,{size:17}),L]}),pe&&e.jsx("div",{className:"modal-overlay",onClick:()=>A(!1),children:e.jsxs("section",{className:"architecture-modal",role:"dialog","aria-modal":"true","aria-labelledby":"architecture-title",onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"modal-head",children:[e.jsx("span",{children:"ENGINEERING NOTES / 001"}),e.jsx("button",{"aria-label":"关闭",onClick:()=>A(!1),children:e.jsx(ne,{size:18})})]}),e.jsxs("h2",{id:"architecture-title",children:["Built beyond a chat box",e.jsx("span",{children:"."})]}),e.jsx("p",{children:"此案例的重点是可运行的 Agent 执行链，而不是模仿某个聊天产品的 UI。"}),e.jsxs("div",{className:"architecture-flow",children:[e.jsxs("div",{children:[e.jsx(H,{size:21}),e.jsx("strong",{children:"React Console"}),e.jsx("small",{children:"聊天、流式事件、执行轨迹"})]}),e.jsx(ee,{size:20}),e.jsxs("div",{children:[e.jsx(W,{size:21}),e.jsx("strong",{children:"FastAPI Runtime"}),e.jsx("small",{children:"SSE · 会话持久化 · 幂等"})]}),e.jsx(ee,{size:20}),e.jsxs("div",{className:"arch-split",children:[e.jsxs("span",{children:[e.jsx(se,{size:20}),e.jsx("strong",{children:"LLM Adapter"}),e.jsx("small",{children:"Demo / OpenAI-compatible"})]}),e.jsxs("span",{children:[e.jsx(O,{size:20}),e.jsx("strong",{children:"Tool Registry"}),e.jsx("small",{children:"4 个只读工具 · 参数验证"})]})]})]}),e.jsxs("div",{className:"architecture-caveat",children:[e.jsx(U,{size:18}),e.jsx("span",{children:"GitHub Pages 仅部署前端模拟体验。FastAPI 需在独立服务器或本地运行；模型密钥只存在服务端环境变量。当前案例不包含真实企业数据，也未完成公网级身份认证。"})]}),e.jsxs("button",{className:"modal-cta",onClick:()=>A(!1),children:["返回工作台 ",e.jsx(D,{size:16})]})]})})]})}function cs(){return e.jsx(oe,{size:15,style:{transform:"rotate(45deg)"}})}re(document.getElementById("root")).render(e.jsx(Ee.StrictMode,{children:e.jsx(ls,{})}));
