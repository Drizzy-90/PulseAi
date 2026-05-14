import { useState, useEffect } from "react";

const C = {
  bg:"#080b11",surface:"#0e1219",card:"#121820",card2:"#161d28",
  border:"#1c2535",borderHi:"#253044",accent:"#00c8f0",accentDim:"#00c8f022",
  green:"#00e676",greenDim:"#00e67618",red:"#ff3d57",redDim:"#ff3d5718",
  yellow:"#ffd740",yellowDim:"#ffd74018",purple:"#b388ff",purpleDim:"#b388ff18",
  text:"#dde4f0",textSoft:"#8a9ab8",muted:"#4a5670",subtle:"#1e2a3d",subtle2:"#162030",
};

const PLAYS = [
  { id:1, time:"8:30 AM", ticker:"NVDA", type:"Options", direction:"CALL", strike:"$875C", expiry:"0DTE", confidence:89, sector:"Technology",
    reason:"Pre-market gap up +4.2% on earnings beat ($6.12 vs $5.59 est). IV elevated at 84% — enter within first 5 min before IV normalizes. RSI on 1m reclaiming 55. VWAP reclaim in progress. Dark pool print: $340M bullish flow at 8:24AM.",
    price:"$12.40", target:"$21.00", stop:"$8.50", rr:"2.4:1", style:"Scalp",
    tags:["Earnings","Momentum","Dark Pool"], chart:[42,45,43,47,52,49,55,58,61,59,64,68,72,75],
    volume:"4.2M", volRatio:"2.3x", technicals:{RSI:"61 (Rising)",MACD:"Bullish Cross",VWAP:"Above",MA200:"Above"} },
  { id:2, time:"10:30 AM", ticker:"SPY", type:"Stock", direction:"LONG", strike:null, expiry:null, confidence:76, sector:"ETFs / Index",
    reason:"VWAP hold confirmed after 10AM flush. Institutional flow detected — $1.2B cumulative dark pool prints. CPI came in 2.9% vs 3.1% est. Three white soldiers forming on 5m chart. Macro tailwind favors large cap continuation.",
    price:"$512.30", target:"$516.50", stop:"$510.80", rr:"2.8:1", style:"Day Trade",
    tags:["Macro","VWAP Hold","Institutional"], chart:[55,52,50,48,47,49,52,54,56,55,58,60,61,63],
    volume:"89M", volRatio:"1.2x", technicals:{RSI:"54",MACD:"Neutral",VWAP:"At VWAP",MA200:"Above"} },
  { id:3, time:"12:30 PM", ticker:"TSLA", type:"Options", direction:"PUT", strike:"$170P", expiry:"1 Week", confidence:83, sector:"EV / Auto",
    reason:"Rejected at 200-day MA ($178.40) — 3rd failed breakout in 8 sessions. Unusual put volume 3.1x avg. 5,000 contracts swept at $170P expiring Friday. Bearish MACD divergence on 15m. RSI rolling over at 62.",
    price:"$4.80", target:"$9.20", stop:"$3.10", rr:"2.6:1", style:"Swing",
    tags:["Unusual Activity","Resistance","MACD Divergence"], chart:[70,72,75,74,71,68,65,63,64,62,60,57,55,53],
    volume:"2.1M", volRatio:"1.5x", technicals:{RSI:"48 (Falling)",MACD:"Bearish Cross",VWAP:"Below",MA200:"Below"} },
  { id:4, time:"8:30 AM", ticker:"AMD", type:"Options", direction:"CALL", strike:"$165C", expiry:"3 Days", confidence:71, sector:"Technology",
    reason:"Sympathy play on NVDA strength. AMD historically moves 60-70% of NVDA's move on earnings-adjacent days. Pre-market +2.1%. Key level: breakout above $163.50 opens path to $168.",
    price:"$3.20", target:"$5.80", stop:"$2.10", rr:"2.5:1", style:"Day Trade",
    tags:["Sympathy Play","Breakout"], chart:[50,51,53,55,54,56,58,57,59,62,63,65,66,68],
    volume:"3.1M", volRatio:"1.4x", technicals:{RSI:"58",MACD:"Bullish",VWAP:"Above",MA200:"Above"} },
];

const WATCHLIST = [
  { ticker:"AAPL", name:"Apple Inc.", price:"189.42", change:"+1.23", pct:"+0.65%", up:true, alert:true, note:"Watching $192 breakout" },
  { ticker:"AMD", name:"Advanced Micro Devices", price:"162.88", change:"+4.10", pct:"+2.58%", up:true, alert:false, note:"" },
  { ticker:"META", name:"Meta Platforms", price:"504.33", change:"-3.21", pct:"-0.63%", up:false, alert:true, note:"FTC investigation alert set" },
  { ticker:"QQQ", name:"Nasdaq 100 ETF", price:"441.10", change:"+2.87", pct:"+0.65%", up:true, alert:false, note:"" },
  { ticker:"AMZN", name:"Amazon.com", price:"192.55", change:"-0.44", pct:"-0.23%", up:false, alert:false, note:"" },
  { ticker:"MSFT", name:"Microsoft Corp.", price:"418.22", change:"+3.15", pct:"+0.76%", up:true, alert:false, note:"" },
];

const NEWS = [
  { time:"8:31 AM", ticker:"NVDA", headline:"NVDA beats Q1 EPS by $0.42, raises full-year guidance — shares surge 4.2% pre-market", impact:"HIGH", up:true, category:"Earnings" },
  { time:"9:14 AM", ticker:"TSLA", headline:"Tesla Q2 delivery miss — Europe sales down 8%, analyst cuts target to $155", impact:"HIGH", up:false, category:"Analyst" },
  { time:"10:02 AM", ticker:"META", headline:"FTC opens new antitrust investigation into Meta's ad-tech dominance", impact:"MED", up:false, category:"Regulatory" },
  { time:"11:47 AM", ticker:"AMD", headline:"Unusual call sweep: 5,000 contracts $170C expiring Friday — $2.4M premium paid", impact:"MED", up:true, category:"Flow" },
  { time:"12:11 PM", ticker:"SPY", headline:"Powell: Fed sees no rate cut before September, inflation data still sticky", impact:"MED", up:false, category:"Macro" },
  { time:"12:44 PM", ticker:"AAPL", headline:"Apple reportedly expanding iPhone 17 production by 15% above prior forecast", impact:"LOW", up:true, category:"Supply Chain" },
];

