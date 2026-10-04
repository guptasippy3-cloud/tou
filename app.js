const $ = id => document.getElementById(id);
const KEY = 'tou-pet-v1';
document.body.dataset.screen = 'care';
function openScreen(screen) {
  document.body.dataset.screen = screen;
  document.querySelectorAll('button[data-screen]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.screen === (screen === 'chat' ? 'chat' : 'care'))));
}
document.querySelectorAll('button[data-screen]').forEach(button => {
  button.onclick = () => {
    openScreen(button.dataset.screen);
  };
});
$('dress-up').onclick = () => openScreen('dress');
document.querySelectorAll('[data-back]').forEach(button => button.onclick = () => openScreen('care'));
let stored;
try { stored = JSON.parse(localStorage.getItem(KEY)); } catch {}
const validStored = stored && stored.version === 1 && typeof stored.name === 'string' && Number.isFinite(stored.born) && Number.isFinite(stored.updated) && stored.stats && ['hunger', 'happiness', 'cleanliness', 'energy'].every(key => Number.isFinite(stored.stats[key])) && stored.memories && typeof stored.memories === 'object' && !Array.isArray(stored.memories) && stored.care && typeof stored.care === 'object';
const state = validStored ? stored : { version: 1, name: 'Pip', born: Date.now(), updated: Date.now(), stats: { hunger: 82, happiness: 90, cleanliness: 75, energy: 88 }, memories: {}, outfit: 'natural', care: {}, sound: true, started: false, sleeping: false };
// Keep restored data bounded and restricted to the fields the game understands.
state.name = state.name.trim().slice(0, 20) || 'Pip';
state.stats = Object.fromEntries(['hunger','happiness','cleanliness','energy'].map(key => [key, Math.max(0, Math.min(100, state.stats[key]))]));
state.memories = Object.fromEntries(Object.entries(state.memories).filter(([key, value]) => ['name','color','food'].includes(key) && typeof value === 'string').map(([key, value]) => [key, value.slice(0, key === 'name' ? 40 : 60)]));
state.outfit = ['natural','bow','cap','crown'].includes(state.outfit) ? state.outfit : 'natural';
state.sound = typeof state.sound === 'boolean' ? state.sound : true;
state.sleeping = state.sleeping === true;
state.started = state.started === true;
state.careUntil = Number.isFinite(state.careUntil) ? Math.min(state.careUntil, Date.now() + 600000) : 0;
const petColors = { sage: ['Sage', '#b9cf8a', '#8fa960'], sky: ['Sky', '#a9cde5', '#7da8c6'], peach: ['Peach', '#efbd9c', '#cd9372'], lavender: ['Lavender', '#cbb9e5', '#a28cc1'], rose: ['Rose', '#e6b1c3', '#be879c'], sunshine: ['Sunshine', '#ebd27f', '#bea651'] };
state.petColor = Object.hasOwn(petColors, state.petColor) ? state.petColor : 'sage';
const savedStreak = state.streak || {};
state.streak = { count: Number.isSafeInteger(savedStreak.count) && savedStreak.count >= 0 ? savedStreak.count : 0, best: Number.isSafeInteger(savedStreak.best) && savedStreak.best >= 0 ? savedStreak.best : 0, lastDay: Number.isSafeInteger(savedStreak.lastDay) && savedStreak.lastDay >= 0 ? savedStreak.lastDay : null };
state.streak.best = Math.max(state.streak.best, state.streak.count);
function localDay(time = Date.now()) { const date = new Date(time); return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000); }
function currentStreak() { const gap = localDay() - state.streak.lastDay; return state.streak.lastDay !== null && gap >= 0 && gap <= 1 ? state.streak.count : 0; }
function recordCareDay() {
  const today = localDay();
  if (state.streak.lastDay === today || state.streak.lastDay > today) return;
  state.streak.count = state.streak.lastDay === today - 1 ? state.streak.count + 1 : 1;
  state.streak.lastDay = today;
  state.streak.best = Math.max(state.streak.best, state.streak.count);
}
const labels = { hunger: ['◒', 'Full tummy', '#bccb8a'], happiness: ['♡', 'Happiness', '#e2b6a0'], cleanliness: ['♧', 'Cleanliness', '#a9c8cf'], energy: ['☾', 'Energy', '#c1b6d7'] };
let tab = 'outfits', animationTimer, effectTimer;
const messages = [];
function effect(action) {
  clearTimeout(effectTimer);
  $('scene').classList.remove('eating','bathing');
  if (action === 'feed') $('scene').classList.add('eating');
  if (action === 'wash') $('scene').classList.add('bathing');
  $('care-effect').textContent = { feed: '🍎', play: '✦ ♡ ✦', wash: '🫧 🫧 🫧', sleep: 'z Z z', wake: '☀' }[action] || '';
  $('care-effect').className = 'care-effect active';
  effectTimer = setTimeout(() => { $('care-effect').className = 'care-effect'; $('scene').classList.remove('eating','bathing'); }, 2200);
}
function save() { try { const value = JSON.stringify(state); localStorage.setItem(KEY, value); if (window.TouSave) window.TouSave(value); else if (window.TouNative) window.TouNative.save(value); } catch { document.querySelector('.saved').textContent = 'Storage unavailable — keep this tab open'; } }
function decay() {
  const protectedUntil = Number.isFinite(state.careUntil) ? state.careUntil : 0;
  const hours = Math.max(0, (Date.now() - Math.max(state.updated, protectedUntil)) / 3600000);
  for (const key of Object.keys(labels)) state.stats[key] = Math.max(0, Math.min(100, state.stats[key] - hours * (key === 'energy' && state.sleeping ? -12 : { hunger: 4, happiness: 2, cleanliness: 2.5, energy: 3 }[key])));
  state.updated = Date.now(); save();
}
function render() {
  const [colorName, fill, stroke] = petColors[state.petColor];
  $('pet-wrap').style.setProperty('--pet-fill', fill); $('pet-wrap').style.setProperty('--pet-stroke', stroke);
  $('streak').textContent = `🔥 ${currentStreak()} day${currentStreak() === 1 ? '' : 's'}`;
  $('streak').title = `Daily care streak · Best: ${state.streak.best} days. Care for your pet each day to keep it going.`;
  $('streak').setAttribute('aria-label', `Care streak: ${currentStreak()} days. Best: ${state.streak.best} days. Complete a care action each day.`);
  $('date').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const days = Math.max(1, Math.floor((Date.now() - state.born) / 86400000) + 1);
  $('day').textContent = `Day ${days}`; $('age').textContent = days < 4 ? 'Tiny triangle' : days < 14 ? 'Growing triangle' : 'Grown-up triangle';
  $('name').textContent = state.name; $('chat-input').placeholder = `Hey ${state.name}, my favorite color is…`;
  const hour = new Date().getHours(); $('phase').textContent = state.sleeping ? 'Dreaming little dreams' : hour < 6 || hour >= 21 ? 'Evening wind-down' : hour < 12 ? 'Morning cuddles' : hour < 17 ? 'Afternoon playtime' : 'A cozy little evening';
  $('scene').classList.toggle('sleeping', state.sleeping);
  const dirt = Math.max(0, Math.min(1, (100 - state.stats.cleanliness) / 65));
  $('dirt').style.opacity = String(dirt);
  $('scene').classList.toggle('tired', state.stats.energy < 30);
  $('scene').classList.toggle('unhappy', state.stats.happiness < 35 || state.stats.hunger < 25);
  document.querySelectorAll('[data-care]').forEach(button => {
    if (button.dataset.care === 'sleep') {
      button.querySelector('strong').textContent = state.sleeping ? 'Wake up' : 'Rest';
      button.setAttribute('aria-pressed', String(state.sleeping));
    }
  });
  $('sound').setAttribute('aria-label', state.sound ? 'Mute pet sounds and replies' : 'Enable pet sounds and replies');
  $('sound').textContent = state.sound ? '♫' : '♩'; $('sound').setAttribute('aria-pressed', String(state.sound));
  $('stats').replaceChildren();
  for (const [key, [icon, label, color]] of Object.entries(labels)) {
    const value = Math.round(state.stats[key]); const row = document.createElement('div'); row.className = 'stat';
    row.innerHTML = `<div class="stat-label"><span>${icon} &nbsp; ${label}</span><span>${value}%</span></div><div class="track" role="progressbar" aria-label="${label}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><div class="fill" style="width:${value}%;background:${color}"></div></div>`; $('stats').append(row);
  }
  const thresholds = { hunger: 40, happiness: 50, cleanliness: 90, energy: 35 };
  const needsCare = Object.entries(state.stats).filter(([key, value]) => value < thresholds[key]);
  const lowest = (needsCare.length ? needsCare : Object.entries(state.stats)).sort((a,b) => a[1]-b[1])[0];
  $('mood').textContent = state.sleeping ? 'Zzz… dreaming of you' : (state.stats[lowest[0]] < { hunger: 40, happiness: 50, cleanliness: 90, energy: 35 }[lowest[0]]) ? { hunger: 'A little hungry', happiness: 'Could use a little company', cleanliness: state.stats.cleanliness < 40 ? 'Ready for a bubble bath' : 'A little dusty from adventures', energy: 'Getting a little sleepy' }[lowest[0]] : 'Feeling pretty wonderful';
  $('care-note').textContent = Object.values(state.stats).every(value => value === 100) ? 'All cared for! Every meter is full. Enjoy a little time together. ♡' : lowest[1] < 25 ? 'A little care would help. Tap a care button to make my day.' : 'You’re doing great. Keep the little moments coming.';
  const today = new Date().toLocaleDateString('en-CA'); $('routine').replaceChildren();
  for (const [key, icon, title, time] of [['feed','☀','Breakfast together','Morning · a fresh start'],['play','✦','A little adventure','Afternoon · time to play'],['wash','♧','A bubble bath','Anytime · freshen up'],['sleep','☾','Sweet little dreams','Evening · slow things down']]) {
    const done = state.care[key] === today; const row = document.createElement('div'); row.className = 'routine-row'; row.innerHTML = `<span class="routine-icon">${icon}</span><div>${title}<small>${time}</small></div><span>${done ? '✓ Done' : 'To do'}</span>`; $('routine').append(row);
  }
  $('hat').textContent = { natural: '', bow: '🎀', cap: '🧢', crown: '👑' }[state.outfit] || '';
  $('outfit').style.fill = state.outfit === 'bow' ? '#dfb0a5' : state.outfit === 'cap' ? '#9fbacb' : state.outfit === 'crown' ? '#d8bc76' : 'transparent';
  renderTab(); renderMemories();
}
const voiceDefaults = { pitch: 1.65, rate: 1.02, volume: 0.8 };
state.voiceSettings = state.voiceSettings && typeof state.voiceSettings === 'object' ? state.voiceSettings : {};
for (const [key, min, max] of [['pitch',0.5,2],['rate',0.5,1.5],['volume',0,1]]) {
  const value = state.voiceSettings[key];
  state.voiceSettings[key] = Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : voiceDefaults[key];
}
function renderVoiceSettings() {
  for (const key of Object.keys(voiceDefaults)) {
    $('voice-' + key).value = state.voiceSettings[key];
    $(key + '-value').textContent = key === 'volume' ? `${Math.round(state.voiceSettings[key] * 100)}%` : `${state.voiceSettings[key].toFixed(2)}×`;
  }
}
for (const key of Object.keys(voiceDefaults)) {
  $('voice-' + key).oninput = () => {
    state.voiceSettings[key] = Number($('voice-' + key).value);
    renderVoiceSettings(); save();
  };
}
$('reset-voice').onclick = () => { state.voiceSettings = { ...voiceDefaults }; renderVoiceSettings(); save(); };
renderVoiceSettings();
function availableVoices() {
  if (window.TouNative) return window.TouNative.voices;
  return 'speechSynthesis' in window && typeof speechSynthesis.getVoices === 'function' ? speechSynthesis.getVoices() : [];
}
function preferredVoice(voices) {
  const saved = voices.find(voice => voice.voiceURI === state.voice);
  if (saved) return saved;
  const english = voices.filter(voice => /^en(?:-|$)/i.test(voice.lang));
  const softVoices = english.filter(voice => /Samantha|Karen|Moira|Tessa|Serena|Ava|Allison|Susan|Victoria|Zira|female/i.test(voice.name));
  return softVoices.find(voice => /premium|enhanced|natural|neural/i.test(voice.name)) || softVoices.find(voice => /Samantha/i.test(voice.name)) || softVoices[0] || english.find(voice => /child|kid/i.test(voice.name)) || english.find(voice => voice.default) || english[0];
}
function renderVoices() {
  const picker = $('reply-voice'); picker.replaceChildren();
  const voices = availableVoices();
  const automatic = document.createElement('option'); automatic.value = ''; automatic.textContent = 'Pip’s little kid voice (automatic)'; picker.append(automatic);
  for (const voice of voices.filter(voice => /^en(?:-|$)/i.test(voice.lang))) {
    const option = document.createElement('option'); option.value = voice.voiceURI; option.textContent = `${voice.name} · ${voice.lang}`; picker.append(option);
  }
  picker.value = state.voice || ''; picker.disabled = !voices.length;
}
let speechTurn = 0;
function speakReply(message) {
  if (window.TouNative) {
    if (!state.sound) return;
    const voice = preferredVoice(availableVoices());
    window.TouNative.speak({ text: message.replace(/[♡✦👑]/gu, ''), voice: voice ? voice.voiceURI : '', ...state.voiceSettings })
      .catch(() => { $('chat-hint').textContent = 'Install an offline English voice in Android’s text-to-speech settings to hear replies.'; });
    return;
  }
  if (!state.sound || !('speechSynthesis' in window)) return;
  const turn = ++speechTurn;
  $('scene').classList.remove('talking');
  speechSynthesis.cancel();
  const spokenMessage = message
    .replace('Want to play or tell me something about yourself?', 'Wanna play?')
    .replace('I’m happy we found each other.', 'Yay! You’re my friend!')
    .replace('It’s a little piece of you.', 'Yay!')
    .replace('I like spending these little moments with you. Shall we play?', 'I like you! Let’s play!')
    .replace('A wiggle, a snack, and a friend. That’s my kind of day.', 'Wiggle, wiggle! Snack time!')
    .replace(/[♡✦👑]/gu, '');
  const utterance = new SpeechSynthesisUtterance(spokenMessage);
  const voice = preferredVoice(availableVoices());
  if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
  utterance.rate = state.voiceSettings.rate; utterance.pitch = state.voiceSettings.pitch; utterance.volume = state.voiceSettings.volume;
  utterance.onstart = () => { if (turn === speechTurn) $('scene').classList.add('talking'); };
  const finish = () => { if (turn === speechTurn) $('scene').classList.remove('talking'); };
  utterance.onend = finish;
  utterance.onerror = () => { finish(); $('chat-hint').textContent = 'Spoken replies are unavailable right now. You can still read Pip’s reply above.'; };
  speechSynthesis.speak(utterance);
}
function say(message, speak = false) { $('speech').textContent = message; if (speak) speakReply(message); }
$('reply-voice').onchange = () => { state.voice = $('reply-voice').value; save(); };
$('preview-voice').onclick = () => { state.sound = true; save(); render(); speakReply(`Hi! I’m ${state.name}. Yay! Let’s play.`); };
if ('speechSynthesis' in window && typeof speechSynthesis.addEventListener === 'function') speechSynthesis.addEventListener('voiceschanged', renderVoices);
renderVoices();
function trick(type, audible = true) { if (audible) activitySound(type); clearTimeout(animationTimer); $('pet-wrap').className = 'pet-wrap'; void $('pet-wrap').offsetWidth; $('pet-wrap').classList.add(type); animationTimer = setTimeout(() => $('pet-wrap').className = 'pet-wrap', 2100); }

