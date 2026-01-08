/* Ogame Flight Calculator V9.0 - Final Release */

const CACHE_KEY = "ogame_calc_v9_0_";
const API_URL = "https://lobby.ogame.gameforge.com/api/servers";
const CORS_PROXY = "https://corsproxy.io/?";

const shipsData = {
    smallCargo: { id: 202, baseSpeed: 5000, fuel: 10, capacity: 5000 }, largeCargo: { id: 203, baseSpeed: 7500, fuel: 50, capacity: 25000 }, lightFighter: { id: 204, baseSpeed: 12500, fuel: 20, capacity: 50 },
    heavyFighter: { id: 205, baseSpeed: 10000, fuel: 75, capacity: 100 }, cruiser: { id: 206, baseSpeed: 15000, fuel: 300, capacity: 800 }, battleship: { id: 207, baseSpeed: 10000, fuel: 500, capacity: 1500 },
    colonyShip: { id: 208, baseSpeed: 2500, fuel: 1000, capacity: 7500 }, recycler: { id: 209, baseSpeed: 2000, fuel: 300, capacity: 20000 }, spyProbe: { id: 210, baseSpeed: 100000000, fuel: 1, capacity: 5 },
    bomber: { id: 211, baseSpeed: 4000, fuel: 700, capacity: 500 }, solarSatellite: { id: 212, baseSpeed: 0, fuel: 0, capacity: 0 }, destroyer: { id: 213, baseSpeed: 5000, fuel: 1000, capacity: 2000 },
    deathstar: { id: 214, baseSpeed: 100, fuel: 1, capacity: 1000000 }, battlecruiser: { id: 215, baseSpeed: 10000, fuel: 250, capacity: 750 }, reaper: { id: 218, baseSpeed: 7000, fuel: 1100, capacity: 10000 },
    pathfinder: { id: 219, baseSpeed: 12000, fuel: 300, capacity: 10000 }
};

const MISSIONS = ["attack", "transport", "deploy", "hold", "espionage", "recycle", "colonize", "expedition"];
const LANGUAGES = ["it", "en", "de", "fr", "es", "pl", "tr", "pt", "nl", "ru", "us", "cz", "hr", "hu", "jp", "ro", "sk", "br"];

