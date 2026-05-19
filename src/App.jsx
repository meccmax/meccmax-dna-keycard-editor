import { useState, useRef } from "react";

const TIERS = ["yellow","green","blue","purple","red","orange"];
const TC = { yellow:"#FFD700", green:"#39FF14", blue:"#00BFFF", purple:"#BF5FFF", red:"#FF3333", orange:"#FF8C00" };
const TG = { yellow:"#FFD70033", green:"#39FF1433", blue:"#00BFFF33", purple:"#BF5FFF33", red:"#FF333333", orange:"#FF8C0033" };
const TB = { yellow:"#0e0b00", green:"#000e00", blue:"#000810", purple:"#080010", red:"#0e0000", orange:"#0e0400" };
const MAIN_TIERS = TIERS.filter(t=>t!=="orange");
const WEAPON_ATT = ["dna_Magazine","dna_Ammunition","dna_OpticType","dna_Suppressor","dna_UnderBarrel","dna_ButtStock","dna_HandGuard","dna_Wrap"];
const CLOTHING_SLOTS = ["dna_Helm","dna_Shirt","dna_Vest","dna_Pants","dna_Shoes","dna_Backpack","dna_Gloves","dna_Belt","dna_Facewear","dna_Eyewear","dna_Armband","dna_NVG"];
const GEN_CATS = ["medical","food","drink","tools","materials","misc","proprietary","valuables"];
const capT = t => t[0].toUpperCase()+t.slice(1);

const inp = (c="#ccc") => ({ background:"#0a0a0a", border:"1px solid #222", borderRadius:5, color:c, padding:"6px 9px", fontFamily:"monospace", fontSize:12, width:"100%", boxSizing:"border-box" });
const card = (t) => ({ background: t?TB[t]+"dd":"#111", border:`1px solid ${t?TC[t]+"33":"#1e1e1e"}`, borderRadius:8, padding:14, marginBottom:10 });
const lbl = { fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", fontFamily:"monospace", display:"block", marginBottom:3 };
const btn = (bg,c,b) => ({ background:bg, border:`1px solid ${b}`, color:c, borderRadius:5, padding:"7px 13px", cursor:"pointer", fontFamily:"monospace", fontSize:11, letterSpacing:.8 });
const g2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 };
const g3 = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 };
const g4 = { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 };