// Original non-musical foley: crunches, water, breathing and movement.
const activityFiles = { feed: 'eating', wash: 'washing', sleep: 'sleeping', wake: 'waking', jump: 'hop', spin: 'twirl', dance: 'dancing', play: 'dancing' };
let activityAudio;
function stopActivitySounds() {
  if (activityAudio) { activityAudio.pause(); activityAudio.currentTime = 0; activityAudio = null; }
}
window.TouStopAudio = stopActivitySounds;
function activitySound(action) {
  if (!state.sound || !activityFiles[action] || typeof window.Audio !== 'function') return;
  stopActivitySounds();
  if (action === 'dance' || action === 'play') {
    if (window.TouNative) window.TouNative.stop();
    if ('speechSynthesis' in window) { ++speechTurn; speechSynthesis.cancel(); }
  }
  try {
    const audio = new window.Audio(`public/audio/${activityFiles[action]}.wav`);
    activityAudio = audio;
    audio.volume = state.voiceSettings.volume * .75;
    audio.onended = () => { if (activityAudio === audio) activityAudio = null; };
    audio.onerror = () => { if (activityAudio === audio) { activityAudio = null; if (action === 'dance' || action === 'play') speakReply('La la la, la la la!'); } };
    const started = audio.play();
    if (started && typeof started.catch === 'function') started.catch(() => { if (activityAudio === audio) { activityAudio = null; if (action === 'dance' || action === 'play') speakReply('La la la, la la la!'); } });
  } catch { activityAudio = null; }
}
function performTrick(type) {
  if (!['jump','spin','dance'].includes(type)) return;
  decay();
  if (state.stats.energy < 10) { say('I’m sleepy. Tap Rest, then let’s play!'); return; }
  state.sleeping = false;
  state.stats.energy = Math.max(0,state.stats.energy-2);
  state.stats.happiness = 100;
  state.stats.cleanliness = Math.max(0,state.stats.cleanliness-3);
  state.care.play = new Date().toLocaleDateString('en-CA');
  recordCareDay(); save(); render(); effect('play'); trick(type);
  say({jump:'Boing! A little hop just for you.',spin:'Wheee! One very dizzy triangle.',dance:'La la la, la la la! ♫'}[type]);
}
function renderMemories() {
  const entries = Object.entries(state.memories);
  $('memory-list').textContent = entries.length ? entries.map(([key,value]) => `${{name:'Your name',color:'Favorite color',food:'Favorite food'}[key]}: ${value}`).join(' · ') : 'Tell me your name, favorite color or favorite food. I’ll remember.';
  $('forget-memories').hidden = !entries.length;
}
$('forget-memories').onclick=()=>{state.memories={};save();renderMemories();say('A fresh start. Let’s make new memories.');};