const translations = {
    it: { start_coords: "PARTENZA", departure_time: "ORARIO DI PARTENZA", mission: "MISSIONE", player_class_label: "CLASSE PLAYER", alliance_class_label: "CLASSE ALLEANZA", loading_uni: "Caricamento...", select_uni: "Seleziona Universo", paste_report: "Incolla Report Spionaggio", analyze: "Analizza", active_fleet: "Flotta Attiva", tech_combustion: "Combustione", tech_impulse: "Impulso", tech_hyperspace: "Iperspaziale", tech_weapon: "Armi", tech_shield: "Scudi", tech_armour: "Corazze", player_class: "Classe Giocatore", alliance_class: "Classe Alleanza", general: "Generale", collector: "Collezionista", discoverer: "Esploratore", no_class: "Nessuna", desired_return: "Orario Ritorno", tab_flight: "VOLO", dest: "DESTINAZIONE", dist: "Distanza", smallCargo: "Cargo Leggero", largeCargo: "Cargo Pesante", lightFighter: "Caccia Leggero", heavyFighter: "Caccia Pesante", cruiser: "Incrociatore", battleship: "Nave da Battaglia", colonyShip: "Colonizzatrice", recycler: "Riciclatrice", spyProbe: "Sonda Spia", bomber: "Bombardiere", solarSatellite: "Satellite Solare", destroyer: "Corazzata", deathstar: "Morte Nera", battlecruiser: "Incr. Battaglia", reaper: "Reaper", pathfinder: "Pathfinder", attack: "Attacco", espionage: "Spionaggio", transport: "Trasporto", deploy: "Schieramento", expedition: "Spedizione", hold: "Stazionamento", recycle: "Raccolta Detriti", colonize: "Colonizzazione", recall: "ORARIO DI RIENTRO", info_recall_time: "Inserisci l'orario esatto in cui richiami la flotta.", info_recall_timer: "Inserisci il tempo di volo rimanente (countdown) visibile in gioco.", calc: "Calcola", btn_load: "CARICA", lbl_community: "Community", err_no_ships: "Nessuna nave selezionata", duration: "Durata", fuel: "Carburante", arrival: "Arrivo", return: "Ritorno", config_title: "Configurazione", techs_title: "TECNOLOGIE", act: "Calcolo Richiamo" },
    en: { start_coords: "START", departure_time: "DEPARTURE TIME", mission: "MISSION", player_class_label: "PLAYER CLASS", alliance_class_label: "ALLIANCE CLASS", loading_uni: "Loading...", select_uni: "Select Universe", paste_report: "Paste Spy Report", analyze: "Analyze", active_fleet: "Active Fleet", tech_combustion: "Combustion", tech_impulse: "Impulse", tech_hyperspace: "Hyperspace", tech_weapon: "Weapon", tech_shield: "Shield", tech_armour: "Armour", player_class: "Player Class", alliance_class: "Alliance Class", general: "General", collector: "Collector", discoverer: "Discoverer", no_class: "None", desired_return: "Return Time", tab_flight: "FLIGHT", dest: "DESTINATION", dist: "Distance", smallCargo: "Small Cargo", largeCargo: "Large Cargo", lightFighter: "Light Fighter", heavyFighter: "Heavy Fighter", cruiser: "Cruiser", battleship: "Battleship", colonyShip: "Colony Ship", recycler: "Recycler", spyProbe: "Spy Probe", bomber: "Bomber", solarSatellite: "Solar Sat", destroyer: "Destroyer", deathstar: "Deathstar", battlecruiser: "Battlecruiser", reaper: "Reaper", pathfinder: "Pathfinder", attack: "Attack", espionage: "Espionage", transport: "Transport", deploy: "Deploy", expedition: "Expedition", hold: "Hold", recycle: "Recycle", colonize: "Colonize", recall: "RETURN TIME", info_recall_time: "Enter exact recall time.", info_recall_timer: "Enter remaining flight time.", calc: "Calculate", btn_load: "LOAD", lbl_community: "Community", err_no_ships: "No ships selected", duration: "Duration", fuel: "Fuel", arrival: "Arrival", return: "Return", config_title: "Configuration", techs_title: "TECHNOLOGIES", act: "Recall Calc" },
    // Fallback lingue (tutte mappate su EN per brevità)
    de: { act: "Rückruf Ber.", recall: "RÜCKKEHRZEIT", info_recall_time: "Geben Sie die genaue Rückrufzeit ein.", info_recall_timer: "Geben Sie die verbleibende Flugzeit ein." },
    fr: { act: "Calc. Rappel", recall: "HEURE RETOUR", info_recall_time: "Entrez l'heure exacte du rappel.", info_recall_timer: "Entrez le temps de vol restant." },
    es: { act: "Calc. Retorno", recall: "HORA REGRESO", info_recall_time: "Ingrese la hora exacta de recuperación.", info_recall_timer: "Ingrese el tiempo de vuelo restante." }
};
// Completa fallback
const langKeys = ["de", "fr", "es", "pl", "tr", "pt", "nl", "ru", "us", "cz", "hr", "hu", "jp", "ro", "sk", "br"];
langKeys.forEach(k => { if(!translations[k]) translations[k] = translations['en']; else Object.assign(translations[k], translations['en']); });


let state = {
    lang: localStorage.getItem(`${CACHE_KEY}lang`) || "it",
    community: localStorage.getItem(`${CACHE_KEY}selectedCommunity`) || "it",
    fleet: {},
    techs: { combustion: 0, impulse: 0, hyperspace: 0, weapon: 0, shield: 0, armour: 0 },
    lfBonuses: {},
    lfClassBonus: 0,
    coords: { start: {g:1,s:1,p:1}, end: {g:1,s:2,p:1} },
    universeData: { speedWar: 1, speedPeace: 1, speedHolding: 1, deutSaveFactor: 1 },
    expandedRow: null,
    timerState: { mode: "time", timerM: 0, timerS: 0, recallTimeInput: "" },
    allServers: []
};

const el = (id) => document.getElementById(id);
const t = (key) => translations[state.lang]?.[key] || translations["en"]?.[key] || key;