// ─── Tiny components ──────────────────────────────────────────────────────────
function TierBtn({t,active,onClick}) {
  return <button onClick={onClick} style={{ background:active?TB[t]:"transparent", border:`1.5px solid ${active?TC[t]:"#2a2a2a"}`, borderRadius:7, padding:"7px 15px", cursor:"pointer", color:active?TC[t]:"#555", fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:11, letterSpacing:2, boxShadow:active?`0 0 10px ${TG[t]}`:"none", transition:"all .2s", display:"flex", alignItems:"center", gap:7 }}>
    <span style={{width:7,height:7,borderRadius:"50%",background:TC[t],boxShadow:`0 0 4px ${TC[t]}`,flexShrink:0}}/>{t.toUpperCase()}
  </button>;
}
function Fld({label,value,onChange,type="text",min,max,placeholder,col}) {
  function handleChange(e) {
    if (type === "number") {
      let v = e.target.value === "" ? "" : +e.target.value;
      if (v !== "" && min !== undefined && v < min) v = min;
      if (v !== "" && max !== undefined && v > max) v = max;
      onChange(v === "" ? 0 : v);
    } else {
      onChange(e.target.value);
    }
  }
  return <div><span style={lbl}>{label}</span><input type={type} min={min} max={max} value={value} placeholder={placeholder} onChange={handleChange} style={inp(col||"#ccc")}/></div>;
}
function Tog({label,value,onChange,hint}) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0"}}>
    <div><div style={{fontSize:12,color:"#aaa",fontFamily:"monospace"}}>{label}</div>{hint&&<div style={{fontSize:10,color:"#444"}}>{hint}</div>}</div>
    <button onClick={()=>onChange(!value)} style={{width:38,height:20,borderRadius:10,background:value?"#003300":"#1a1a1a",border:`1.5px solid ${value?"#39FF14":"#333"}`,cursor:"pointer",position:"relative",flexShrink:0,boxShadow:value?"0 0 7px #39FF1466":"none",transition:"all .2s"}}>
      <span style={{position:"absolute",top:1,left:value?18:1,width:14,height:14,borderRadius:"50%",background:value?"#39FF14":"#444",transition:"left .18s"}}/>
    </button>
  </div>;
}
function ACIn({value,onChange,sug,placeholder,style:sx}) {
  const [open,setOpen]=useState(false);
  const filt = value&&value.length>1 ? sug.filter(s=>s.toLowerCase().includes(value.toLowerCase())).slice(0,10) : [];
  return <div style={{position:"relative"}}>
    <input value={value||""} placeholder={placeholder||"classname..."} onChange={e=>{onChange(e.target.value);setOpen(true);}} onBlur={()=>setTimeout(()=>setOpen(false),150)} style={{...inp(),...sx}}/>
    {open&&filt.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#141414",border:"1px solid #222",borderRadius:5,maxHeight:150,overflowY:"auto"}}>
      {filt.map(s=><div key={s} onMouseDown={()=>{onChange(s);setOpen(false);}} style={{padding:"5px 9px",cursor:"pointer",fontSize:11,color:"#bbb",borderBottom:"1px solid #1a1a1a"}} onMouseEnter={e=>e.currentTarget.style.background="#222"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{s}</div>)}
    </div>}
  </div>;
}

// ─── Default state ────────────────────────────────────────────────────────────
function mkState() {
  return {
    weapons: [],
    clothing: [],
    general: [],
    smolConfig: {
      dna_UseConfig:1,
      perTier: Object.fromEntries(MAIN_TIERS.map(t=>[t,{
        dna_SpawnMainWeapons:1, dna_RandomizeWeapons:1, dna_WeaponCount:1, weapons:[],
        dna_SpawnLootSet1:1, dna_RandomizeLootSet1:1, dna_LootSet1Count:3, lootSet1:[],
        dna_SpawnLootSet2:1, dna_RandomizeLootSet2:1, dna_LootSet2Count:3, lootSet2:[],
        dna_SpawnLootSet3:1, dna_RandomizeLootSet3:1, dna_LootSet3Count:3, lootSet3:[],
        dna_SpawnLootSet4:1, dna_RandomizeLootSet4:0, dna_LootSet4Count:3, lootSet4:[],
      }]))
    },
    mainSys: {
      spawnCrates:0, spawnSR:0,
      crateCounts: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      srCounts: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      cardUses: Object.fromEntries(MAIN_TIERS.map(t=>[t,2])),
      sepSidearms:0, sepFoodDrink:0, sepTools:0, sepMeds:0, sepMats:0, sepMisc:1,
      srWolves: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      srBears: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      srInfected: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      srAlarm: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      srRange: Object.fromEntries(MAIN_TIERS.map(t=>[t,0])),
      crateAlarm: Object.fromEntries(MAIN_TIERS.map(t=>[t,1])),
      crateRange: Object.fromEntries(MAIN_TIERS.map(t=>[t,2001])),
      lockAlarm: Object.fromEntries(MAIN_TIERS.map(t=>[t,1])),
      lockRange: Object.fromEntries(MAIN_TIERS.map(t=>[t,2001])),
      crateLocs: Object.fromEntries(MAIN_TIERS.map(t=>[t,[{l:"0.0 0.0 0.0",r:"0.0 0.0 0.0"}]])),
      srLocs: Object.fromEntries(MAIN_TIERS.map(t=>[t,[{l:"0.0 0.0 0.0",r:"0.0 0.0 0.0"}]])),
    },
    containers: (() => {
      const base=[1,1,1,1,2,1,3,1,1,1,1,2,1,3,1,1,1,3,1,1,1,3,2,3,2,3,2,3,2,3,2,3,2,3,0,2,3,2,3,2,3,2,3,2,3];
      return MAIN_TIERS.flatMap(tier=>base.map((v,i)=>({tier,idx:i,crate:v,sr:v})));
    })(),
    mobs: [
      {id:crypto.randomUUID(),dna_DefaultMob:"wolf",dna_MobType:"Animal_CanisLupus_Grey"},
      {id:crypto.randomUUID(),dna_DefaultMob:"wolf",dna_MobType:"Animal_CanisLupus_White"},
      {id:crypto.randomUUID(),dna_DefaultMob:"bear",dna_MobType:"Animal_UrsusArctos"},
      {id:crypto.randomUUID(),dna_DefaultMob:"infected",dna_MobType:"ZmbM_CitizenASkinny_Brown"},
      ...["bossYellow","bossGreen","bossBlue","bossPurple","bossRed"].map(b=>({id:crypto.randomUUID(),dna_DefaultMob:b,dna_MobType:""})),
    ],
    resetTimer: {
      use:0, interval:5, dist:500,
      resetCrates:0, crateTimes: Object.fromEntries(MAIN_TIERS.map(t=>[t,30])),
      resetSR:0, srTimes: Object.fromEntries(MAIN_TIERS.map(t=>[t,30])),
      resetLock:0, lockTimes: Object.fromEntries(TIERS.map(t=>[t,30])),
      resetOW:0, owTimes: Object.fromEntries(TIERS.map(t=>[t,30])),
      resetWarp:0, warpTimes: Object.fromEntries(TIERS.map(t=>[t,30])),
    },
    smolSys: {
      spawn:0, reset:0,
      times: Object.fromEntries(MAIN_TIERS.map(t=>[t,30])),
      locs: [{tier:"Yellow",l:"0.0 0.0 0.0",r:"0.0 0.0 0.0"}],
    },
    doorAlarms: Object.fromEntries(TIERS.flatMap(t=>[[t+"lockA",0],[t+"lockR",0],[t+"owA",0],[t+"owR",0],[t+"warpA",0],[t+"warpR",0]])),
  };
}

// ─── JSON IMPORTERS ───────────────────────────────────────────────────────────
function importWeapons(json, prev) {
  const arr = json.m_DNAConfig_Weapons || [];
  return arr.map(w => ({ ...w, id: crypto.randomUUID() }));
}
function importClothing(json, prev) {
  const arr = json.m_DNAConfig_Clothing || [];
  return arr.map(c => ({ ...c, id: crypto.randomUUID() }));
}
function importGeneral(json, prev) {
  const arr = json.m_DNAConfig_Loot || [];
  return arr.map(i => ({ ...i, id: crypto.randomUUID() }));
}
function importSmolActivation(json, prev) {
  return { ...prev, dna_UseConfig: json.dna_UseConfig ?? 1 };
}
function importSmolTier(json, tier, prevSmol) {
  const cT = capT(tier);
  const wKey = `weaponTypes${cT}`;
  const td = prevSmol.perTier[tier] || {};
  const newTd = {
    dna_SpawnMainWeapons: json.dna_SpawnMainWeapons ?? 1,
    dna_RandomizeWeapons: json.dna_RandomizeWeapons ?? 1,
    dna_WeaponCount: json.dna_WeaponCount ?? 1,
    weapons: (json[wKey] || []),
    dna_SpawnLootSet1: json.dna_SpawnLootSet1 ?? 1, dna_RandomizeLootSet1: json.dna_RandomizeLootSet1 ?? 1, dna_LootSet1Count: json.dna_LootSet1Count ?? 3,
    lootSet1: json[`dna_LootSet${cT}1`] || [],
    dna_SpawnLootSet2: json.dna_SpawnLootSet2 ?? 1, dna_RandomizeLootSet2: json.dna_RandomizeLootSet2 ?? 1, dna_LootSet2Count: json.dna_LootSet2Count ?? 3,
    lootSet2: json[`dna_LootSet${cT}2`] || [],
    dna_SpawnLootSet3: json.dna_SpawnLootSet3 ?? 1, dna_RandomizeLootSet3: json.dna_RandomizeLootSet3 ?? 1, dna_LootSet3Count: json.dna_LootSet3Count ?? 3,
    lootSet3: json[`dna_LootSet${cT}3`] || [],
    dna_SpawnLootSet4: json.dna_SpawnLootSet4 ?? 1, dna_RandomizeLootSet4: json.dna_RandomizeLootSet4 ?? 0, dna_LootSet4Count: json.dna_LootSet4Count ?? 3,
    lootSet4: json[`dna_LootSet${cT}4`] || [],
  };
  return { ...prevSmol, perTier: { ...prevSmol.perTier, [tier]: newTd } };
}
function importMainSys(json, prev) {
  const arr = json.m_DNAConfig_Main_System || [];
  const get = i => arr[i]?.dna_Setting ?? 0;
  const ms = {
    spawnCrates: get(0), spawnSR: get(1),
    crateCounts: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(2+i)])),
    srCounts: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(7+i)])),
    cardUses: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(12+i)])),
    sepSidearms:get(17), sepFoodDrink:get(18), sepTools:get(19), sepMeds:get(20), sepMats:get(21), sepMisc:get(22),
    srWolves: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(23+i*5)])),
    srBears:  Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(24+i*5)])),
    srInfected: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(25+i*5)])),
    srAlarm: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(26+i*5)])),
    srRange: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(27+i*5)])),
    crateAlarm: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(48+i*2)])),
    crateRange: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(49+i*2)])),
    lockAlarm: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(58+i*2)])),
    lockRange: Object.fromEntries(MAIN_TIERS.map((t,i)=>[t,get(59+i*2)])),
    crateLocs: Object.fromEntries(MAIN_TIERS.map(t=>{
      const key = `m_DNA${capT(t)}_Crate_Locations`;
      return [t, (json[key]||[{dna_Location:"0.0 0.0 0.0",dna_Rotation:"0.0 0.0 0.0"}]).map(x=>({l:x.dna_Location,r:x.dna_Rotation}))];
    })),
    srLocs: Object.fromEntries(MAIN_TIERS.map(t=>{
      const key = `m_DNA${capT(t)}_Strongroom_Locations`;
      return [t, (json[key]||[{dna_Location:"0.0 0.0 0.0",dna_Rotation:"0.0 0.0 0.0"}]).map(x=>({l:x.dna_Location,r:x.dna_Rotation}))];
    })),
  };
  return ms;
}
function importContainers(json) {
  const arr = json.m_DNAConfig_Container_System || [];
  if (arr.length === 0) return null;
  // 45 settings per tier
  return MAIN_TIERS.flatMap((tier, ti) =>
    Array.from({length:45},(_,i)=>{
      const entry = arr[ti*45+i] || {};
      return { tier, idx:i, crate: entry.dna_CrateSetting??0, sr: entry.dna_StrongroomSetting??0 };
    })
  );
}
function importMobs(json) {
  return (json.m_DNAConfig_Mob_System || []).map(m=>({...m, id:crypto.randomUUID()}));
}
function importResetTimer(json) {
  return {
    use: json.dna_UseResetTimer??0,
    interval: json.dna_TimeBetweenChecks??5,
    dist: json.dna_Min_Distance_Between_Nearest_Player??500,
    resetCrates: json.dna_ResetCrates??0,
    crateTimes: Object.fromEntries(MAIN_TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}CrateResets`]??30])),
    resetSR: json.dna_ResetStrongrooms??0,
    srTimes: Object.fromEntries(MAIN_TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}SRoomResets`]??30])),
    resetLock: json.dna_ResetLockouts??0,
    lockTimes: Object.fromEntries(TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}LockoutResets`]??30])),
    resetOW: json.dna_ResetOneWayDoors??0,
    owTimes: Object.fromEntries(TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}OWDoorResets`]??30])),
    resetWarp: json.dna_ResetWarpDoors??0,
    warpTimes: Object.fromEntries(TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}WarpDoorResets`]??30])),
  };
}
function importSmolSys(json) {
  return {
    spawn: json.dna_SpawnSmolCrates??0,
    reset: json.dna_ResetSmolCrates??0,
    times: Object.fromEntries(MAIN_TIERS.map(t=>[t,json[`dna_TimeUntil${capT(t)}SmolCrateResets`]??30])),
    locs: (json.dna_CrateSpawns||[]).map(l=>({tier:l.dna_Tier,l:l.dna_Location,r:l.dna_Rotation})),
  };
}
function importDoorAlarms(json) {
  const out = {};
  TIERS.forEach(t=>{
    out[t+"lockA"] = json[`dna_SoundAlarm${capT(t)}Lockout`]??0;
    out[t+"lockR"] = json[`dna_NotificationRange${capT(t)}Lockout`]??0;
    out[t+"owA"]   = json[`dna_SoundAlarm${capT(t)}OneWay`]??0;
    out[t+"owR"]   = json[`dna_NotificationRange${capT(t)}OneWay`]??0;
    out[t+"warpA"] = json[`dna_SoundAlarm${capT(t)}Warp`]??0;
    out[t+"warpR"] = json[`dna_NotificationRange${capT(t)}Warp`]??0;
  });
  return out;
}

// Detect which file a JSON belongs to by its keys
function detectFileType(json) {
  if (json.m_DNAConfig_Weapons) return "weapons";
  if (json.m_DNAConfig_Clothing) return "clothing";
  if (json.m_DNAConfig_Loot) return "general";
  if (json.dna_UseConfig !== undefined && json.dna_ConfigDescription !== undefined) return "smolActivation";
  if (json.dna_SpawnMainWeapons !== undefined) {
    // detect tier from weapon key
    for (const t of MAIN_TIERS) { if (json[`weaponTypes${capT(t)}`]) return `smol_${t}`; }
    return "smol_yellow";
  }
  if (json.m_DNAConfig_Main_System) return "mainSys";
  if (json.m_DNAConfig_Container_System) return "containers";
  if (json.m_DNAConfig_Mob_System) return "mobs";
  if (json.dna_UseResetTimer !== undefined) return "resetTimer";
  if (json.dna_SpawnSmolCrates !== undefined) return "smolSys";
  if (json.dna_SoundAlarmYellowLockout !== undefined || json.dna_SoundAlarmOrangeLockout !== undefined) return "doorAlarms";
  return "unknown";
}

// ─── JSON VALIDATOR ───────────────────────────────────────────────────────────
function validateFiles(files) {
  const issues = [];
  const warn = (file, msg) => issues.push({ file, msg, level:"warn" });
  const err  = (file, msg) => issues.push({ file, msg, level:"error" });

  // Weapons
  const wf = "Loot/Weapons/KeyCard_Weapons_Config.json";
  const weps = files[wf]?.m_DNAConfig_Weapons || [];
  weps.forEach((w,i) => {
    if (!w.dna_TheChosenOne) err(wf, `Entry #${i+1}: dna_TheChosenOne is empty`);
    if (!w.dna_Ammunition && !w.dna_Magazine) warn(wf, `Entry #${i+1} (${w.dna_TheChosenOne||"?"}): no ammunition or magazine set`);
    if (!w.dna_WeaponCategory) err(wf, `Entry #${i+1}: missing dna_WeaponCategory`);
    if (!w.dna_Tier) err(wf, `Entry #${i+1}: missing dna_Tier`);
  });
  if (weps.length === 0) warn(wf, "No weapon entries — crates will spawn with no weapons");

  // Clothing
  const cf = "Loot/Clothing/KeyCard_Clothing_Config.json";
  const clothes = files[cf]?.m_DNAConfig_Clothing || [];
  clothes.forEach((o,i) => {
    if (!o.dna_Tier) err(cf, `Outfit #${i+1}: missing dna_Tier`);
    const filled = CLOTHING_SLOTS.filter(k => o[k]);
    if (filled.length === 0) warn(cf, `Outfit #${i+1} (${o.dna_Tier||"?"}): all clothing slots are empty`);
  });

  // General loot
  const gf = "Loot/General/KeyCard_General_Config.json";
  const gen = files[gf]?.m_DNAConfig_Loot || [];
  gen.forEach((item,i) => {
    if (!item.dna_Type) err(gf, `Item #${i+1}: dna_Type is empty`);
    if (!item.dna_Category) err(gf, `Item #${i+1}: missing dna_Category`);
    if (!item.dna_Tier) err(gf, `Item #${i+1}: missing dna_Tier`);
  });

  // Container settings
  const kf = "System/LootContainers/KeyCard_LootContainers_System_Config.json";
  const cont = files[kf]?.m_DNAConfig_Container_System || [];
  if (cont.length < 225) err(kf, `Expected 225 entries, found ${cont.length}. Do not delete or add entries.`);
  cont.forEach((e,i) => {
    if (e.dna_CrateSetting > e.dna_StrongroomSetting && [1,6,8,13].includes(i%45)) {
      // just a note, not an error
    }
    // Check min > max violations
    const pairs = [[0,1],[3,4],[5,6],[7,8],[10,11],[12,13],[14,15],[16,17],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29],[30,31],[32,33],[35,36],[37,38],[39,40],[41,42],[43,44]];
    pairs.forEach(([mi,ma]) => {
      const relI = i % 45;
      if (relI === mi) {
        const maxEntry = cont[i - relI + ma];
        if (maxEntry && e.dna_CrateSetting > maxEntry.dna_CrateSetting && maxEntry.dna_CrateSetting !== 0) {
          warn(kf, `Entry ${i}: crate min (${e.dna_CrateSetting}) > max (${maxEntry.dna_CrateSetting})`);
        }
      }
    });
  });

  // Main system
  const mf = "System/Main/KeyCard_Main_System_Config.json";
  const msys = files[mf]?.m_DNAConfig_Main_System || [];
  if (msys.length < 60) warn(mf, `Fewer settings than expected (${msys.length})`);
  // Card uses
  MAIN_TIERS.forEach((t,i) => {
    const v = msys[12+i]?.dna_Setting;
    if (v !== undefined && v < 1) err(mf, `${t} card usage allotment is ${v} — must be at least 1`);
  });
  // Strongroom mob counts
  MAIN_TIERS.forEach((t,i) => {
    const wolves = msys[23+i*5]?.dna_Setting ?? 0;
    const bears  = msys[24+i*5]?.dna_Setting ?? 0;
    const infected = msys[25+i*5]?.dna_Setting ?? 0;
    if (wolves > 10) err(mf, `${t} strongroom wolves: ${wolves} exceeds max of 10`);
    if (bears > 6)   err(mf, `${t} strongroom bears: ${bears} exceeds max of 6`);
    if (infected > 40) err(mf, `${t} strongroom infected: ${infected} exceeds max of 40`);
  });

  // Smol crate loot sets per tier
  MAIN_TIERS.forEach(t => {
    const sf = `Loot/Other/Smol_${capT(t)}_Config.json`;
    const sd = files[sf];
    if (!sd) return;
    for (let n=1;n<=4;n++) {
      const items = sd[`dna_LootSet${capT(t)}${n}`] || [];
      const count = sd[`dna_LootSet${n}Count`] ?? 3;
      const rand  = sd[`dna_RandomizeLootSet${n}`] ?? 0;
      if (rand === 1 && count > items.length && items.length > 0) {
        warn(sf, `Loot Set ${n}: randomize count (${count}) > available items (${items.length}). May cause duplicates or errors.`);
      }
      items.forEach((item,i) => { if (!item) err(sf, `Loot Set ${n}, item #${i+1}: empty classname`); });
    }
    const weps = sd[`weaponTypes${capT(t)}`] || [];
    weps.forEach((w,i) => {
      if (!w.dna_TheChosenOne) err(sf, `Weapon #${i+1}: empty classname`);
    });
  });

  // Mobs
  const mobf = "System/Mobs/KeyCard_Mob_System_Config.json";
  const mobs = files[mobf]?.m_DNAConfig_Mob_System || [];
  const validMobTypes = ["wolf","bear","infected","bossYellow","bossGreen","bossBlue","bossPurple","bossRed"];
  mobs.forEach((m,i) => {
    if (!validMobTypes.includes(m.dna_DefaultMob)) warn(mobf, `Mob #${i+1}: unknown dna_DefaultMob "${m.dna_DefaultMob}"`);
  });

  return issues;
}