const TRADES_LOG = [
  { date:"May 13", ticker:"NVDA", type:"CALL", entry:"$10.20", exit:"$18.40", pnl:"+$820", pct:"+80.4%", win:true },
  { date:"May 12", ticker:"SPY", type:"LONG", entry:"$510.50", exit:"$514.10", pnl:"+$360", pct:"+0.7%", win:true },
  { date:"May 12", ticker:"TSLA", type:"PUT", entry:"$5.10", exit:"$3.40", pnl:"-$170", pct:"-33.3%", win:false },
  { date:"May 10", ticker:"AMD", type:"CALL", entry:"$3.80", exit:"$7.60", pnl:"+$380", pct:"+100%", win:true },
  { date:"May 9", ticker:"META", type:"PUT", entry:"$6.20", exit:"$11.40", pnl:"+$520", pct:"+83.9%", win:true },
  { date:"May 8", ticker:"QQQ", type:"CALL", entry:"$4.30", exit:"$2.90", pnl:"-$140", pct:"-32.6%", win:false },
];

const MiniChart = ({ data, up, w=120, h=40 }) => {
  const min=Math.min(...data), max=Math.max(...data), range=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*(h-6)-3}`).join(" ");
  const color=up?C.green:C.red, uid=`gc${up}${w}`;
  return (
    <svg width={w} height={h} style={{display:"block",overflow:"visible"}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
};

const Badge = ({children, color, sm=true}) => (
  <span style={{background:color+"1e",color,border:`1px solid ${color}40`,borderRadius:4,
    padding:sm?"2px 7px":"4px 10px",fontSize:sm?10:12,fontWeight:700,
    letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>
);

const ConfBar = ({value}) => {
  const color=value>=82?C.green:value>=68?C.yellow:C.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:3,background:C.subtle,borderRadius:2,overflow:"hidden"}}>
        <div style={{width:`${value}%`,height:"100%",background:color,borderRadius:2}}/>
      </div>
      <span style={{fontSize:11,color,fontWeight:700,minWidth:30}}>{value}%</span>
    </div>
  );
};

const StatBox = ({label,value,sub,color}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
    <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{label}</div>
    <div style={{fontSize:22,fontWeight:900,color:color||C.text,fontFamily:"monospace",letterSpacing:"-0.02em"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.textSoft,marginTop:3}}>{sub}</div>}
  </div>
);

const PlayCard = ({play, expanded, onToggle}) => {
  const up=play.direction==="CALL"||play.direction==="LONG";
  const typeColor=play.type==="Options"?C.purple:C.accent;
  const dirColor=up?C.green:C.red;
  return (
    <div onClick={onToggle} style={{background:expanded?C.card2:C.card,border:`1px solid ${expanded?C.accent+"55":C.border}`,
      borderRadius:14,cursor:"pointer",overflow:"hidden",transition:"all 0.2s",
      boxShadow:expanded?`0 0 32px ${C.accent}10`:"none"}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{background:C.subtle,borderRadius:6,padding:"5px 10px",fontSize:10,color:C.accent,fontWeight:700,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{play.time}</div>
        <div style={{flex:1,minWidth:160}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-0.02em",fontFamily:"'Syne',sans-serif"}}>{play.ticker}</span>
            <Badge color={typeColor}>{play.type}</Badge>
            <Badge color={dirColor}>{play.strike||play.direction}</Badge>
            {play.expiry&&<Badge color={C.muted}>{play.expiry}</Badge>}
          </div>
          <div style={{fontSize:11,color:C.textSoft}}>{play.sector} · {play.style}</div>
        </div>
        <div style={{textAlign:"center",minWidth:55}}>
          <div style={{fontSize:9,color:C.muted,marginBottom:2,letterSpacing:"0.1em"}}>VOLUME</div>
          <div style={{fontSize:12,fontWeight:700,color:C.yellow}}>{play.volRatio}</div>
        </div>
        <div style={{width:130}}>
          <div style={{fontSize:9,color:C.muted,marginBottom:4,letterSpacing:"0.1em"}}>CONFIDENCE</div>
          <ConfBar value={play.confidence}/>
        </div>
        <MiniChart data={play.chart} up={up} w={100} h={36}/>
        <div style={{color:C.muted,fontSize:14,transition:"transform 0.2s",transform:expanded?"rotate(180deg)":"none"}}>▾</div>
      </div>
      {expanded&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"18px 20px",animation:"fadeIn 0.2s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {[{l:"Entry",v:play.price,c:C.text},{l:"Target",v:play.target,c:C.green},{l:"Stop Loss",v:play.stop,c:C.red},{l:"Risk/Reward",v:play.rr,c:C.yellow}].map(s=>(
              <div key={s.l} style={{background:C.subtle,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{s.l}</div>
                <div style={{fontSize:17,fontWeight:700,color:s.c,fontFamily:"monospace"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{fontSize:9,color:C.muted,letterSpacing:"0.1em"}}>INDICATORS:</div>
            {Object.entries(play.technicals).map(([k,v])=>{
              const isBull=v.toLowerCase().includes("bull")||v==="Above";
              const isBear=v.toLowerCase().includes("bear")||v==="Below";
              const col=isBull?C.green:isBear?C.red:C.yellow;
              return <span key={k} style={{background:col+"15",color:col,border:`1px solid ${col}30`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:600}}>{k}: {v}</span>;
            })}
          </div>
          <div style={{background:C.subtle2,borderRadius:10,padding:"14px 16px",borderLeft:`3px solid ${C.accent}`,marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:14}}>🤖</span>
              <span style={{fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>AI Analysis</span>
            </div>
            <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.65}}>{play.reason}</p>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {play.tags.map(t=>(
              <span key={t} style={{background:C.subtle,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"3px 10px",fontSize:11,color:C.textSoft}}>#{t}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,padding:"9px",background:C.greenDim,border:`1px solid ${C.green}44`,borderRadius:8,color:C.green,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Track This Play</button>
            <button style={{padding:"9px 14px",background:C.yellowDim,border:`1px solid ${C.yellow}44`,borderRadius:8,color:C.yellow,fontWeight:700,fontSize:12,cursor:"pointer"}}>🔔 Set Alert</button>
            <button style={{padding:"9px 14px",background:C.subtle,border:`1px solid ${C.border}`,borderRadius:8,color:C.textSoft,fontWeight:600,fontSize:12,cursor:"pointer"}}>Share</button>
          </div>
        </div>
      )}
    </div>
  );
};

const NAV=[
  {id:"dashboard",icon:"◉",label:"Dashboard"},
  {id:"plays",icon:"⚡",label:"Today's Plays",badge:"4",badgeColor:C.green},
  {id:"watchlist",icon:"👁",label:"Watchlist"},
  {id:"news",icon:"📡",label:"News & Alerts",badge:"6",badgeColor:C.red},
  {id:"portfolio",icon:"💼",label:"Portfolio"},
  {id:"journal",icon:"📓",label:"Trade Journal"},
  {id:"sectors",icon:"🗂",label:"Sectors"},
  {id:"screener",icon:"🔍",label:"AI Screener"},
  {id:"goals",icon:"🎯",label:"Goals"},
  {id:"education",icon:"🎓",label:"Learn"},
  {id:"settings",icon:"⚙",label:"Settings"},
];

const Sidebar = ({active, setActive, trialDays}) => (
  <div style={{width:228,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
    <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.accent},${C.purple})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
        <div>
          <div style={{fontSize:18,fontWeight:900,color:C.text,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.03em",lineHeight:1}}>PulseAI</div>
          <div style={{fontSize:9,color:C.muted,letterSpacing:"0.15em",marginTop:1}}>MARKET INTELLIGENCE</div>
        </div>
      </div>
    </div>
    <div style={{margin:"10px 10px 4px",background:`linear-gradient(135deg,${C.accent}18,${C.purple}18)`,border:`1px solid ${C.accent}33`,borderRadius:10,padding:"10px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:C.accent,fontWeight:700,letterSpacing:"0.08em"}}>FREE TRIAL</div>
          <div style={{fontSize:11,color:C.textSoft,marginTop:1}}>{trialDays} days left · then $2.99/mo</div>
        </div>
        <div style={{fontSize:20,fontWeight:900,color:C.accent,fontFamily:"monospace"}}>{trialDays}</div>
      </div>
      <div style={{marginTop:6,height:3,background:C.subtle,borderRadius:2,overflow:"hidden"}}>
        <div style={{width:`${(trialDays/30)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.purple})`,borderRadius:2}}/>
      </div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
      {NAV.map(item=>(
        <div key={item.id} onClick={()=>setActive(item.id)} style={{
          display:"flex",alignItems:"center",gap:10,padding:"9px 20px",cursor:"pointer",
          background:active===item.id?C.accent+"12":"transparent",
          borderLeft:active===item.id?`2px solid ${C.accent}`:"2px solid transparent",
          color:active===item.id?C.accent:C.textSoft,
          fontWeight:active===item.id?700:400,fontSize:13,transition:"all 0.12s",
        }}>
          <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>
          <span style={{flex:1}}>{item.label}</span>
          {item.badge&&<span style={{background:item.badgeColor+"22",color:item.badgeColor,border:`1px solid ${item.badgeColor}44`,borderRadius:10,fontSize:9,fontWeight:700,padding:"1px 5px"}}>{item.badge}</span>}
        </div>
      ))}
    </div>
    <div style={{borderTop:`1px solid ${C.border}`,padding:"13px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.purple},${C.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.bg}}>J</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:C.text}}>John Trader</div>
          <div style={{fontSize:10,color:C.muted}}>Day Trader · Pro Trial</div>
        </div>
      </div>
    </div>
  </div>
);

const TopBar = ({time, marketOpen}) => (
  <div style={{height:46,background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:0,flexShrink:0}}>
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {[{t:"SPY",v:"512.30",c:"+0.51%",up:true},{t:"QQQ",v:"441.10",c:"+0.65%",up:true},{t:"DIA",v:"394.88",c:"-0.12%",up:false},{t:"VIX",v:"18.42",c:"-5.2%",up:false},{t:"BTC",v:"62,440",c:"+1.8%",up:true},{t:"GOLD",v:"2,341",c:"+0.3%",up:true}].map((m,i,arr)=>(
        <div key={m.t} style={{display:"flex",gap:5,alignItems:"center",padding:"0 14px",borderRight:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <span style={{fontSize:11,color:C.muted,fontWeight:600}}>{m.t}</span>
          <span style={{fontSize:12,color:m.up?C.green:C.red,fontWeight:700,fontFamily:"monospace"}}>{m.v}</span>
          <span style={{fontSize:10,color:m.up?C.green:C.red}}>{m.c}</span>
        </div>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:marketOpen?C.green:C.red,animation:marketOpen?"pulse 2s infinite":"none"}}/>
        <span style={{fontSize:10,color:C.textSoft,letterSpacing:"0.06em"}}>{marketOpen?"MARKET OPEN":"MARKET CLOSED"}</span>
      </div>
      <div style={{fontSize:11,color:C.muted,fontFamily:"monospace"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})} ET</div>
    </div>
  </div>
);

const DashboardView = ({setActive}) => {
  const pnlData=[210,340,290,480,420,610,580,720,680,810,890,1010,980,1190];
  return (
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Good morning, John 👋</h2>
        <p style={{margin:"4px 0 0",fontSize:13,color:C.textSoft}}>Wednesday, May 13 · 4 plays ready · Market opens in 12 min</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatBox label="Portfolio Value" value="$24,810" sub="+$412 today" color={C.green}/>
        <StatBox label="Day P&L" value="+$412" sub="+1.69%" color={C.green}/>
        <StatBox label="Win Rate (30d)" value="67%" sub="21 of 31 trades" color={C.accent}/>
        <StatBox label="Today's Plays" value="4" sub="3 time slots covered" color={C.purple}/>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>Monthly P&L Curve</div>
            <div style={{fontSize:11,color:C.textSoft}}>May 2026</div>
          </div>
          <div style={{fontSize:20,fontWeight:900,color:C.green,fontFamily:"monospace"}}>+$1,190</div>
        </div>
        <MiniChart data={pnlData} up={true} w={560} h={60}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[
          {icon:"⚡",label:"View Today's Plays",sub:"4 plays across 3 time slots",view:"plays",color:C.accent},
          {icon:"📡",label:"News & Alerts",sub:"6 new items since open",view:"news",color:C.red},
          {icon:"📓",label:"Trade Journal",sub:"Log your last trade",view:"journal",color:C.purple},
        ].map(q=>(
          <div key={q.view} onClick={()=>setActive(q.view)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:24}}>{q.icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:q.color}}>{q.label}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{q.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:`linear-gradient(135deg,${C.accent}12,${C.purple}08)`,border:`1px solid ${C.accent}30`,borderRadius:12,padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{fontSize:26}}>🤖</div>
        <div>
          <div style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:6,letterSpacing:"0.08em"}}>AI COACH · DAILY BRIEFING</div>
          <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.65}}>
            NVDA earnings catalyst sets up strong momentum conditions today. Your trade style (Day Trader + Options) aligns well with the 8:30 and 12:30 plays. VIX at 18.4 — moderate volatility, ideal for your risk profile. <span style={{color:C.yellow,fontWeight:700}}>Note:</span> You're at $123 of your $500 daily loss limit — stay disciplined.
          </p>
        </div>
      </div>
    </div>
  );
};

const PlaysView = () => {
  const [expanded, setExpanded] = useState(1);
  const [timeFilter, setTimeFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  let filtered = PLAYS;
  if(timeFilter!=="All") filtered=filtered.filter(p=>p.time===timeFilter);
  if(typeFilter!=="All") filtered=filtered.filter(p=>p.type===typeFilter);
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Today's Plays</h2>
          <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>Wed May 13 · {filtered.length} active · Tap any card to expand</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,padding:3,gap:2}}>
            {["All","8:30 AM","10:30 AM","12:30 PM"].map(t=>(
              <button key={t} onClick={()=>setTimeFilter(t)} style={{padding:"5px 11px",borderRadius:6,border:"none",background:timeFilter===t?C.accent:"transparent",color:timeFilter===t?C.bg:C.muted,fontWeight:700,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,padding:3,gap:2}}>
            {["All","Options","Stock"].map(t=>(
              <button key={t} onClick={()=>setTypeFilter(t)} style={{padding:"5px 11px",borderRadius:6,border:"none",background:typeFilter===t?C.purple:"transparent",color:typeFilter===t?C.bg:C.muted,fontWeight:700,fontSize:10,cursor:"pointer"}}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
        {[{time:"8:30 AM",label:"Market Open",status:"done",count:2},{time:"10:30 AM",label:"Mid-Morning",status:"live",count:1},{time:"12:30 PM",label:"Midday Reset",status:"soon",count:1}].map(slot=>(
          <div key={slot.time} onClick={()=>setTimeFilter(timeFilter===slot.time?"All":slot.time)} style={{background:C.card,border:`1px solid ${slot.status==="live"?C.green+"55":C.border}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:slot.status==="live"?C.green:slot.status==="done"?C.muted:C.yellow,boxShadow:slot.status==="live"?`0 0 8px ${C.green}`:"none",animation:slot.status==="live"?"pulse 2s infinite":"none",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:slot.status==="live"?C.green:C.text}}>{slot.time}</div>
              <div style={{fontSize:10,color:C.muted}}>{slot.label}</div>
            </div>
            <span style={{background:C.subtle,borderRadius:10,padding:"2px 7px",fontSize:11,color:C.textSoft,fontWeight:700}}>{slot.count}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(play=>(
          <PlayCard key={play.id} play={play} expanded={expanded===play.id} onToggle={()=>setExpanded(expanded===play.id?null:play.id)}/>
        ))}
      </div>
    </div>
  );
};