document.addEventListener('DOMContentLoaded', () => {
    try {
        renderLangButtons();
        renderFleetInputs();
        renderLFInputs();
        renderMissionSelect();
        
        el('api-lang').value = state.community;
        initAPI();

        el('btn-analyze-spy').onclick = parseSpyReport;
        el('api-lang').onchange = (e) => { state.community = e.target.value; updateUniList(); };
        el('btn-fetch').onclick = () => fetchServerData(el('api-uni').value);
        
        // Listeners
        document.querySelectorAll('input, select').forEach(inp => {
            if(!inp.id.startsWith('api') && !inp.id.startsWith('spy')) {
                inp.addEventListener('change', calcFlight);
                inp.addEventListener('input', calcFlight); 
            }
        });

        const lfClassInp = el('lf-class-bonus');
        if(lfClassInp) lfClassInp.oninput = (e) => { state.lfClassBonus = parseFloat(e.target.value)||0; calcFlight(); };

        ['combustion','impulse','hyperspace','weapon','shield','armour'].forEach(k => {
            const i = el(`tech-${k}`);
            if(i) {
                i.value = state.techs[k]; 
                i.oninput = (e) => { state.techs[k] = parseInt(e.target.value)||0; renderFleetInputs(); calcFlight(); };
            }
        });

        setNowTime();
        setInterval(updateClock, 1000);
        el('flight-time').addEventListener('change', () => { manualTime = true; calcFlight(); });
    } catch (e) { console.error("Init Error:", e); }
});

/* --- API --- */
async function initAPI() {
    try {
        const r = await fetch(CORS_PROXY + encodeURIComponent(API_URL));
        if(!r.ok) throw new Error("API Error");
        state.allServers = await r.json();
        updateUniList();
    } catch(e) { console.warn("Lobby API Failed"); }
}

function updateUniList() {
    const l = el('api-lang').value;
    if(state.allServers.length > 0) {
        const servers = state.allServers.filter(s => s.language === l).sort((a,b) => b.number - a.number);
        el('api-uni').innerHTML = `<option value="" disabled selected>${t('select_uni')}</option>` + 
            servers.map(s => `<option value="${s.number}">${s.name} (s${s.number})</option>`).join('');
        el('api-uni').disabled = false;
    }
}

async function fetchServerData(num) {
    if(!num) return;
    const lang = el('api-lang').value;
    const btn = el('btn-fetch');
    btn.disabled = true; btn.innerText = "...";
    try {
        const url = `https://s${num}-${lang}.ogame.gameforge.com/api/serverData.xml`;
        const r = await fetch(CORS_PROXY + encodeURIComponent(url));
        if(!r.ok) throw new Error("XML Fetch Error");
        const str = await r.text();
        const xml = new DOMParser().parseFromString(str, "text/xml");
        const getTag = (tag, fb=1) => xml.querySelector(tag) ? parseInt(xml.querySelector(tag).textContent) : fb;
        const base = getTag('speedFleet', 1);
        state.universeData = {
            speedWar: getTag('speedFleetWar', base),
            speedPeace: getTag('speedFleetPeaceful', base),
            speedHolding: getTag('speedFleetHolding', base),
            deutSaveFactor: parseFloat(xml.querySelector('globalDeuteriumSaveFactor')?.textContent || 1)
        };
        el('speed-war').value = state.universeData.speedWar;
        el('speed-peace').value = state.universeData.speedPeace;
        el('speed-hold').value = state.universeData.speedHolding;
        calcFlight();
    } catch(e) { alert("Errore dati Universo."); } 
    finally { btn.disabled = false; btn.innerText = t("btn_load"); }
}

/* --- ADDITIVE FORMULA --- */
const getEngine = (id, techs) => {
    const i = techs.impulse, h = techs.hyperspace;
    if(id=='smallCargo' && i>=5) return 'IMP';
    if(id=='bomber' && h>=8) return 'HYP';
    if(id=='recycler') return h>=15 ? 'HYP' : (i>=17 ? 'IMP' : 'COMB');
    if(['heavyFighter','cruiser','colonyShip'].includes(id)) return 'IMP';
    if(['battleship','destroyer','deathstar','battlecruiser','reaper','pathfinder'].includes(id)) return 'HYP';
    return 'COMB';
};