// ─── Section editors ──────────────────────────────────────────────────────────
function WeaponSec({state,set,sug}) {
  const [tier,setTier]=useState("yellow"); const c=TC[tier];
  const ws=state.weapons.filter(w=>w.dna_Tier===tier);
  const add=()=>set(s=>({...s,weapons:[...s.weapons,{id:crypto.randomUUID(),dna_Tier:tier,dna_WeaponCategory:"main",dna_TheChosenOne:"",dna_Magazine:"",dna_Ammunition:"",dna_OpticType:"",dna_Suppressor:"",dna_UnderBarrel:"",dna_ButtStock:"",dna_HandGuard:"",dna_Wrap:""}]}));
  const upd=(id,p)=>set(s=>({...s,weapons:s.weapons.map(w=>w.id===id?{...w,...p}:w)}));
  const del=(id)=>set(s=>({...s,weapons:s.weapons.filter(w=>w.id!==id)}));
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{MAIN_TIERS.map(t=><TierBtn key={t} t={t} active={tier===t} onClick={()=>setTier(t)}/>)}</div>
    <div style={{fontSize:11,color:"#444",marginBottom:10}}>{ws.length} loadout{ws.length!==1?"s":""} for {tier}. Each row = one full weapon loadout picked at random when a crate opens.</div>
    {ws.map(w=><div key={w.id} style={{...card(tier),borderLeft:`3px solid ${c}55`}}>
      <div style={{display:"grid",gridTemplateColumns:"110px 1fr 110px",gap:8,marginBottom:8,alignItems:"end"}}>
        <div><span style={lbl}>Category</span><select value={w.dna_WeaponCategory} onChange={e=>upd(w.id,{dna_WeaponCategory:e.target.value})} style={inp(c)}><option value="main">Main</option><option value="side">Sidearm</option></select></div>
        <div><span style={lbl}>Weapon (dna_TheChosenOne)</span><ACIn value={w.dna_TheChosenOne} onChange={v=>upd(w.id,{dna_TheChosenOne:v})} sug={sug} style={{color:c}}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>del(w.id)}>✕ Remove</button></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {WEAPON_ATT.map(k=><div key={k}><span style={lbl}>{k.replace("dna_","")}</span><ACIn value={w[k]} onChange={v=>upd(w.id,{[k]:v})} sug={sug} placeholder="optional"/></div>)}
      </div>
    </div>)}
    <button style={{...btn(TB[tier],c,c+"55"),width:"100%",letterSpacing:2}} onClick={add}>+ ADD {tier.toUpperCase()} WEAPON LOADOUT</button>
  </div>;
}

function ClothingSec({state,set,sug}) {
  const [tier,setTier]=useState("yellow"); const c=TC[tier];
  const os=state.clothing.filter(o=>o.dna_Tier===tier);
  const add=()=>set(s=>({...s,clothing:[...s.clothing,{id:crypto.randomUUID(),dna_Tier:tier,...Object.fromEntries(CLOTHING_SLOTS.map(k=>[k,""]))}]}));
  const upd=(id,p)=>set(s=>({...s,clothing:s.clothing.map(o=>o.id===id?{...o,...p}:o)}));
  const del=(id)=>set(s=>({...s,clothing:s.clothing.filter(o=>o.id!==id)}));
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{MAIN_TIERS.map(t=><TierBtn key={t} t={t} active={tier===t} onClick={()=>setTier(t)}/>)}</div>
    <div style={{fontSize:11,color:"#444",marginBottom:10}}>{os.length} outfit{os.length!==1?"s":""} for {tier}.</div>
    {os.map(o=><div key={o.id} style={{...card(tier),borderLeft:`3px solid ${c}55`}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}><button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>del(o.id)}>✕ Remove Outfit</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {CLOTHING_SLOTS.map(k=><div key={k}><span style={lbl}>{k.replace("dna_","")}</span><ACIn value={o[k]} onChange={v=>upd(o.id,{[k]:v})} sug={sug} placeholder="optional"/></div>)}
      </div>
    </div>)}
    <button style={{...btn(TB[tier],c,c+"55"),width:"100%",letterSpacing:2}} onClick={add}>+ ADD {tier.toUpperCase()} OUTFIT</button>
  </div>;
}

function GeneralSec({state,set,sug}) {
  const [tier,setTier]=useState("yellow"); const c=TC[tier];
  const items=state.general.filter(i=>i.dna_Tier===tier);
  const add=()=>set(s=>({...s,general:[...s.general,{id:crypto.randomUUID(),dna_Tier:tier,dna_Category:"medical",dna_Type:""}]}));
  const upd=(id,p)=>set(s=>({...s,general:s.general.map(i=>i.id===id?{...i,...p}:i)}));
  const del=(id)=>set(s=>({...s,general:s.general.filter(i=>i.id!==id)}));
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{MAIN_TIERS.map(t=><TierBtn key={t} t={t} active={tier===t} onClick={()=>setTier(t)}/>)}</div>
    <div style={{fontSize:11,color:"#444",marginBottom:10}}>{items.length} items in {tier} pool.</div>
    {items.length>0&&<div style={{display:"grid",gridTemplateColumns:"130px 1fr 36px",gap:8,padding:"4px 8px",fontSize:9,color:"#333",letterSpacing:1}}><span>CATEGORY</span><span>CLASSNAME</span><span/></div>}
    {items.map(i=><div key={i.id} style={{display:"grid",gridTemplateColumns:"130px 1fr 36px",gap:8,marginBottom:5,alignItems:"center"}}>
      <select value={i.dna_Category} onChange={e=>upd(i.id,{dna_Category:e.target.value})} style={inp(c)}>{GEN_CATS.map(cat=><option key={cat}>{cat}</option>)}</select>
      <ACIn value={i.dna_Type} onChange={v=>upd(i.id,{dna_Type:v})} sug={sug}/>
      <button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>del(i.id)}>✕</button>
    </div>)}
    <button style={{...btn(TB[tier],c,c+"55"),width:"100%",marginTop:4,letterSpacing:2}} onClick={add}>+ ADD ITEM TO {tier.toUpperCase()}</button>
  </div>;
}