const WatchlistView = () => {
  const [alerts, setAlerts] = useState({AAPL:true,META:true});
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Watchlist</h2>
          <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>6 tracked tickers · 2 alerts active</div>
        </div>
        <button style={{padding:"8px 18px",background:C.accent,border:"none",borderRadius:8,color:C.bg,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Add Ticker</button>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:14}}>
        <div style={{fontSize:10,color:C.yellow,fontWeight:700,marginBottom:10,letterSpacing:"0.08em"}}>ACTIVE ALERTS</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{t:"AAPL",type:"Price",cond:"Breaks above $192.00",status:"active"},{t:"META",type:"News",cond:"Any major news release",status:"active"},{t:"NVDA",type:"Volume",cond:"Volume exceeds 3x avg",status:"triggered"},{t:"SPY",type:"Price",cond:"Drops below $508.00",status:"active"}].map(a=>(
            <div key={a.t} style={{display:"flex",alignItems:"center",gap:12}}>
              <Badge color={a.status==="triggered"?C.green:C.yellow}>{a.status}</Badge>
              <span style={{fontSize:12,fontWeight:700,color:C.text,minWidth:42}}>{a.t}</span>
              <span style={{fontSize:12,color:C.textSoft}}>{a.type}: {a.cond}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {WATCHLIST.map(s=>(
          <div key={s.ticker} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:C.text,flexShrink:0}}>{s.ticker}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,color:C.text,fontSize:14}}>{s.ticker}</div>
              <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}{s.note?` · ${s.note}`:""}</div>
            </div>
            <div style={{textAlign:"right",minWidth:86}}>
              <div style={{fontWeight:700,fontSize:15,color:C.text,fontFamily:"monospace"}}>${s.price}</div>
              <div style={{fontSize:11,color:s.up?C.green:C.red,fontWeight:600}}>{s.change} ({s.pct})</div>
            </div>
            <MiniChart data={PLAYS[s.up?0:2].chart} up={s.up} w={88} h={30}/>
            <button onClick={()=>setAlerts(a=>({...a,[s.ticker]:!a[s.ticker]}))} style={{padding:"5px 11px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,background:alerts[s.ticker]?C.yellow+"22":C.subtle,border:`1px solid ${alerts[s.ticker]?C.yellow+"55":C.border}`,color:alerts[s.ticker]?C.yellow:C.muted}}>🔔 {alerts[s.ticker]?"ON":"OFF"}</button>
            <button style={{padding:"5px 9px",borderRadius:6,background:C.subtle,border:`1px solid ${C.border}`,color:C.muted,fontSize:12,cursor:"pointer"}}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsView = () => {
  const [filter, setFilter] = useState("All");
  const cats=["All","Earnings","Analyst","Regulatory","Flow","Macro","Supply Chain"];
  const filtered=filter==="All"?NEWS:NEWS.filter(n=>n.category===filter);
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>News & Alerts</h2>
        <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>Real-time headlines · Unusual activity · Macro events</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===c?C.accent+"66":C.border}`,background:filter===c?C.accentDim:C.card,color:filter===c?C.accent:C.textSoft,fontWeight:filter===c?700:400,fontSize:11,cursor:"pointer"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((item,i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${item.impact==="HIGH"?(item.up?C.green:C.red)+"44":C.border}`,borderRadius:12,padding:"13px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.muted,whiteSpace:"nowrap",paddingTop:2,minWidth:54}}>{item.time}</div>
            <div style={{background:C.subtle,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:900,color:C.text,whiteSpace:"nowrap",alignSelf:"center"}}>{item.ticker}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:C.text,lineHeight:1.5,marginBottom:5}}>{item.headline}</div>
              <Badge color={C.muted}>{item.category}</Badge>
            </div>
            <Badge color={item.impact==="HIGH"?(item.up?C.green:C.red):item.impact==="MED"?C.yellow:C.muted} sm={false}>{item.impact}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioView = () => {
  const [connected, setConnected] = useState(false);
  return (
    <div>
      <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em",marginBottom:20}}>Portfolio & Brokerage</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatBox label="Total Value" value="$24,810" sub="+$412 today" color={C.green}/>
        <StatBox label="Day P&L" value="+$412" sub="+1.69%" color={C.green}/>
        <StatBox label="Win Rate (30d)" value="67%" sub="21 of 31 trades" color={C.accent}/>
        <StatBox label="Open Positions" value="3" sub="NVDA, SPY, AMD"/>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:11,color:C.textSoft,fontWeight:700,marginBottom:12,letterSpacing:"0.06em"}}>OPEN POSITIONS</div>
        {[{ticker:"NVDA",type:"875C 0DTE",qty:2,entry:"$12.40",curr:"$16.80",pnl:"+$880",pct:"+35.5%",up:true},{ticker:"SPY",type:"Stock Long",qty:10,entry:"$512.30",curr:"$513.90",pnl:"+$160",pct:"+0.31%",up:true},{ticker:"AMD",type:"165C 3D",qty:3,entry:"$3.20",curr:"$2.90",pnl:"-$90",pct:"-9.4%",up:false}].map(pos=>(
          <div key={pos.ticker} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:36,height:36,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.text}}>{pos.ticker}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{pos.ticker}</div>
              <div style={{fontSize:10,color:C.muted}}>{pos.type} · Qty: {pos.qty}</div>
            </div>
            <div style={{textAlign:"right",marginRight:4}}>
              <div style={{fontSize:11,color:C.muted}}>Entry: {pos.entry}</div>
              <div style={{fontSize:11,color:C.text}}>Now: {pos.curr}</div>
            </div>
            <div style={{textAlign:"right",minWidth:76}}>
              <div style={{fontSize:14,fontWeight:700,color:pos.up?C.green:C.red,fontFamily:"monospace"}}>{pos.pnl}</div>
              <div style={{fontSize:11,color:pos.up?C.green:C.red}}>{pos.pct}</div>
            </div>
          </div>
        ))}
      </div>
      {!connected?(
        <div style={{background:C.card,border:`2px dashed ${C.borderHi}`,borderRadius:12,padding:"26px 22px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:10}}>🔗</div>
          <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6}}>Connect Your Brokerage</div>
          <p style={{margin:"0 auto 18px",fontSize:13,color:C.muted,maxWidth:440,lineHeight:1.6}}>Link your account and PulseAI will analyze your real positions, flag risk concentration, and personalize every play recommendation to what you actually hold.</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["Robinhood","TD Ameritrade","Webull","Schwab","E*TRADE","Interactive Brokers"].map(b=>(
              <button key={b} onClick={()=>setConnected(true)} style={{padding:"8px 14px",background:C.subtle,border:`1px solid ${C.borderHi}`,borderRadius:8,color:C.text,fontWeight:600,fontSize:12,cursor:"pointer"}}>{b}</button>
            ))}
          </div>
        </div>
      ):(
        <div style={{background:C.greenDim,border:`1px solid ${C.green}44`,borderRadius:12,padding:"16px 18px",display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:22}}>✅</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:C.green,fontSize:14}}>Brokerage Connected</div>
            <div style={{fontSize:12,color:C.textSoft}}>PulseAI is syncing your positions and tailoring all recommendations to your portfolio.</div>
          </div>
          <button onClick={()=>setConnected(false)} style={{padding:"6px 12px",background:C.subtle,border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontSize:11,cursor:"pointer"}}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