function care(action) {
  if (!['feed','play','wash','sleep'].includes(action)) return;
  decay();
  if (action === 'sleep' && state.sleeping) { state.sleeping = false; save(); render(); effect('wake'); activitySound('wake'); say('Good morning! Ready for a little adventure?'); return; }
  if (action === 'play' && state.stats.energy < 10) { say('I’m too sleepy to play. Let’s rest a little first.'); return; }
  if (action === 'feed' && state.stats.hunger >= 100) { say('My tummy is full! Let’s save a snack for later.'); return; }
  if (action === 'wash' && state.stats.cleanliness >= 100) { say('I’m already squeaky clean! Let’s go make some memories.'); return; }
  state.sleeping = action === 'sleep';
  if (state.sleeping) { clearTimeout(animationTimer); $('pet-wrap').className = 'pet-wrap'; }
  const changes = { feed: { hunger: 100, happiness: 4 }, play: { happiness: 100, energy: -9, hunger: -4, cleanliness: -8 }, wash: { cleanliness: 100, happiness: 5 }, sleep: { energy: 100 } };
  for (const [key, value] of Object.entries(changes[action])) state.stats[key] = Math.max(0, Math.min(100, state.stats[key] + value));
  state.careUntil = Date.now() + 10 * 60000;
  recordCareDay();
  state.care[action] = new Date().toLocaleDateString('en-CA'); save(); render();
  effect(action); activitySound(action);
  say({ feed: 'Nom nom! Everything tastes better with you.', play: 'Watch my happy dance! Your turn!', wash: 'Bubble party! I feel all sparkly again.', sleep: 'A cozy rest! My energy is full. Wake me when you’re ready. ♡' }[action]);
  if (action !== 'sleep') trick(action === 'play' ? 'dance' : 'jump', false);
}
function renderTab() {
  document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
  const box = $('tab-content'); box.replaceChildren();
  if (tab === 'colors') {
    const colors = document.createElement('div'); colors.className = 'color-choices';
    for (const [key, [name, fill]] of Object.entries(petColors)) {
      const button = document.createElement('button'); button.className = 'color-choice'; button.textContent = name;
      button.style.setProperty('--swatch', fill); button.setAttribute('aria-label', `${name} pet color`); button.setAttribute('aria-pressed', String(state.petColor === key));
      button.onclick = () => { state.petColor = key; save(); render(); say(`${name}! A lovely new look. ♡`); }; colors.append(button);
    }
    box.append(colors); return;
  }
  const choices = document.createElement('div'); choices.className = 'choices';
  for (const [key, icon, label] of [['natural','△','Just me'],['bow','🎀','Little bow'],['cap','🧢','Playtime'],['crown','👑','Royalty']]) {
    const button = document.createElement('button'); button.className = 'choice' + (tab === 'outfits' && state.outfit === key ? ' active' : ''); button.innerHTML = `<span>${icon}</span>${label}`; button.setAttribute('aria-label',label);
    button.onclick = () => { state.outfit = key; save(); render(); say({ natural: 'Just me, little hands and all. ♡', bow: 'A bow for my next adventure!', cap: 'My playtime cap! Let’s explore.', crown: 'Your royal triangle is ready! 👑' }[key]); }; choices.append(button);
  } box.append(choices);
}
function chat(message) {
  message = String(message).trim().slice(0,300); if (!message) return; decay(); state.sleeping = false; state.stats.happiness = Math.min(100,state.stats.happiness+3);
  let reply, match;
  if ((match = message.match(/(?:my (?:favou?rite|fav) colou?r is|i like the colou?r)\s+(.+?)[.!?]*$/i))) { state.memories.color = match[1].slice(0,60); reply = `${state.memories.color}! I’ll remember your favorite color. It’s a little piece of you. ♡`; }
  else if ((match = message.match(/my (?:favou?rite|fav) food is\s+(.+?)[.!?]*$/i))) { state.memories.food = match[1].slice(0,60); reply = `I’ll remember that you love ${state.memories.food}. Maybe we can have a pretend picnic!`; }
  else if ((match = message.match(/(?:my name is|call me)\s+(.+?)[.!?]*$/i))) { state.memories.name = match[1].slice(0,40); reply = `Hello, ${state.memories.name}! I’m ${state.name}. I’m happy we found each other.`; }
  else if (/forget.*(?:me|memory|memories|everything)/i.test(message)) { state.memories = {}; reply = 'I’ve cleared what you shared. We can start fresh together.'; }
  else if (/fav.*colou?r/i.test(message)) reply = state.memories.color ? `Your favorite color is ${state.memories.color}. I remembered!` : 'Tell me “my favorite color is…” and I’ll remember it.';
  else if (/fav.*food/i.test(message)) reply = state.memories.food ? `You love ${state.memories.food}!` : 'Tell me your favorite food. I’m always thinking about snacks.';
  else if (/my name|who am i/i.test(message)) reply = state.memories.name ? `You’re ${state.memories.name}, my favorite human!` : 'Tell me “my name is…” so I can remember.';
  else if (/\b(?:dance|spin|twirl|jump|trick)\b/i.test(message)) { performTrick(/spin|twirl/i.test(message) ? 'spin' : /jump/i.test(message) ? 'jump' : 'dance'); reply = $('speech').textContent; }
  else if (/sad|lonely|bad day|upset/i.test(message)) reply = 'I’m here with you. We can sit quietly for a little while. Sending a tiny triangle hug. ♡';
  else if (/love/i.test(message)) reply = 'You make my little triangle heart very happy. ♡';
  else if (/hello|hey|hi\b/i.test(message)) reply = `Hi ${state.memories.name || 'friend'}! Want to play or tell me something about yourself?`;
  else if (/hungry|feed/i.test(message)) reply = 'A little snack sounds lovely! Tap Feed and we can eat together.';
  else reply = ['I like spending these little moments with you. Shall we play?', 'Tell me your favorite color or food. I keep those little details close.', 'A wiggle, a snack, and a friend. That’s my kind of day.'][Math.floor(Math.random()*3)];
  messages.push({ you: message, pet: reply });
  if (messages.length > 8) messages.shift();
  $('chat-log').replaceChildren();
  for (const item of messages) {
    const row = document.createElement('p'); row.textContent = `You: ${item.you} · ${state.name}: ${item.pet}`; $('chat-log').append(row);
  }
  save(); render(); say(reply,!/\b(?:dance|spin|twirl|jump|trick)\b/i.test(message)); $('chat-hint').textContent = `You said: “${message}”`; $('chat-input').value = '';
}
document.querySelectorAll('[data-care]').forEach(button => button.onclick = () => { if (button.dataset.care === 'play') openScreen('play'); else care(button.dataset.care); });
document.querySelectorAll('[data-trick]').forEach(button => button.onclick = () => performTrick(button.dataset.trick));
document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => { tab = button.dataset.tab; renderTab(); });
$('chat-form').onsubmit = event => { event.preventDefault(); chat($('chat-input').value); };
$('sound').onclick = () => { state.sound = !state.sound; if (!state.sound) stopActivitySounds(); if (!state.sound && window.TouNative) { window.TouNative.stop(); } if(!state.sound && 'speechSynthesis' in window) { ++speechTurn; speechSynthesis.cancel(); $('scene').classList.remove('talking'); } save(); render(); };
function renderSetup() {
  $('setup-name').textContent = $('pet-name').value.trim() || 'Pip';
  $('setup-pet').style.background = petColors[state.petColor][1];
  const box = $('setup-colors'); box.replaceChildren();
  for (const [key, [name, fill]] of Object.entries(petColors)) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'color-choice'; button.textContent = name;
    button.style.setProperty('--swatch', fill); button.setAttribute('aria-label', `${name} starting color`); button.setAttribute('aria-pressed', String(state.petColor === key));
    button.onclick = () => { state.petColor = key; save(); render(); renderSetup(); }; box.append(button);
  }
}
$('pet-name').oninput = () => { $('setup-name').textContent = $('pet-name').value.trim() || 'Pip'; };
let setupOriginalColor = state.petColor;
$('rename').onclick = () => { setupOriginalColor = state.petColor; $('welcome-title').textContent = 'Name & color'; $('start').textContent = 'Save changes ↗'; $('pet-name').value = state.name; $('cancel-setup').hidden = false; renderSetup(); $('welcome').showModal(); };
function cancelSetup() { state.petColor = setupOriginalColor; save(); render(); $('welcome').close(); }
$('cancel-setup').onclick = cancelSetup;
$('welcome').oncancel = event => { event.preventDefault(); if (state.started) cancelSetup(); };
function completeSetup() { state.name = $('pet-name').value.trim().slice(0,20) || 'Pip'; state.started = true; save(); render(); $('welcome').close(); say(`Hi! I’m ${state.name}. Tap Feed, Play, Clean or Rest to care for me.`); }
$('welcome-form').onsubmit = event => { event.preventDefault(); completeSetup(); };
$('start').onclick = event => { if (event) event.preventDefault(); completeSetup(); };
renderSetup();
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
  let listening = false; const recognition = new Recognition(); recognition.lang = navigator.language || 'en-GB'; recognition.interimResults = false;
  $('voice').onclick = () => { if (listening) { recognition.stop(); return; } try { recognition.start(); } catch { $('chat-hint').textContent = 'The mic is busy. Try again in a moment, or type below.'; } };
  recognition.onstart = () => { listening = true; $('voice').classList.add('listening'); $('chat-hint').textContent = 'Listening… tell me a little something. Tap the mic to stop.'; };
  recognition.onresult = event => chat(event.results[0][0].transcript);
  recognition.onerror = event => { $('chat-hint').textContent = event.error === 'not-allowed' ? 'Allow microphone access in your browser settings, or type a message.' : 'I couldn’t hear that. Try again, or type a message.'; };
  recognition.onend = () => { listening = false; $('voice').classList.remove('listening'); };
} else { $('voice').onclick = () => { $('chat-hint').textContent = window.TouNative ? 'Voice input isn’t available in this Android game. Type a message to chat with Pip.' : 'Voice input isn’t supported in this browser. Try Safari on iPhone, or type a message.'; $('chat-input').focus(); }; }
decay(); render(); if (!state.started) $('welcome').showModal();
if (window.TouPlatform || window.TouNative) { $('welcome').querySelector('small').textContent = 'Progress saves automatically. Play even without Wi-Fi.'; }
setInterval(() => { decay(); render(); },60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { decay(); render(); } else { stopActivitySounds(); if ('speechSynthesis' in window) speechSynthesis.cancel(); } });
if (!window.TouPlatform && !window.TouNative && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