const getShipSpeed = (id, techs, pClass, aClass, lf) => {
    const s = shipsData[id];
    if(!s) return 0;
    let base = s.baseSpeed;
    const c=techs.combustion, i=techs.impulse, h=techs.hyperspace;
    
    // 1. Upgrades che cambiano la base
    if(id==='smallCargo' && i>=5) base=10000;
    if(id==='bomber' && h>=8) base=5000; else if(id==='bomber' && i>=8) base=4000;
    if(id==='recycler') { if(h>=15) base=6000; else if(i>=17) base=4000; }
    
    const eng = getEngine(id, techs);
    const techLvl = eng==='COMB'?c : eng==='IMP'?i : h;
    const factor = eng==='HYP'?0.3 : eng==='IMP'?0.2 : 0.1;
    
    const bonusTech = techLvl * factor;
    let bonusClass = 0;
    const combat = ['lightFighter','heavyFighter','cruiser','battleship','bomber','destroyer','reaper','pathfinder','battlecruiser','deathstar'];
    
    if(pClass==='collector' && ['smallCargo','largeCargo'].includes(id)) bonusClass += 1.0 * (1 + state.lfClassBonus/100);
    if(pClass==='general' && (combat.includes(id) || id==='recycler')) bonusClass += 1.0 * (1 + state.lfClassBonus/100);

    let bonusAlly = 0;
    if(aClass==='warrior' && combat.includes(id)) bonusAlly += 0.1;
    if(aClass==='trader' && ['smallCargo','largeCargo'].includes(id)) bonusAlly += 0.1;

    let bonusSpecific = (parseFloat(lf[id]?.speed)||0)/100;

    return Math.floor(base * (1 + bonusTech + bonusClass + bonusAlly + bonusSpecific));
};

const getDistance = (s, e) => {
    if (s.g !== e.g) return Math.abs(s.g - e.g) * 20000;
    if (s.s !== e.s) return 2700 + 95 * Math.abs(s.s - e.s);
    if (s.p !== e.p) return 1000 + 5 * Math.abs(s.p - e.p);
    return 5;
};

function calcFlight() {
    state.coords.start = { g:el('start-g').value, s:el('start-s').value, p:el('start-p').value };
    state.coords.end = { g:el('end-g').value, s:el('end-s').value, p:el('end-p').value };
    const mission = el('mission-type').value;
    let uniSpeed = state.universeData.speedPeace; 
    if(mission === 'attack' || mission === 'espionage' || mission === 'recycle') uniSpeed = state.universeData.speedWar;
    if(mission === 'hold') uniSpeed = state.universeData.speedHolding;
    
    const dist = getDistance(state.coords.start, state.coords.end);
    let minSpeed = Infinity;
    let hasShips = false;

    Object.keys(shipsData).forEach(sid => {
        const count = state.fleet[sid] || 0;
        if(count > 0) {
            hasShips = true;
            const spd = getShipSpeed(sid, state.techs, el('player-class').value, el('alliance-class').value, state.lfBonuses);
            if(spd < minSpeed) minSpeed = spd;
        }
    });

    const tbody = el('flight-results');
    tbody.innerHTML = '';
    
    if(!hasShips) {
        el('flight-empty').classList.remove('hidden');
        el('flight-table-container').classList.add('hidden');
        return;
    }
    el('flight-empty').classList.add('hidden');
    el('flight-table-container').classList.remove('hidden');

    const startTime = el('flight-time').value ? new Date(el('flight-time').value).getTime() : Date.now();
    const isRound = !['deploy','colonize'].includes(mission);

    for(let pct=100; pct>=10; pct-=10) {
        const dur = (10 + (35000 / (pct/10)) * Math.sqrt(dist*10/minSpeed)) / uniSpeed;
        const secs = Math.round(dur);
        let fuel = 0;
        Object.keys(shipsData).forEach(sid => {
            const count = state.fleet[sid]||0;
            if(count>0) {
                let base = shipsData[sid].fuel * state.universeData.deutSaveFactor;
                if(el('player-class').value==='general') base *= 0.75;
                const lfFuel = parseFloat(state.lfBonuses[sid]?.fuel)||0;
                base *= (1 - lfFuel/100);
                if(base<1) base=1;
                fuel += (base * count * dist / 35000) * Math.pow(pct/10 + 1, 2);
            }
        });
        fuel = Math.round(fuel) + 1;
        const arrival = new Date(startTime + secs*1000);
        const retTime = new Date(startTime + secs*2000);
        
        const row = document.createElement('tr');
        row.innerHTML = `<td><div class="pct">${pct}%</div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div></td>
            <td class="font-mono text-white">${fmtTime(secs)}</td><td class="fuel">${fuel.toLocaleString()}</td>
            <td><div class="text-white font-bold">${arrival.toLocaleTimeString()}</div></td>
            <td class="return-col"><div class="text-warning font-bold">${isRound ? retTime.toLocaleTimeString() : '-'}</div></td>
            <td><button class="expand-btn" onclick="toggleRow(${pct}, ${secs}, ${startTime})"><i class="fas fa-clock"></i></button></td>`;
        tbody.appendChild(row);

        if(state.expandedRow === pct) {
            const det = document.createElement('tr');
            det.innerHTML = `<td colspan="6" class="p-0"><div class="recall-panel"></div></td>`;
            tbody.appendChild(det);
            renderRecall(det.querySelector('.recall-panel'), secs, startTime);
        }
    }
    document.querySelectorAll('.return-col').forEach(c => c.style.display = isRound ? '' : 'none');
}