const JournalView = () => {
  const wins=TRADES_LOG.filter(t=>t.win).length;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Trade Journal</h2>
          <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>Track every trade. Learn from every outcome.</div>
        </div>
        <button style={{padding:"8px 18px",background:C.green,border:"none",borderRadius:8,color:C.bg,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Log Trade</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        <StatBox label="Total Logged" value={TRADES_LOG.length} sub="last 7 days"/>
        <StatBox label="Win Rate" value={`${Math.round((wins/TRADES_LOG.length)*100)}%`} sub={`${wins} wins · ${TRADES_LOG.length-wins} losses`} color={C.green}/>
        <StatBox label="Net P&L" value="+$1,770" sub="logged trades" color={C.green}/>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"88px 66px 76px 88px 88px 1fr 80px",padding:"10px 18px",borderBottom:`1px solid ${C.border}`,background:C.surface}}>
          {["DATE","TICKER","TYPE","ENTRY","EXIT","P&L","RESULT"].map(h=>(
            <div key={h} style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:"0.1em"}}>{h}</div>
          ))}
        </div>
        {TRADES_LOG.map((t,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"88px 66px 76px 88px 88px 1fr 80px",padding:"11px 18px",borderBottom:i<TRADES_LOG.length-1?`1px solid ${C.border}`:"none",background:i%2===0?"transparent":C.subtle+"22"}}>
            <div style={{fontSize:11,color:C.muted}}>{t.date}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>{t.ticker}</div>
            <div><Badge color={t.type==="PUT"?C.red:t.type==="LONG"?C.accent:C.green}>{t.type}</Badge></div>
            <div style={{fontSize:12,fontFamily:"monospace",color:C.textSoft}}>{t.entry}</div>
            <div style={{fontSize:12,fontFamily:"monospace",color:C.textSoft}}>{t.exit}</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:t.win?C.green:C.red}}>{t.pnl} <span style={{fontSize:11,fontWeight:400}}>({t.pct})</span></div>
            <div><Badge color={t.win?C.green:C.red}>{t.win?"WIN":"LOSS"}</Badge></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectorsView = () => {
  const sectors=[
    {name:"Technology",icon:"💻",tickers:"NVDA, AAPL, AMD, MSFT"},
    {name:"Healthcare",icon:"💊",tickers:"UNH, JNJ, PFE"},
    {name:"Financials",icon:"🏦",tickers:"JPM, BAC, GS"},
    {name:"Energy",icon:"⚡",tickers:"XOM, CVX, OXY"},
    {name:"Consumer",icon:"🛒",tickers:"AMZN, WMT, COST"},
    {name:"Industrials",icon:"🏗",tickers:"CAT, BA, HON"},
    {name:"Crypto",icon:"₿",tickers:"COIN, MSTR, IBIT"},
    {name:"ETFs / Index",icon:"📊",tickers:"SPY, QQQ, IWM"},
    {name:"EV / Auto",icon:"🚗",tickers:"TSLA, GM, RIVN"},
    {name:"Biotech",icon:"🧬",tickers:"MRNA, BIIB, REGN"},
    {name:"Real Estate",icon:"🏠",tickers:"VNQ, AMT, CBRE"},
    {name:"Commodities",icon:"🥇",tickers:"GLD, SLV, USO"},
  ];
  const [selected, setSelected] = useState(["Technology","ETFs / Index","EV / Auto"]);
  const toggle=s=>setSelected(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Sector Filters</h2>
        <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>{selected.length} sectors active · Plays and alerts filtered to your selection</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {sectors.map(s=>(
          <div key={s.name} onClick={()=>toggle(s.name)} style={{background:selected.includes(s.name)?C.accentDim:C.card,border:`1px solid ${selected.includes(s.name)?C.accent+"66":C.border}`,borderRadius:10,padding:"13px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all 0.15s"}}>
            <span style={{fontSize:18}}>{s.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:selected.includes(s.name)?700:500,color:selected.includes(s.name)?C.accent:C.text}}>{s.name}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.tickers}</div>
            </div>
            {selected.includes(s.name)&&<span style={{color:C.accent,fontSize:14}}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const ScreenerView = () => {
  const results=[
    {ticker:"PLTR",signal:"Breakout",strength:92,price:"$24.10",vol:"3.8x",sector:"Tech",up:true},
    {ticker:"MSTR",signal:"BTC Sympathy",strength:85,price:"$1,640",vol:"2.1x",sector:"Crypto",up:true},
    {ticker:"SMCI",signal:"Gap Fill",strength:78,price:"$44.20",vol:"4.2x",sector:"Tech",up:false},
    {ticker:"GME",signal:"Unusual Volume",strength:74,price:"$18.80",vol:"6.7x",sector:"Consumer",up:true},
    {ticker:"RIVN",signal:"Oversold Bounce",strength:70,price:"$9.44",vol:"1.9x",sector:"EV",up:true},
  ];
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>AI Screener</h2>
        <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>AI-detected setups beyond today's featured plays</div>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
        {["All Signals","Breakouts","Unusual Volume","Gap Plays","Oversold","Sympathy"].map(f=>(
          <button key={f} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${C.border}`,background:C.card,color:C.textSoft,fontSize:11,cursor:"pointer"}}>{f}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {results.map(r=>(
          <div key={r.ticker} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:C.text}}>{r.ticker}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{r.ticker} <span style={{fontSize:11,color:C.textSoft,fontWeight:400}}>· {r.sector}</span></div>
              <div style={{fontSize:12,color:C.accent,marginTop:2}}>{r.signal}</div>
            </div>
            <div style={{width:120}}>
              <div style={{fontSize:9,color:C.muted,marginBottom:3,letterSpacing:"0.1em"}}>SIGNAL STRENGTH</div>
              <ConfBar value={r.strength}/>
            </div>
            <MiniChart data={PLAYS[r.up?0:2].chart} up={r.up} w={80} h={30}/>
            <div style={{textAlign:"right",minWidth:70}}>
              <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:C.text}}>{r.price}</div>
              <div style={{fontSize:11,color:C.yellow}}>Vol {r.vol}</div>
            </div>
            <button style={{padding:"7px 14px",background:C.accentDim,border:`1px solid ${C.accent}44`,borderRadius:8,color:C.accent,fontWeight:700,fontSize:12,cursor:"pointer"}}>View →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GoalsView = () => {
  const [styles, setStyles] = useState(["Day Trader","Scalper","Options"]);
  const allStyles=["Day Trader","Swing Trader","Scalper","Options","Long-term","Growth","Momentum"];
  const toggle=s=>setStyles(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const [risk, setRisk] = useState("Moderate");
  return (
    <div>
      <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em",marginBottom:20}}>Goals & Tracking</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
        {[{label:"Monthly Income Goal",target:"$1,000",current:"$672",pct:67,color:C.green},{label:"Win Rate Target",target:"70%",current:"67%",pct:96,color:C.accent},{label:"Max Daily Loss Limit",target:"$500",current:"$123 used",pct:25,color:C.yellow},{label:"Monthly Trade Count",target:"40",current:"28",pct:70,color:C.purple}].map(goal=>(
          <div key={goal.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontWeight:700,color:C.text,fontSize:13}}>{goal.label}</div>
              <div style={{fontSize:12,color:C.muted}}>{goal.current} / {goal.target}</div>
            </div>
            <div style={{height:5,background:C.subtle,borderRadius:3,overflow:"hidden",marginBottom:5}}>
              <div style={{width:`${goal.pct}%`,height:"100%",background:goal.color,borderRadius:3}}/>
            </div>
            <div style={{fontSize:10,color:C.muted}}>{goal.pct}% complete</div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px",marginBottom:12}}>
        <div style={{fontWeight:700,color:C.text,marginBottom:4,fontSize:14}}>Trade Style Profile</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Recommendations and plays are tailored to your selected styles</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {allStyles.map(s=>(
            <div key={s} onClick={()=>toggle(s)} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",background:styles.includes(s)?C.purpleDim:C.subtle,border:`1px solid ${styles.includes(s)?C.purple+"55":C.border}`,color:styles.includes(s)?C.purple:C.muted,fontWeight:styles.includes(s)?700:400,fontSize:12}}>{s}</div>
          ))}
        </div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px"}}>
        <div style={{fontWeight:700,color:C.text,marginBottom:12,fontSize:14}}>Risk Tolerance</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{l:"Conservative",c:C.green},{l:"Moderate",c:C.yellow},{l:"Aggressive",c:C.red}].map(r=>(
            <div key={r.l} onClick={()=>setRisk(r.l)} style={{background:risk===r.l?r.c+"18":C.subtle,border:`1px solid ${risk===r.l?r.c+"55":C.border}`,borderRadius:8,padding:"10px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{fontSize:13,fontWeight:risk===r.l?700:400,color:risk===r.l?r.c:C.muted}}>{r.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EducationView = () => {
  const lessons=[
    {title:"Understanding 0DTE Options",category:"Options",duration:"8 min",level:"Beginner",done:true},
    {title:"How to Read VWAP on Intraday Charts",category:"Technicals",duration:"12 min",level:"Beginner",done:true},
    {title:"Dark Pool Prints & Unusual Options Flow",category:"Flow Analysis",duration:"15 min",level:"Intermediate",done:false},
    {title:"Managing Risk with Stop Losses",category:"Risk",duration:"10 min",level:"Beginner",done:false},
    {title:"MACD & RSI: When to Use Each",category:"Technicals",duration:"14 min",level:"Intermediate",done:false},
    {title:"Pre-Market Routine for Day Traders",category:"Strategy",duration:"9 min",level:"All Levels",done:false},
    {title:"Reading the Options Chain",category:"Options",duration:"18 min",level:"Intermediate",done:false},
    {title:"Understanding IV Crush After Earnings",category:"Options",duration:"11 min",level:"Advanced",done:false},
  ];
  const lc=l=>l==="Beginner"?C.green:l==="Intermediate"?C.yellow:l==="Advanced"?C.red:C.accent;
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em"}}>Learn</h2>
        <div style={{fontSize:12,color:C.textSoft,marginTop:4}}>Bite-sized lessons tailored to your trade style · 2 of 8 completed</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {lessons.map(l=>(
          <div key={l.title} style={{background:C.card,border:`1px solid ${l.done?C.green+"44":C.border}`,borderRadius:12,padding:"15px 17px",display:"flex",gap:13,alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:8,background:l.done?C.greenDim:C.subtle,border:`1px solid ${l.done?C.green+"44":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,color:l.done?C.green:C.textSoft}}>
              {l.done?"✓":"▶"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:l.done?C.textSoft:C.text,marginBottom:6}}>{l.title}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <Badge color={C.muted}>{l.category}</Badge>
                <Badge color={lc(l.level)}>{l.level}</Badge>
                <span style={{fontSize:10,color:C.muted}}>{l.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = () => {
  const [toggles, setToggles] = useState({n0:true,n1:true,n2:true,n3:false,n4:true,a0:false,a1:true,a2:true,d0:true,d1:true,d2:false});
  const tog=k=>setToggles(t=>({...t,[k]:!t[k]}));
  const groups=[
    {section:"Notifications",items:[{k:"n0",label:"Push alerts at 8:30, 10:30 & 12:30 for new plays"},{k:"n1",label:"Breaking news on watchlist tickers"},{k:"n2",label:"Unusual options flow alerts"},{k:"n3",label:"Daily P&L summary at market close"},{k:"n4",label:"AI Coach morning briefing"}]},
    {section:"Account",items:[{k:"a0",label:"Email digest (weekly)"},{k:"a1",label:"SMS alerts for HIGH impact news"},{k:"a2",label:"Two-factor authentication"}]},
    {section:"Display",items:[{k:"d0",label:"Show pre-market data"},{k:"d1",label:"Show after-hours data"},{k:"d2",label:"Compact play cards"}]},
  ];
  return (
    <div>
      <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-0.03em",marginBottom:20}}>Settings</h2>
      {groups.map(group=>(
        <div key={group.section} style={{marginBottom:18}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:"0.1em",marginBottom:10}}>{group.section.toUpperCase()}</div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            {group.items.map((item,i)=>(
              <div key={item.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 18px",borderBottom:i<group.items.length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:13,color:C.text}}>{item.label}</span>
                <div onClick={()=>tog(item.k)} style={{width:40,height:21,borderRadius:11,background:toggles[item.k]?C.green:C.subtle,cursor:"pointer",position:"relative",transition:"background 0.2s",border:`1px solid ${toggles[item.k]?C.green:C.borderHi}`,flexShrink:0}}>
                  <div style={{position:"absolute",top:3,left:toggles[item.k]?19:3,width:13,height:13,borderRadius:"50%",background:toggles[item.k]?C.bg:C.muted,transition:"left 0.2s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{background:`linear-gradient(135deg,${C.accent}12,${C.purple}10)`,border:`1px solid ${C.accent}33`,borderRadius:12,padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.accent,marginBottom:4}}>PulseAI Pro · Free Trial</div>
            <div style={{fontSize:13,color:C.textSoft}}>Your trial ends in <strong style={{color:C.yellow}}>27 days</strong>. Then just $2.99/month.</div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>Cancel anytime. No commitment required.</div>
          </div>
          <button style={{padding:"9px 18px",background:`linear-gradient(135deg,${C.accent},${C.purple})`,border:"none",borderRadius:8,color:C.bg,fontWeight:700,fontSize:13,cursor:"pointer"}}>Manage Subscription</button>
        </div>
      </div>
    </div>
  );
};

const TrialModal = ({onClose}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.surface,border:`1px solid ${C.accent}44`,borderRadius:18,maxWidth:520,width:"100%",overflow:"hidden",boxShadow:`0 0 80px ${C.accent}18`}}>
      <div style={{background:`linear-gradient(135deg,${C.accent}18,${C.purple}12)`,padding:"30px 30px 24px",textAlign:"center",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:38,marginBottom:10}}>⚡</div>
        <h2 style={{margin:"0 0 8px",fontSize:28,fontWeight:900,color:C.text,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.03em"}}>Start Your Free Month</h2>
        <p style={{margin:0,color:C.textSoft,fontSize:14,lineHeight:1.6}}>30 days completely free. Then just $2.99/month —<br/>less than a cup of coffee.</p>
        <div style={{marginTop:14,display:"inline-flex",alignItems:"baseline",gap:6}}>
          <span style={{fontSize:40,fontWeight:900,color:C.accent,fontFamily:"monospace",lineHeight:1}}>$0</span>
          <span style={{fontSize:13,color:C.muted}}>for 30 days, then $2.99/mo</span>
        </div>
      </div>
      <div style={{padding:"22px 28px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:20}}>
          {["⚡ Daily plays at 8:30, 10:30 & 12:30","🤖 Full AI reasoning on every call","📡 Real-time news & unusual flow alerts","💼 Brokerage sync & portfolio analysis","🗂 Sector & trade-style filters","🎯 Goal tracking & risk management","🔍 AI screener for bonus setups","📓 Trade journal with win-rate stats","🎓 Built-in trading education","🔔 Instant push alerts on your tickers","📊 Pre-market & after-hours data","✅ Cancel anytime, no commitment"].map(f=>(
            <div key={f} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
              <span style={{fontSize:12,flexShrink:0,marginTop:1}}>{f.slice(0,2)}</span>
              <span style={{fontSize:12,color:C.textSoft,lineHeight:1.4}}>{f.slice(2)}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:C.bg,fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.02em"}}>
          Start My Free 30-Day Trial →
        </button>
        <div style={{textAlign:"center",marginTop:9,fontSize:11,color:C.muted}}>No credit card required · Cancel anytime · Instant access</div>
      </div>
    </div>
  </div>
);

const VIEWS = {
  dashboard:DashboardView, plays:PlaysView, watchlist:WatchlistView,
  news:NewsView, portfolio:PortfolioView, journal:JournalView,
  sectors:SectorsView, screener:ScreenerView, goals:GoalsView,
  education:EducationView, settings:SettingsView,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [time, setTime] = useState(new Date());
  const [showTrial, setShowTrial] = useState(true);
  const trialDays = 27;

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const View = VIEWS[active];
  const marketOpen = time.getHours() >= 9 && time.getHours() < 16;

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:C.text,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1c2535;border-radius:2px;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
        h2{font-family:'Syne',sans-serif;}
        button,input{font-family:inherit;}
        button:hover{opacity:0.9;}
      `}</style>
      {showTrial && <TrialModal onClose={() => setShowTrial(false)} />}
      <Sidebar active={active} setActive={setActive} trialDays={trialDays} />
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <TopBar time={time} marketOpen={marketOpen} />
        <div style={{flex:1,overflow:"auto",padding:"24px 28px"}}>
          <View setActive={setActive} />
        </div>
      </div>
    </div>
  );
}