function SmolSec({state,set,sug}) {
  const [tier,setTier]=useState("yellow"); const c=TC[tier];
  const td=state.smolConfig.perTier[tier];
  const upd=p=>set(s=>({...s,smolConfig:{...s.smolConfig,perTier:{...s.smolConfig.perTier,[tier]:{...td,...p}}}}));
  const addW=()=>upd({weapons:[...td.weapons,{dna_TheChosenOne:"",dna_Magazine:"",dna_SpareMagCount:0,dna_Ammunition:"",dna_SpareAmmoCount:1,dna_OpticType:"",dna_Suppressor:"",dna_UnderBarrel:"",dna_ButtStock:"",dna_HandGuard:"",dna_Wrap:""}]});
  const updW=(i,p)=>{const a=[...td.weapons];a[i]={...a[i],...p};upd({weapons:a});};
  const delW=(i)=>upd({weapons:td.weapons.filter((_,j)=>j!==i)});
  const addI=(n)=>upd({[`lootSet${n}`]:[...(td[`lootSet${n}`]||[]),""]});
  const updI=(n,i,v)=>{const a=[...(td[`lootSet${n}`]||[])];a[i]=v;upd({[`lootSet${n}`]:a});};
  const delI=(n,i)=>upd({[`lootSet${n}`]:td[`lootSet${n}`].filter((_,j)=>j!==i)});
  const setLabels=["Medical","Food","Drinks","Tools/Misc"];
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{MAIN_TIERS.map(t=><TierBtn key={t} t={t} active={tier===t} onClick={()=>setTier(t)}/>)}</div>
    <Tog label="Use Smol Config (global)" value={state.smolConfig.dna_UseConfig===1} onChange={v=>set(s=>({...s,smolConfig:{...s.smolConfig,dna_UseConfig:v?1:0}}))}/>
    <div style={{...card(tier),marginTop:10}}>
      <div style={g2}><Tog label="Spawn Weapons" value={td.dna_SpawnMainWeapons===1} onChange={v=>upd({dna_SpawnMainWeapons:v?1:0})}/><Tog label="Randomize Weapons" value={td.dna_RandomizeWeapons===1} onChange={v=>upd({dna_RandomizeWeapons:v?1:0})}/></div>
      <Fld label="Weapon Count (randomized)" type="number" min={1} value={td.dna_WeaponCount} onChange={v=>upd({dna_WeaponCount:v})}/>
    </div>
    <div style={{color:c,fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:8}}>WEAPONS ({td.weapons.length})</div>
    {td.weapons.map((w,i)=><div key={i} style={{...card(tier),borderLeft:`3px solid ${c}44`}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}><button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>delW(i)}>✕</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:6}}>
        <div><span style={lbl}>Weapon</span><ACIn value={w.dna_TheChosenOne} onChange={v=>updW(i,{dna_TheChosenOne:v})} sug={sug} style={{color:c}}/></div>
        <div><span style={lbl}>Magazine</span><ACIn value={w.dna_Magazine} onChange={v=>updW(i,{dna_Magazine:v})} sug={sug} placeholder="optional"/></div>
        <div><span style={lbl}>Ammunition</span><ACIn value={w.dna_Ammunition} onChange={v=>updW(i,{dna_Ammunition:v})} sug={sug}/></div>
        <div><span style={lbl}>Optic</span><ACIn value={w.dna_OpticType} onChange={v=>updW(i,{dna_OpticType:v})} sug={sug} placeholder="optional"/></div>
        <div><span style={lbl}>Suppressor</span><ACIn value={w.dna_Suppressor} onChange={v=>updW(i,{dna_Suppressor:v})} sug={sug} placeholder="optional"/></div>
        <Fld label="Spare Mags" type="number" min={0} value={w.dna_SpareMagCount} onChange={v=>updW(i,{dna_SpareMagCount:v})}/>
        <Fld label="Spare Ammo" type="number" min={0} value={w.dna_SpareAmmoCount} onChange={v=>updW(i,{dna_SpareAmmoCount:v})}/>
      </div>
    </div>)}
    <button style={{...btn(TB[tier],c,c+"44"),width:"100%",marginBottom:14,letterSpacing:2}} onClick={addW}>+ ADD WEAPON</button>
    {[1,2,3,4].map(n=><div key={n} style={{...card(tier),marginBottom:10}}>
      <div style={{color:c,fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,marginBottom:10}}>LOOT SET {n} — {setLabels[n-1]}</div>
      <div style={g3}>
        <Tog label="Spawn This Set" value={td[`dna_SpawnLootSet${n}`]===1} onChange={v=>upd({[`dna_SpawnLootSet${n}`]:v?1:0})}/>
        <Tog label="Randomize" value={td[`dna_RandomizeLootSet${n}`]===1} onChange={v=>upd({[`dna_RandomizeLootSet${n}`]:v?1:0})}/>
        <Fld label="Count (if random)" type="number" min={1} value={td[`dna_LootSet${n}Count`]} onChange={v=>upd({[`dna_LootSet${n}Count`]:v})}/>
      </div>
      {(td[`lootSet${n}`]||[]).map((item,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}>
        <ACIn value={item} onChange={v=>updI(n,i,v)} sug={sug}/>
        <button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>delI(n,i)}>✕</button>
      </div>)}
      <button style={{...btn(TB[tier],c,c+"33"),width:"100%",marginTop:4}} onClick={()=>addI(n)}>+ Add Item</button>
    </div>)}
  </div>;
}

function ContainerSec({state,set}) {
  const [tier,setTier]=useState("yellow"); const c=TC[tier];
  const ti=MAIN_TIERS.indexOf(tier); const base=ti*45;
  const get=i=>state.containers[base+i]||{crate:0,sr:0};
  const upd=(i,f,v)=>set(s=>{const cs=[...s.containers];cs[base+i]={...cs[base+i],[f]:+v};return{...s,containers:cs};});
  const sections=[
    {label:"Main Weapon",fields:[{l:"Min Main Weps",i:0},{l:"Max Main Weps",i:1},{l:"Spawn Attach (0/1)",i:2},{l:"Min Ammo",i:3},{l:"Max Ammo",i:4},{l:"Min Mags",i:5},{l:"Max Mags",i:6}]},
    {label:"Sidearm",fields:[{l:"Min Sidearms",i:7},{l:"Max Sidearms",i:8},{l:"Spawn Attach (0/1)",i:9},{l:"Min Ammo",i:10},{l:"Max Ammo",i:11},{l:"Min Mags",i:12},{l:"Max Mags",i:13}]},
    {label:"Food",fields:[{l:"Min Types",i:14},{l:"Max Types",i:15},{l:"Min Qty Each",i:16},{l:"Max Qty Each",i:17}]},
    {label:"Drinks",fields:[{l:"Min Types",i:18},{l:"Max Types",i:19},{l:"Min Qty Each",i:20},{l:"Max Qty Each",i:21}]},
    {label:"Tools",fields:[{l:"Min Types",i:22},{l:"Max Types",i:23},{l:"Min Qty Each",i:24},{l:"Max Qty Each",i:25}]},
    {label:"Medical",fields:[{l:"Min Types",i:26},{l:"Max Types",i:27},{l:"Min Qty Each",i:28},{l:"Max Qty Each",i:29}]},
    {label:"Materials",fields:[{l:"Min Types",i:30},{l:"Max Types",i:31},{l:"Min Qty Each",i:32},{l:"Max Qty Each",i:33}]},
    {label:"Valuables",fields:[{l:"Odds % (0=off)",i:34},{l:"Min Types",i:35},{l:"Max Types",i:36},{l:"Min Qty",i:37},{l:"Max Qty",i:38}]},
    {label:"Misc",fields:[{l:"Min Types",i:39},{l:"Max Types",i:40},{l:"Min Qty Each",i:41},{l:"Max Qty Each",i:42}]},
    {label:"Clothing",fields:[{l:"Min Outfits",i:43},{l:"Max Outfits",i:44}]},
  ];
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{MAIN_TIERS.map(t=><TierBtn key={t} t={t} active={tier===t} onClick={()=>setTier(t)}/>)}</div>
    <div style={{fontSize:11,color:"#444",marginBottom:14}}>Min=0 allows chance of nothing; Max=0 disables category. Left column = Crates, right = Strongrooms (Vaults).</div>
    {sections.map(sec=><div key={sec.label} style={card(tier)}>
      <div style={{color:c,fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,marginBottom:10}}>{sec.label}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {sec.fields.map(f=>{const e=get(f.i);return <div key={f.i}>
          <span style={lbl}>{f.l}</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            <div><div style={{fontSize:8,color:"#444",marginBottom:2}}>CRATE</div><input type="number" min={0} value={e.crate} onChange={ev=>upd(f.i,"crate",ev.target.value)} style={{...inp(),textAlign:"center"}}/></div>
            <div><div style={{fontSize:8,color:c+"99",marginBottom:2}}>VAULT</div><input type="number" min={0} value={e.sr} onChange={ev=>upd(f.i,"sr",ev.target.value)} style={{...inp(c),textAlign:"center"}}/></div>
          </div>
        </div>;})}
      </div>
    </div>)}
  </div>;
}