function parseSpy() {
    const txt = el('spy-input').value;
    if(!txt) return;
    const coord = txt.match(/\[(\d+):(\d+):(\d+)\]/);
    if(coord) { el('end-g').value = coord[1]; el('end-s').value = coord[2]; el('end-p').value = coord[3]; }
    const getTech = r => { const m = txt.match(r); return m ? parseInt(m[1]) : 0; };
    const techs = {
        combustion: getTech(/Combustion Drive\s*(\d+)/i) || getTech(/Motore a combustione\s*(\d+)/i),
        impulse: getTech(/Impulse Drive\s*(\d+)/i) || getTech(/Motore a impulso\s*(\d+)/i),
        hyperspace: getTech(/Hyperspace Drive\s*(\d+)/i) || getTech(/Motore iperspaziale\s*(\d+)/i),
        weapon: getTech(/Weapons Technology\s*(\d+)/i) || getTech(/Tecnologia delle armi\s*(\d+)/i),
        shield: getTech(/Shielding Technology\s*(\d+)/i) || getTech(/Tecnologia degli scudi\s*(\d+)/i),
        armour: getTech(/Armour Technology\s*(\d+)/i) || getTech(/Tecnologia delle corazze\s*(\d+)/i)
    };
    if(techs.combustion) {
        state.techs = techs;
        Object.keys(techs).forEach(k => el(`tech-${k}`).value = techs[k]);
    }
    const map = { "Light Fighter": "lightFighter", "Caccia leggero": "lightFighter", "Small Cargo": "smallCargo", "Cargo leggero": "smallCargo", "Large Cargo": "largeCargo", "Cargo pesante": "largeCargo", "Cruiser": "cruiser", "Incrociatore": "cruiser", "Battleship": "battleship", "Nave da battaglia": "battleship", "Colony Ship": "colonyShip", "Colonizzatrice": "colonyShip", "Recycler": "recycler", "Riciclatrice": "recycler", "Espionage Probe": "spyProbe", "Sonda spia": "spyProbe", "Bomber": "bomber", "Bombardiere": "bomber", "Destroyer": "destroyer", "Corazzata": "destroyer", "Deathstar": "deathstar", "Morte Nera": "deathstar", "Battlecruiser": "battlecruiser", "Incrociatore da battaglia": "battlecruiser", "Reaper": "reaper", "Pathfinder": "pathfinder" };
    state.fleet = {};
    txt.split('\n').forEach(line => {
        for(let key in map) {
            if(line.includes(key)) {
                const nums = line.match(/[\d.]+/g);
                if(nums) state.fleet[map[key]] = parseInt(nums[nums.length-1].replace(/\./g,''));
            }
        }
    });
    renderFleetInputs();
    calcFlight();
    el('spy-input').value = "";
}
const parseSpyReport = parseSpy;