function MobSec({state,set}) {
  const add=()=>set(s=>({...s,mobs:[...s.mobs,{id:crypto.randomUUID(),dna_DefaultMob:"infected",dna_MobType:""}]}));
  const upd=(id,p)=>set(s=>({...s,mobs:s.mobs.map(m=>m.id===id?{...m,...p}:m)}));
  const del=(id)=>set(s=>({...s,mobs:s.mobs.filter(m=>m.id!==id)}));
  const MOB_CATS=["wolf","bear","infected","bossYellow","bossGreen","bossBlue","bossPurple","bossRed"];
  return <div>
    <div style={{fontSize:11,color:"#444",marginBottom:14}}>Mob pool for strongroom encounters. Boss slots are optional — one per tier.</div>
    {MOB_CATS.map(cat=>{
      const mobs=state.mobs.filter(m=>m.dna_DefaultMob===cat);
      const bCol=cat.startsWith("boss")?TC[cat.replace("boss","").toLowerCase()]||"#aaa":null;
      return <div key={cat} style={card(null)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{color:bCol||"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,letterSpacing:2}}>{cat.toUpperCase()} ({mobs.length})</div>
          {!cat.startsWith("boss")&&<button style={btn("#0a1a0a","#39FF14","#39FF1444")} onClick={add}>+</button>}
        </div>
        {mobs.map(m=><div key={m.id} style={{display:"grid",gridTemplateColumns:"150px 1fr 36px",gap:8,marginBottom:5,alignItems:"center"}}>
          <select value={m.dna_DefaultMob} onChange={e=>upd(m.id,{dna_DefaultMob:e.target.value})} style={inp()}>{MOB_CATS.map(k=><option key={k} value={k}>{k}</option>)}</select>
          <input value={m.dna_MobType} onChange={e=>upd(m.id,{dna_MobType:e.target.value})} placeholder="Classname..." style={inp()}/>
          <button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>del(m.id)}>✕</button>
        </div>)}
      </div>;
    })}
  </div>;
}

function MainSysSec({state,set}) {
  const ms=state.mainSys; const u=p=>set(s=>({...s,mainSys:{...s.mainSys,...p}}));
  return <div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>SPAWN MODE</div>
      <div style={g2}>
        <div><span style={lbl}>Crate Spawning</span><select value={ms.spawnCrates} onChange={e=>u({spawnCrates:+e.target.value})} style={inp()}><option value={0}>0 — Off (manual)</option><option value={1}>1 — Random</option><option value={2}>2 — Static</option></select></div>
        <div><span style={lbl}>Strongroom Spawning</span><select value={ms.spawnSR} onChange={e=>u({spawnSR:+e.target.value})} style={inp()}><option value={0}>0 — Off (manual)</option><option value={1}>1 — Random</option><option value={2}>2 — Static</option></select></div>
      </div>
    </div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>SPAWN COUNTS & CARD USES</div>
      <div style={g3}>{MAIN_TIERS.map(t=><Fld key={t+"c"} label={`${t} Crates`} type="number" min={0} value={ms.crateCounts[t]} col={TC[t]} onChange={v=>u({crateCounts:{...ms.crateCounts,[t]:v}})}/>)}</div>
      <div style={g3}>{MAIN_TIERS.map(t=><Fld key={t+"s"} label={`${t} Strongrooms`} type="number" min={0} value={ms.srCounts[t]} col={TC[t]} onChange={v=>u({srCounts:{...ms.srCounts,[t]:v}})}/>)}</div>
      <div style={g3}>{MAIN_TIERS.map(t=><Fld key={t+"u"} label={`${t} Card Uses`} type="number" min={1} value={ms.cardUses[t]} col={TC[t]} onChange={v=>u({cardUses:{...ms.cardUses,[t]:v}})}/>)}</div>
    </div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>LOOT SEPARATION</div>
      <div style={g2}>{[["sepSidearms","Separate Sidearms"],["sepFoodDrink","Separate Food & Drink"],["sepTools","Separate Tools"],["sepMeds","Separate Medical"],["sepMats","Separate Materials"],["sepMisc","Separate Misc"]].map(([k,l])=><Tog key={k} label={l} value={ms[k]===1} onChange={v=>u({[k]:v?1:0})} hint="Each tier uses its own pool"/>)}</div>
    </div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>STRONGROOM ALARMS & MOB SPAWNS</div>
      {MAIN_TIERS.map(t=><div key={t} style={{...card(t),marginBottom:8}}>
        <div style={{color:TC[t],fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,marginBottom:8}}>{t.toUpperCase()}</div>
        <div style={g4}>
          <Fld label="Wolves (0-10)" type="number" min={0} max={10} value={ms.srWolves[t]} onChange={v=>u({srWolves:{...ms.srWolves,[t]:v}})}/>
          <Fld label="Bears (0-6)" type="number" min={0} max={6} value={ms.srBears[t]} onChange={v=>u({srBears:{...ms.srBears,[t]:v}})}/>
          <Fld label="Infected (0-40)" type="number" min={0} max={40} value={ms.srInfected[t]} onChange={v=>u({srInfected:{...ms.srInfected,[t]:v}})}/>
          <Fld label="Notify Range (m)" type="number" min={0} value={ms.srRange[t]} onChange={v=>u({srRange:{...ms.srRange,[t]:v}})}/>
        </div>
        <Tog label="Alarm On Open" value={ms.srAlarm[t]===1} onChange={v=>u({srAlarm:{...ms.srAlarm,[t]:v?1:0}})}/>
      </div>)}
    </div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>CRATE & LOCKOUT ALARMS</div>
      {MAIN_TIERS.map(t=><div key={t} style={{display:"grid",gridTemplateColumns:"80px auto 1fr auto 1fr",gap:10,alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:TC[t],boxShadow:`0 0 4px ${TC[t]}`}}/><span style={{fontSize:11,color:TC[t]}}>{t}</span></div>
        <span style={{...lbl,width:"auto"}}>Crate Alarm</span><input type="number" min={0} max={1} value={ms.crateAlarm[t]} onChange={e=>u({crateAlarm:{...ms.crateAlarm,[t]:+e.target.value}})} style={{...inp(TC[t]),width:50,textAlign:"center"}}/>
        <span style={{...lbl,width:"auto"}}>Range (m)</span><input type="number" min={0} value={ms.crateRange[t]} onChange={e=>u({crateRange:{...ms.crateRange,[t]:+e.target.value}})} style={inp(TC[t])}/>
      </div>)}
    </div>
  </div>;
}

function ResetSec({state,set}) {
  const rt=state.resetTimer; const u=p=>set(s=>({...s,resetTimer:{...s.resetTimer,...p}}));
  const GROUPS=[
    {label:"Crates",resetKey:"resetCrates",timesKey:"crateTimes",tiers:MAIN_TIERS},
    {label:"Strongrooms",resetKey:"resetSR",timesKey:"srTimes",tiers:MAIN_TIERS},
    {label:"Lockout Doors",resetKey:"resetLock",timesKey:"lockTimes",tiers:TIERS},
    {label:"One-Way Doors",resetKey:"resetOW",timesKey:"owTimes",tiers:TIERS},
    {label:"Warp Doors",resetKey:"resetWarp",timesKey:"warpTimes",tiers:TIERS},
  ];
  return <div>
    <div style={card(null)}>
      <Tog label="Use Reset Timer System" value={rt.use===1} onChange={v=>u({use:v?1:0})}/>
      <div style={{...g2,marginTop:10}}>
        <Fld label="Check Interval (minutes)" type="number" min={1} value={rt.interval} onChange={v=>u({interval:v})}/>
        <Fld label="Min Player Distance (m)" type="number" min={0} value={rt.dist} onChange={v=>u({dist:v})}/>
      </div>
    </div>
    {GROUPS.map(g=><div key={g.label} style={card(null)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2}}>{g.label.toUpperCase()}</div>
        <Tog label="Enable Resets" value={rt[g.resetKey]===1} onChange={v=>u({[g.resetKey]:v?1:0})}/>
      </div>
      <div style={g3}>{g.tiers.map(t=><Fld key={t} label={`${t} (min)`} type="number" min={1} col={TC[t]} value={rt[g.timesKey][t]} onChange={v=>u({[g.timesKey]:{...rt[g.timesKey],[t]:v}})}/>)}</div>
    </div>)}
  </div>;
}

function SmolSysSec({state,set}) {
  const ss=state.smolSys; const u=p=>set(s=>({...s,smolSys:{...s.smolSys,...p}}));
  const addL=()=>u({locs:[...ss.locs,{tier:"Yellow",l:"0.0 0.0 0.0",r:"0.0 0.0 0.0"}]});
  const updL=(i,p)=>{const a=[...ss.locs];a[i]={...a[i],...p};u({locs:a});};
  const delL=(i)=>u({locs:ss.locs.filter((_,j)=>j!==i)});
  return <div>
    <div style={card(null)}><div style={g2}><Tog label="Spawn Smol Crates" value={ss.spawn===1} onChange={v=>u({spawn:v?1:0})}/><Tog label="Enable Smol Resets" value={ss.reset===1} onChange={v=>u({reset:v?1:0})}/></div></div>
    <div style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>RESET TIMES (minutes)</div>
      <div style={g3}>{MAIN_TIERS.map(t=><Fld key={t} label={t} type="number" min={1} col={TC[t]} value={ss.times[t]} onChange={v=>u({times:{...ss.times,[t]:v}})}/>)}</div>
    </div>
    <div style={card(null)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2}}>SPAWN LOCATIONS ({ss.locs.length})</div>
        <button style={btn("#0a1a0a","#39FF14","#39FF1444")} onClick={addL}>+ Add</button>
      </div>
      {ss.locs.map((loc,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"110px 1fr 1fr 36px",gap:8,marginBottom:6,alignItems:"end"}}>
        <div><span style={lbl}>Tier</span><select value={loc.tier} onChange={e=>updL(i,{tier:e.target.value})} style={inp(TC[loc.tier.toLowerCase()]||"#ccc")}>{MAIN_TIERS.map(t=><option key={t} value={capT(t)}>{t}</option>)}</select></div>
        <Fld label="Location X Y Z" value={loc.l} onChange={v=>updL(i,{l:v})} placeholder="0.0 0.0 0.0"/>
        <Fld label="Rotation X Y Z" value={loc.r} onChange={v=>updL(i,{r:v})} placeholder="0.0 0.0 0.0"/>
        <button style={{...btn("#1a0000","#ff4444","#440000"),marginTop:16}} onClick={()=>delL(i)}>✕</button>
      </div>)}
    </div>
  </div>;
}

function DoorSec({state,set}) {
  const da=state.doorAlarms; const u=p=>set(s=>({...s,doorAlarms:{...s.doorAlarms,...p}}));
  const TYPES=[{key:"lock",label:"Lockout Doors"},{key:"ow",label:"One-Way Doors"},{key:"warp",label:"Warp Doors"}];
  return <div>
    {TYPES.map(dt=><div key={dt.key} style={card(null)}>
      <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>{dt.label.toUpperCase()}</div>
      {TIERS.map(t=><div key={t} style={{display:"grid",gridTemplateColumns:"80px auto 1fr",gap:10,alignItems:"center",marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:TC[t],boxShadow:`0 0 4px ${TC[t]}`}}/><span style={{fontSize:11,color:TC[t]}}>{t}</span></div>
        <Tog label="Alarm" value={da[t+dt.key+"A"]===1} onChange={v=>u({[t+dt.key+"A"]:v?1:0})}/>
        <div><span style={lbl}>Notify Range (m, 0=off, 2001+=server)</span><input type="number" min={0} value={da[t+dt.key+"R"]} onChange={e=>u({[t+dt.key+"R"]:+e.target.value})} style={inp(TC[t])}/></div>
      </div>)}
    </div>)}
  </div>;
}

// ─── Validator Section ────────────────────────────────────────────────────────
function ValidatorSec({buildFn,state}) {
  const [issues,setIssues]=useState(null);
  const [running,setRunning]=useState(false);

  function run() {
    setRunning(true);
    setTimeout(()=>{
      try { const files=buildFn(state); setIssues(validateFiles(files)); }
      catch(e) { setIssues([{file:"Build",msg:e.message,level:"error"}]); }
      setRunning(false);
    },50);
  }

  const errors  = issues ? issues.filter(i=>i.level==="error") : [];
  const warnings= issues ? issues.filter(i=>i.level==="warn")  : [];

  return <div>
    <div style={{fontSize:11,color:"#555",marginBottom:14}}>
      Validates your current config against the mod's schema rules — checks for empty classnames, min/max violations, out-of-range mob counts, and more.
      Run this before exporting.
    </div>
    <button style={{...btn("#001a00","#39FF14","#39FF1455"),marginBottom:16,fontSize:12,padding:"10px 20px",letterSpacing:2}} onClick={run} disabled={running}>
      {running?"⏳ VALIDATING...":"🔍 RUN VALIDATION"}
    </button>

    {issues && <>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div style={{...card(null),flex:1,textAlign:"center",border:`1px solid ${errors.length?"#ff444455":"#1e1e1e"}`}}>
          <div style={{fontSize:28,fontWeight:900,color:errors.length?"#ff4444":"#39FF14",fontFamily:"'Orbitron',sans-serif"}}>{errors.length}</div>
          <div style={{fontSize:10,color:"#555",letterSpacing:2}}>ERRORS</div>
        </div>
        <div style={{...card(null),flex:1,textAlign:"center",border:`1px solid ${warnings.length?"#FF8C0055":"#1e1e1e"}`}}>
          <div style={{fontSize:28,fontWeight:900,color:warnings.length?"#FF8C00":"#555",fontFamily:"'Orbitron',sans-serif"}}>{warnings.length}</div>
          <div style={{fontSize:10,color:"#555",letterSpacing:2}}>WARNINGS</div>
        </div>
        <div style={{...card(null),flex:1,textAlign:"center",border:`1px solid ${!errors.length&&!warnings.length?"#39FF1455":"#1e1e1e"}`}}>
          <div style={{fontSize:28,fontWeight:900,color:!errors.length&&!warnings.length?"#39FF14":"#333",fontFamily:"'Orbitron',sans-serif"}}>{!errors.length&&!warnings.length?"✓":"·"}</div>
          <div style={{fontSize:10,color:"#555",letterSpacing:2}}>STATUS</div>
        </div>
      </div>

      {errors.length===0&&warnings.length===0&&<div style={{...card(null),border:"1px solid #39FF1444",textAlign:"center",padding:24}}>
        <div style={{fontSize:16,color:"#39FF14",fontFamily:"'Orbitron',sans-serif",letterSpacing:3}}>ALL CLEAR</div>
        <div style={{fontSize:11,color:"#555",marginTop:6}}>No issues found. Safe to export.</div>
      </div>}

      {errors.length>0&&<div style={{marginBottom:12}}>
        <div style={{fontSize:10,color:"#ff4444",letterSpacing:2,marginBottom:8}}>ERRORS — must fix before server will load correctly</div>
        {errors.map((e,i)=><div key={i} style={{...card(null),border:"1px solid #ff444433",marginBottom:6,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{color:"#ff4444",fontWeight:700,flexShrink:0}}>✕</span>
          <div>
            <div style={{fontSize:10,color:"#ff4444",letterSpacing:1,marginBottom:2}}>{e.file.split("/").pop()}</div>
            <div style={{fontSize:12,color:"#ddd"}}>{e.msg}</div>
          </div>
        </div>)}
      </div>}

      {warnings.length>0&&<div>
        <div style={{fontSize:10,color:"#FF8C00",letterSpacing:2,marginBottom:8}}>WARNINGS — worth reviewing</div>
        {warnings.map((w,i)=><div key={i} style={{...card(null),border:"1px solid #FF8C0033",marginBottom:6,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{color:"#FF8C00",fontWeight:700,flexShrink:0}}>⚠</span>
          <div>
            <div style={{fontSize:10,color:"#FF8C00",letterSpacing:1,marginBottom:2}}>{w.file.split("/").pop()}</div>
            <div style={{fontSize:12,color:"#ddd"}}>{w.msg}</div>
          </div>
        </div>)}
      </div>}
    </>}
  </div>;
}

// ─── Export builder ───────────────────────────────────────────────────────────
function buildFiles(state) {
  const files={};
  files["Loot/Weapons/KeyCard_Weapons_Config.json"]={m_DNAConfig_Weapons:state.weapons.map(({id,...w})=>w)};
  files["Loot/Clothing/KeyCard_Clothing_Config.json"]={m_DNAConfig_Clothing:state.clothing.map(({id,...c})=>c)};
  files["Loot/General/KeyCard_General_Config.json"]={m_DNAConfig_Loot:state.general.map(({id,...i})=>i)};
  files["Loot/Other/@Config_Description_and_Activation.json"]={
    dna_ConfigDescription:"This section of configs is used to fill smol crates and other crates we may add in the future that you place with editor",
    dna_ConfigDescriptionCont:"(or whatever you choose to use). If you are already using the smol crates and loading them another way, you can leave",
    dna_ConfigDescriptionCont2:"the setting below to false (0) and it will not interfere with your current setup. Set below to true (1) to use configs.",
    dna_UseConfig:state.smolConfig.dna_UseConfig,
  };
  MAIN_TIERS.forEach(t=>{
    const td=state.smolConfig.perTier[t]; const cT=capT(t);
    files[`Loot/Other/Smol_${cT}_Config.json`]={
      dna_Description:`DNA SMOL CRATE CONFIG (${cT} Tier).`,
      dna_DescriptionCont:"Randomize=0 spawns all items; Randomize=1 uses count setting.",
      dna_DescriptionCont2:"",
      dna_SpawnMainWeapons:td.dna_SpawnMainWeapons, dna_RandomizeWeapons:td.dna_RandomizeWeapons, dna_WeaponCount:td.dna_WeaponCount,
      [`weaponTypes${cT}`]:td.weapons||[],
      dna_SpawnLootSet1:td.dna_SpawnLootSet1, dna_RandomizeLootSet1:td.dna_RandomizeLootSet1, dna_LootSet1Count:td.dna_LootSet1Count, [`dna_LootSet${cT}1`]:td.lootSet1||[],
      dna_SpawnLootSet2:td.dna_SpawnLootSet2, dna_RandomizeLootSet2:td.dna_RandomizeLootSet2, dna_LootSet2Count:td.dna_LootSet2Count, [`dna_LootSet${cT}2`]:td.lootSet2||[],
      dna_SpawnLootSet3:td.dna_SpawnLootSet3, dna_RandomizeLootSet3:td.dna_RandomizeLootSet3, dna_LootSet3Count:td.dna_LootSet3Count, [`dna_LootSet${cT}3`]:td.lootSet3||[],
      dna_SpawnLootSet4:td.dna_SpawnLootSet4, dna_RandomizeLootSet4:td.dna_RandomizeLootSet4, dna_LootSet4Count:td.dna_LootSet4Count, [`dna_LootSet${cT}4`]:td.lootSet4||[],
    };
  });
  const ms=state.mainSys;
  const opts=[]; const vals=[];
  opts.push("(0) Use DNA To Spawn Crates (0 = off, 1 = random, 2 = static)"); vals.push(ms.spawnCrates);
  opts.push("(1) Use DNA To Spawn Strongrooms (0 = off, 1 = random, 2 = static)"); vals.push(ms.spawnSR);
  MAIN_TIERS.forEach((t,i)=>{opts.push(`(${2+i}) ${capT(t)} Crates Spawn Count`);vals.push(ms.crateCounts[t]);});
  MAIN_TIERS.forEach((t,i)=>{opts.push(`(${7+i}) ${capT(t)} Strongrooms Spawn Count`);vals.push(ms.srCounts[t]);});
  MAIN_TIERS.forEach((t,i)=>{opts.push(`(${12+i}) ${capT(t)} Card Usage Allotment`);vals.push(ms.cardUses[t]);});
  [{k:"sepSidearms",l:"Separate Sidearms"},{k:"sepFoodDrink",l:"Separate Food and Drink"},{k:"sepTools",l:"Separate Tools"},{k:"sepMeds",l:"Separate Meds"},{k:"sepMats",l:"Separate Materials"},{k:"sepMisc",l:"Separate Miscellaneous"}].forEach((o,i)=>{opts.push(`(${17+i}) ${o.l} by tier (1 = Yes, 0 = No)`);vals.push(ms[o.k]);});
  MAIN_TIERS.forEach((t,i)=>{const b=23+i*5;opts.push(`(${b}) ${t} Strongrooms wolves`);vals.push(ms.srWolves[t]);opts.push(`(${b+1}) ${t} bears`);vals.push(ms.srBears[t]);opts.push(`(${b+2}) ${t} infected`);vals.push(ms.srInfected[t]);opts.push(`(${b+3}) ${t} alarm`);vals.push(ms.srAlarm[t]);opts.push(`(${b+4}) ${t} range`);vals.push(ms.srRange[t]);});
  MAIN_TIERS.forEach((t,i)=>{const b=48+i*2;opts.push(`(${b}) ${t} Crates alarm`);vals.push(ms.crateAlarm[t]);opts.push(`(${b+1}) ${t} Crates range`);vals.push(ms.crateRange[t]);});
  MAIN_TIERS.forEach((t,i)=>{const b=58+i*2;opts.push(`(${b}) ${t} Lockout alarm`);vals.push(ms.lockAlarm[t]);opts.push(`(${b+1}) ${t} Lockout range`);vals.push(ms.lockRange[t]);});
  const cL={},sL={};
  MAIN_TIERS.forEach(t=>{
    cL[`m_DNA${capT(t)}_Crate_Locations`]=(ms.crateLocs[t]||[]).map(x=>({dna_Location:x.l,dna_Rotation:x.r}));
    sL[`m_DNA${capT(t)}_Strongroom_Locations`]=(ms.srLocs[t]||[]).map(x=>({dna_Location:x.l,dna_Rotation:x.r}));
  });
  files["System/Main/KeyCard_Main_System_Config.json"]={
    m_DNAConfig_Version:[{dna_WarningMessage:"DO NOT CHANGE THIS! IT WILL DELETE YOUR CONFIGS!!!!!!(but also creates backups ;) )",dna_ConfigVersion:2}],
    m_DNAConfig_Main_System:vals.map((v,i)=>({dna_Option:opts[i],dna_Setting:v})),
    ...cL,...sL,
  };
  files["System/LootContainers/KeyCard_LootContainers_System_Config.json"]={
    m_DNAConfig_Container_System:state.containers.map((e,i)=>({
      dna_Option:`(${i}) [${(e.tier||"").toUpperCase()} TIER]`,
      dna_CrateSetting:e.crate, dna_StrongroomSetting:e.sr,
    }))
  };
  files["System/Mobs/KeyCard_Mob_System_Config.json"]={m_DNAConfig_Mob_System:state.mobs.map(({id,...m})=>m)};
  const rt=state.resetTimer;
  files["System/Other/ResetTimer_Config.json"]={
    dna_WARNING:"Configure all types/tiers individually. Distance is meters, time is whole minutes.",
    dna_UseResetTimer:rt.use, dna_TimeBetweenChecks:rt.interval, dna_Min_Distance_Between_Nearest_Player:rt.dist,
    dna_ResetCrates:rt.resetCrates,
    ...Object.fromEntries(MAIN_TIERS.map(t=>[`dna_TimeUntil${capT(t)}CrateResets`,rt.crateTimes[t]])),
    dna_ResetStrongrooms:rt.resetSR,
    ...Object.fromEntries(MAIN_TIERS.map(t=>[`dna_TimeUntil${capT(t)}SRoomResets`,rt.srTimes[t]])),
    dna_ResetLockouts:rt.resetLock,
    ...Object.fromEntries(TIERS.map(t=>[`dna_TimeUntil${capT(t)}LockoutResets`,rt.lockTimes[t]])),
    dna_ResetOneWayDoors:rt.resetOW,
    ...Object.fromEntries(TIERS.map(t=>[`dna_TimeUntil${capT(t)}OWDoorResets`,rt.owTimes[t]])),
    dna_ResetWarpDoors:rt.resetWarp,
    ...Object.fromEntries(TIERS.map(t=>[`dna_TimeUntil${capT(t)}WarpDoorResets`,rt.warpTimes[t]])),
  };
  const ss=state.smolSys;
  files["System/Other/SmolCrates_Config.json"]={
    dna_Description:"Config for spawning and respawning smol crates.",
    dna_DescriptionCont:"In order to use this to spawn smol crates, set dna_SpawnSmolCrates to true.",
    dna_CrateSpawns:ss.locs.map(l=>({dna_Tier:l.tier,dna_Location:l.l,dna_Rotation:l.r})),
    dna_SpawnSmolCrates:ss.spawn, dna_ResetSmolCrates:ss.reset,
    ...Object.fromEntries(MAIN_TIERS.map(t=>[`dna_TimeUntil${capT(t)}SmolCrateResets`,ss.times[t]])),
  };
  const da=state.doorAlarms; const daOut={};
  TIERS.forEach(t=>{
    daOut[`dna_SoundAlarm${capT(t)}Lockout`]=da[t+"lockA"]||0; daOut[`dna_NotificationRange${capT(t)}Lockout`]=da[t+"lockR"]||0;
    daOut[`dna_SoundAlarm${capT(t)}OneWay`]=da[t+"owA"]||0;   daOut[`dna_NotificationRange${capT(t)}OneWay`]=da[t+"owR"]||0;
    daOut[`dna_SoundAlarm${capT(t)}Warp`]=da[t+"warpA"]||0;   daOut[`dna_NotificationRange${capT(t)}Warp`]=da[t+"warpR"]||0;
  });
  files["System/Other/DoorAlarmAndNotifications_Config.json"]=daOut;
  return files;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state,setState]=useState(mkState);
  const [sec,setSec]=useState("import");
  const [sug,setSug]=useState([]);
  const [files,setFiles]=useState(null);
  const [selFile,setSelFile]=useState(null);
  const [cpMsg,setCpMsg]=useState("");
  const [confirmReset,setConfirmReset]=useState(false);
  const [importLog,setImportLog]=useState([]);

  const SECS=[
    {id:"import",label:"📂 Import Configs",g:"START"},
    {id:"weapons",label:"🔫 Weapons",g:"LOOT"},
    {id:"clothing",label:"🪖 Clothing",g:"LOOT"},
    {id:"general",label:"🎒 General Loot",g:"LOOT"},
    {id:"smol",label:"📦 Smol Crates",g:"LOOT"},
    {id:"system",label:"⚙️ Main System",g:"SYSTEM"},
    {id:"container",label:"📊 Quantities",g:"SYSTEM"},
    {id:"mobs",label:"🐺 Mobs",g:"SYSTEM"},
    {id:"reset",label:"⏱️ Reset Timers",g:"SYSTEM"},
    {id:"smolsys",label:"🗃️ Smol System",g:"SYSTEM"},
    {id:"doors",label:"🚪 Door Alarms",g:"SYSTEM"},
    {id:"validate",label:"🔍 Validate",g:"OUTPUT"},
    {id:"export",label:"📤 Export",g:"OUTPUT"},
  ];

  function doExport(){const f=buildFiles(state);setFiles(f);setSelFile(Object.keys(f)[0]);setSec("export");}
  function cpFile(){if(!selFile||!files)return;navigator.clipboard.writeText(JSON.stringify(files[selFile],null,4)).then(()=>{setCpMsg("Copied!");setTimeout(()=>setCpMsg(""),2000);});}
  function dlFile(){if(!selFile||!files)return;const b=new Blob([JSON.stringify(files[selFile],null,4)],{type:"application/json"});const url=URL.createObjectURL(b);const a=document.createElement("a");a.href=url;a.download=selFile.split("/").pop();a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function dlAll(){if(!files)return;Object.entries(files).forEach(([p,d],i)=>setTimeout(()=>{const b=new Blob([JSON.stringify(d,null,4)],{type:"application/json"});const url=URL.createObjectURL(b);const a=document.createElement("a");a.href=url;a.download=p.replace(/\//g,"_");a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);},i*200));}

  function parseXML(text){const doc=new DOMParser().parseFromString(text,"text/xml");return[...doc.querySelectorAll("type")].map(t=>t.getAttribute("name")).filter(Boolean);}

  // Multi-file JSON import
  const MAX_JSON_SIZE = 10 * 1024 * 1024; // 10MB per file
  const MAX_XML_SIZE  = 50 * 1024 * 1024; // 50MB

  function handleJsonFiles(fileList) {
    const log=[];
    let newState = {...state};
    const validFiles = Array.from(fileList).filter(f => {
      if (!f.name.endsWith(".json")) { log.push({f:f.name,t:"skipped",ok:false,msg:"Not a .json file"}); return false; }
      if (f.size > MAX_JSON_SIZE) { log.push({f:f.name,t:"skipped",ok:false,msg:`File too large (max 10MB, got ${(f.size/1024/1024).toFixed(1)}MB)`}); return false; }
      return true;
    });
    if (validFiles.length === 0) { setImportLog([...log]); return; }
    let pending = validFiles.length;
    validFiles.forEach(file=>{
      const reader=new FileReader();
      reader.onload=e=>{
        try {
          const json=JSON.parse(e.target.result);
          const type=detectFileType(json);
          switch(type){
            case "weapons":    newState={...newState,weapons:importWeapons(json)}; log.push({f:file.name,t:"weapons",ok:true}); break;
            case "clothing":   newState={...newState,clothing:importClothing(json)}; log.push({f:file.name,t:"clothing",ok:true}); break;
            case "general":    newState={...newState,general:importGeneral(json)}; log.push({f:file.name,t:"general loot",ok:true}); break;
            case "smolActivation": newState={...newState,smolConfig:importSmolActivation(json,newState.smolConfig)}; log.push({f:file.name,t:"smol activation",ok:true}); break;
            case "mainSys":    newState={...newState,mainSys:importMainSys(json)}; log.push({f:file.name,t:"main system",ok:true}); break;
            case "containers": { const c=importContainers(json); if(c){newState={...newState,containers:c};log.push({f:file.name,t:"container settings",ok:true});}else{log.push({f:file.name,t:"containers",ok:false,msg:"Empty"});} break; }
            case "mobs":       newState={...newState,mobs:importMobs(json)}; log.push({f:file.name,t:"mobs",ok:true}); break;
            case "resetTimer": newState={...newState,resetTimer:importResetTimer(json)}; log.push({f:file.name,t:"reset timer",ok:true}); break;
            case "smolSys":    newState={...newState,smolSys:importSmolSys(json)}; log.push({f:file.name,t:"smol system",ok:true}); break;
            case "doorAlarms": newState={...newState,doorAlarms:importDoorAlarms(json)}; log.push({f:file.name,t:"door alarms",ok:true}); break;
            default: {
              // Try smol tier
              if(type.startsWith("smol_")){
                const t=type.replace("smol_","");
                newState={...newState,smolConfig:importSmolTier(json,t,newState.smolConfig)};
                log.push({f:file.name,t:`smol crates (${t})`,ok:true});
              } else {
                log.push({f:file.name,t:"unknown",ok:false,msg:"Could not detect file type"});
              }
            }
          }
        } catch(err) {
          log.push({f:file.name,t:"parse error",ok:false,msg:err.message});
        }
        pending--;
        if(pending===0){
          setState(newState);
          setImportLog([...log]);
        }
      };
      reader.readAsText(file);
    });
  }

  const xmlRef=useRef(); const jsonRef=useRef();
  const [xmlPaste,setXmlPaste]=useState(""); const [xmlOpen,setXmlOpen]=useState(false); const [xmlMsg,setXmlMsg]=useState("");
  function fromXmlFile(e){
    const f=e.target.files[0];if(!f)return;
    if(!f.name.endsWith(".xml")&&!f.name.endsWith(".XML")){setXmlMsg("✗ Not an .xml file");return;}
    if(f.size>MAX_XML_SIZE){setXmlMsg(`✗ File too large (max 50MB, got ${(f.size/1024/1024).toFixed(1)}MB)`);return;}
    const r=new FileReader();r.onload=ev=>{try{const items=parseXML(ev.target.result);setSug(items);setXmlMsg(`✓ ${items.length} items`);}catch{setXmlMsg("✗ Parse error");}};r.readAsText(f);
  }
  function fromPaste(){try{const items=parseXML(xmlPaste);setSug(items);setXmlMsg(`✓ ${items.length} items`);setXmlOpen(false);setXmlPaste("");}catch{setXmlMsg("✗ Parse error");}}

  // Import section UI
  function ImportSec() {
    return <div>
      <div style={{fontSize:11,color:"#555",marginBottom:18,lineHeight:1.7}}>
        Upload your existing config files here — you can select multiple at once. The editor will automatically detect which file is which (Weapons, Clothing, General Loot, Smol Configs, Main System, etc.) and load them into the correct sections.
        <br/>You can also start from scratch and just use the editor directly.
      </div>

      <div style={{...card(null),border:"1px solid #39FF1433",marginBottom:18}}>
        <div style={{color:"#39FF14",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:12}}>LOAD EXISTING JSON CONFIGS</div>
        <div style={{fontSize:11,color:"#555",marginBottom:10}}>
          Select any or all of your DNA Keycards JSON files at once. Supports all 14 config files.
        </div>
        <input ref={jsonRef} type="file" accept=".json" multiple style={{display:"none"}} onChange={e=>handleJsonFiles(e.target.files)}/>
        <button style={{...btn("#001a00","#39FF14","#39FF1455"),fontSize:13,padding:"12px 24px",letterSpacing:2}} onClick={()=>jsonRef.current.click()}>
          📂 SELECT JSON FILES
        </button>
        <div style={{fontSize:10,color:"#333",marginTop:8}}>Tip: select all files in both Loot/ and System/ folders at once with Ctrl+A or Cmd+A</div>
      </div>

      {importLog.length>0&&<div style={{...card(null),marginBottom:18}}>
        <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>IMPORT RESULTS</div>
        {importLog.map((l,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:"1px solid #1a1a1a"}}>
          <span style={{color:l.ok?"#39FF14":"#ff4444",fontWeight:700,width:16}}>{l.ok?"✓":"✕"}</span>
          <span style={{color:"#888",fontSize:11,width:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.f}</span>
          <span style={{color:l.ok?"#555":"#ff4444",fontSize:11}}>→ {l.t}{l.msg?` (${l.msg})`:""}</span>
        </div>)}
        <div style={{marginTop:12,fontSize:11,color:"#39FF14"}}>
          ✓ Loaded successfully. Use the sidebar to edit each section.
        </div>
      </div>}

      <div style={{...card(null),border:"1px solid #1a3a1a",marginBottom:18}}>
        <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>IMPORT TYPES.XML (FOR AUTOCOMPLETE)</div>
        <div style={{fontSize:11,color:"#555",marginBottom:10}}>Optional — import your types.xml to get classname autocomplete in all editors.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input ref={xmlRef} type="file" accept=".xml" style={{display:"none"}} onChange={fromXmlFile}/>
          <button style={btn("#0a1a0a","#39FF14","#39FF1444")} onClick={()=>xmlRef.current.click()}>📂 Load types.xml</button>
          <button style={btn("#0a0a1a","#00BFFF","#00BFFF44")} onClick={()=>setXmlOpen(!xmlOpen)}>📋 Paste XML</button>
          {sug.length>0&&<span style={{fontSize:11,color:"#39FF14"}}>✓ {sug.length} classnames loaded</span>}
          {xmlMsg&&<span style={{fontSize:11,color:xmlMsg[0]==="✓"?"#39FF14":"#ff4444"}}>{xmlMsg}</span>}
        </div>
        {xmlOpen&&<div style={{marginTop:10}}>
          <textarea value={xmlPaste} onChange={e=>setXmlPaste(e.target.value)} placeholder="Paste types.xml content here..." style={{...inp(),height:100,resize:"vertical",display:"block",marginBottom:8}}/>
          <div style={{display:"flex",gap:8}}><button style={btn("#0a1a0a","#39FF14","#39FF1444")} onClick={fromPaste}>Import</button><button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>setXmlOpen(false)}>✕</button></div>
        </div>}
      </div>

      <div style={card(null)}>
        <div style={{color:"#888",fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:2,marginBottom:10}}>START FRESH</div>
        <div style={{fontSize:11,color:"#555",marginBottom:10}}>Reset all config data back to defaults.</div>
        {!confirmReset
          ? <button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>setConfirmReset(true)}>🗑 Reset to Defaults</button>
          : <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#ff4444"}}>Are you sure? This clears everything.</span>
              <button style={btn("#1a0000","#ff4444","#440000")} onClick={()=>{setState(mkState());setImportLog([]);setConfirmReset(false);}}>Yes, Reset</button>
              <button style={btn("#1a1a1a","#888","#333")} onClick={()=>setConfirmReset(false)}>Cancel</button>
            </div>
        }
      </div>
    </div>;
  }

  return <div style={{minHeight:"100vh",background:"#080808",color:"#e0e0e0",fontFamily:"monospace",display:"flex",flexDirection:"column"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0d0d0d}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}input:focus,select:focus,textarea:focus{outline:none!important;border-color:#444!important}select option{background:#1a1a1a}`}</style>

    <div style={{background:"#0b0b0b",borderBottom:"1px solid #191919",padding:"11px 18px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:300}}>
      <div style={{display:"flex",gap:2,flexDirection:"column"}}>
        {["#FFD700","#39FF14","#00BFFF","#BF5FFF","#FF3333"].map((c,i)=><div key={i} style={{height:3,width:18,borderRadius:2,background:c,boxShadow:`0 0 4px ${c}`,transform:`translateX(${[0,3,5,3,0][i]}px)`}}/>)}
      </div>
      <div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontWeight:900,fontSize:14,letterSpacing:4,color:"#fff"}}>DNA KEYCARDS</div>
        <div style={{fontSize:8,color:"#3a3a3a",letterSpacing:3}}>CONFIG EDITOR · IMPORT · VALIDATE · EXPORT</div>
      </div>
      <div style={{flex:1}}/>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {sug.length>0&&<span style={{fontSize:10,color:"#39FF14"}}>✓ {sug.length} classnames</span>}
        <button style={btn("#0a0a14","#BF5FFF","#BF5FFF44")} onClick={()=>setSec("validate")}>🔍 Validate</button>
        <button style={btn("#001a00","#39FF14","#39FF1455")} onClick={doExport}>📤 Export All</button>
      </div>
    </div>

    <div style={{display:"flex",flex:1,minHeight:0}}>
      <div style={{width:185,background:"#0b0b0b",borderRight:"1px solid #191919",padding:"10px 0",flexShrink:0,overflowY:"auto"}}>
        {["START","LOOT","SYSTEM","OUTPUT"].map(g=><div key={g}>
          <div style={{padding:"6px 14px",fontSize:8,color:"#2e2e2e",letterSpacing:3,fontFamily:"'Orbitron',sans-serif"}}>{g}</div>
          {SECS.filter(s=>s.g===g).map(s=><button key={s.id} onClick={()=>setSec(s.id)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 14px",background:sec===s.id?"#191919":"transparent",border:"none",borderLeft:sec===s.id?"2px solid #39FF14":"2px solid transparent",color:sec===s.id?"#ddd":"#4a4a4a",cursor:"pointer",fontSize:11,fontFamily:"monospace",transition:"all .12s"}}>{s.label}</button>)}
        </div>)}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
        {sec==="import"    && <ImportSec/>}
        {sec==="weapons"   && <WeaponSec state={state} set={setState} sug={sug}/>}
        {sec==="clothing"  && <ClothingSec state={state} set={setState} sug={sug}/>}
        {sec==="general"   && <GeneralSec state={state} set={setState} sug={sug}/>}
        {sec==="smol"      && <SmolSec state={state} set={setState} sug={sug}/>}
        {sec==="system"    && <MainSysSec state={state} set={setState}/>}
        {sec==="container" && <ContainerSec state={state} set={setState}/>}
        {sec==="mobs"      && <MobSec state={state} set={setState}/>}
        {sec==="reset"     && <ResetSec state={state} set={setState}/>}
        {sec==="smolsys"   && <SmolSysSec state={state} set={setState}/>}
        {sec==="doors"     && <DoorSec state={state} set={setState}/>}
        {sec==="validate"  && <ValidatorSec buildFn={buildFiles} state={state}/>}

        {sec==="export" && <div>
          {!files&&<div style={{textAlign:"center",padding:40}}><button style={{...btn("#001a00","#39FF14","#39FF1455"),fontSize:13,padding:"14px 28px",letterSpacing:2}} onClick={doExport}>📤 BUILD ALL FILES</button></div>}
          {files&&<div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
              <div style={{fontSize:11,color:"#888",fontFamily:"'Orbitron',sans-serif",letterSpacing:2}}>{Object.keys(files).length} FILES READY</div>
              <div style={{flex:1}}/>
              <button style={btn("#001400","#39FF14","#39FF1444")} onClick={doExport}>🔄 Rebuild</button>
              <button style={btn("#0a0a1a","#00BFFF","#00BFFF44")} onClick={cpFile}>{cpMsg||"📋 Copy Selected"}</button>
              <button style={btn("#140800","#FF8C00","#FF8C0044")} onClick={dlFile}>💾 Download Selected</button>
              <button style={btn("#001a00","#39FF14","#39FF1444")} onClick={dlAll}>📦 Download All</button>
            </div>
            <div style={{display:"flex",gap:14}}>
              <div style={{width:250,flexShrink:0}}>
                {Object.keys(files).map(path=>{
                  const parts=path.split("/"); const fname=parts.pop(); const folder=parts.join("/");
                  return <div key={path} style={{marginBottom:1}}>
                    {folder&&<div style={{fontSize:8,color:"#2a2a2a",letterSpacing:1,paddingLeft:6,paddingTop:4,fontFamily:"monospace"}}>{folder}/</div>}
                    <button onClick={()=>setSelFile(path)} style={{display:"block",width:"100%",textAlign:"left",padding:"5px 10px",background:selFile===path?"#191919":"transparent",border:"none",borderLeft:selFile===path?"2px solid #39FF14":"2px solid transparent",color:selFile===path?"#e0e0e0":"#4a4a4a",cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{fname}</button>
                  </div>;
                })}
              </div>
              <pre style={{flex:1,background:"#0b0b0b",border:"1px solid #1a1a1a",borderRadius:7,padding:14,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",fontSize:11,color:"#6c9e6c",lineHeight:1.6,maxHeight:"68vh",overflowY:"auto",fontFamily:"'Courier New',monospace"}}>
                {selFile?JSON.stringify(files[selFile],null,4):"Select a file..."}
              </pre>
            </div>
          </div>}
        </div>}
      </div>
    </div>
    <div style={{borderTop:"1px solid #111",padding:"6px 18px",fontSize:8,color:"#222",display:"flex",gap:10,fontFamily:"monospace"}}>
      <span>DNA KEYCARDS CONFIG EDITOR</span><span>·</span><span>Import · Edit · Validate · Export</span>
    </div>
  </div>;
}