function renderRecall(c, dur, start) {
    const { mode, timerM, timerS, recallTimeInput } = state.timerState;
    let recSecs = 0;
    if(mode === 'timer') {
        const t = (parseInt(timerM)||0)*60 + (parseInt(timerS)||0);
        recSecs = Math.max(0, dur - t);
    } else {
        const t = recallTimeInput ? new Date(recallTimeInput).getTime() : start + dur*500;
        recSecs = Math.max(0, (t - start)/1000);
    }
    const ret = new Date(start + recSecs*2000);
    
    // TOOLTIP TEXT LOGIC
    const tipText = mode === 'time' ? t('info_recall_time') : t('info_recall_timer');

    c.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <div class="recall-inputs">
                <button class="btn-toggle ${mode==='time'?'active':''}" onclick="setMode('time')"><i class="fas fa-calendar"></i></button>
                <button class="btn-toggle ${mode==='timer'?'active':''}" onclick="setMode('timer')"><i class="fas fa-hourglass"></i></button>
                
                <div class="tooltip-container">
                    <i class="fas fa-info-circle"></i>
                    <span class="tooltip-text">${tipText}</span>
                </div>

                ${mode==='time' ? 
                `<input type="datetime-local" class="input-cyber" value="${recallTimeInput}" onchange="setRecTime(this.value)">` : 
                `<input type="number" class="input-cyber w-12" value="${timerM}" oninput="setTimer(this.value,'m')"> : <input type="number" class="input-cyber w-12" value="${timerS}" oninput="setTimer(this.value,'s')">`}
            </div>
            <div class="recall-result">${t('recall')}: <span style="color:var(--danger)">${ret.toLocaleTimeString()}</span></div>
        </div>
    `;
}

function renderFleetInputs() {
    el('fleet-list').innerHTML = Object.keys(shipsData).map(sid => {
        const cnt = state.fleet[sid]||0;
        const active = cnt>0 ? 'active' : '';
        return `<div class="ship-item ${active}"><div class="ship-icon">${sid.substring(0,2).toUpperCase()}</div><div class="ship-info"><span class="ship-name">${t(sid)}</span><span class="ship-engine">${active?getEngine(sid,state.techs):''}</span></div><input type="number" class="ship-input" value="${cnt||''}" data-sid="${sid}" placeholder="0" oninput="updateFleet(this)"></div>`;
    }).join('');
    el('ship-count').innerText = Object.values(state.fleet).reduce((a,b)=>a+b,0);
}

function renderLFInputs() {
    el('lf-bonuses-grid').innerHTML = Object.keys(shipsData).map(sid => `<div class="lf-item"><span class="lf-name">${t(sid)}</span><div class="lf-inputs"><input type="number" class="lf-inp spd" placeholder="Spd" value="${state.lfBonuses[sid]?.speed||''}" oninput="updLF('${sid}','speed',this.value)"><input type="number" class="lf-inp fuel" placeholder="Fuel" value="${state.lfBonuses[sid]?.fuel||''}" oninput="updLF('${sid}','fuel',this.value)"></div></div>`).join('');
}

function renderMissionSelect() {
    el('mission-type').innerHTML = MISSIONS.map(m => `<option value="${m}">${t(m)}</option>`).join('');
}

window.updateFleet = i => { state.fleet[i.dataset.sid] = parseInt(i.value)||0; renderFleetInputs(); calcFlight(); };
window.updLF = (id,k,v) => { if(!state.lfBonuses[id]) state.lfBonuses[id]={}; state.lfBonuses[id][k]=v; calcFlight(); };
window.toggleRow = (p,d,s) => { state.expandedRow = state.expandedRow===p ? null : p; calcFlight(); };
window.setMode = m => { state.timerState.mode = m; calcFlight(); };
window.setRecTime = v => { state.timerState.recallTimeInput = v; calcFlight(); };
window.setTimer = (v,k) => { state.timerState[k==='m'?'timerM':'timerS'] = v; calcFlight(); };
window.setLang = l => { 
    state.lang = l; 
    localStorage.setItem('ogame-lang', l); 
    renderMissionSelect();
    document.querySelectorAll('[data-i18n]').forEach(e => e.innerText = t(e.dataset.i18n));
    renderFleetInputs(); renderLFInputs();
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    renderLangButtons();
    updateUniList();
};
function renderLangButtons() { el('lang-selector').innerHTML = LANGUAGES.map(l => `<button class="lang-btn ${state.lang===l?'active':''}" onclick="setLang('${l}')">${l.toUpperCase()}</button>`).join(''); }

let manualTime = false;
function setNowTime() { el('flight-time').value = new Date().toISOString().slice(0,16); }
function updateClock() { if(!manualTime) setNowTime(); }
function fmtTime(s) { const h=Math.floor(s/3600), m=Math.floor(s%3600/60), sec=Math.floor(s%60); return `${h}h ${m}m ${sec}s`; }