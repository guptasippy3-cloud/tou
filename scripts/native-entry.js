import { Capacitor, registerPlugin } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
const KEY = 'tou-pet-v1';
const NativeSpeech = registerPlugin('TouSpeech');
async function start() {
  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('native-game');
    window.TouPlatform = Capacitor.getPlatform();
    const saved = await Preferences.get({ key: KEY });
    if (saved.value) localStorage.setItem(KEY, saved.value);
    let writes = Promise.resolve();
    window.TouSave = value => {
      writes = writes.catch(() => {}).then(() => Preferences.set({ key: KEY, value })).catch(() => {
        document.querySelector('.saved').textContent = 'Save failed — keep the game open and try again';
      });
    };
    if (window.TouPlatform === 'android') {
    window.TouNative = {
      voices: [],
      save: window.TouSave,
      speak(options) { return NativeSpeech.speak(options); },
      stop() { return NativeSpeech.stop().catch(() => {}); }
    };
    try { window.TouNative.voices = (await Promise.race([NativeSpeech.getVoices(), new Promise(resolve => setTimeout(() => resolve({ voices: [] }), 4000))])).voices; } catch {}
    await NativeSpeech.addListener('speaking', ({ active }) => document.getElementById('scene').classList.toggle('talking', active));
    }
    await App.addListener('appStateChange', ({ isActive }) => { if (!isActive) { if (window.TouNative) window.TouNative.stop();
      if ('speechSynthesis' in window) speechSynthesis.cancel(); const audio = document.getElementById('pip-recording'); if (audio) audio.pause(); } });
    if (window.TouPlatform === 'android') await App.addListener('backButton', () => {
      const dialog = document.getElementById('welcome');
      if (dialog.open) { if (JSON.parse(localStorage.getItem(KEY) || '{}').started) dialog.close(); return; }
      if (document.body.dataset.screen !== 'care') document.querySelector('button[data-screen="care"]').click();
      else App.minimizeApp();
    });
  }
  const script = document.createElement('script'); script.src = 'app.js'; document.body.append(script);
}
start().catch(() => { document.getElementById('speech').textContent = 'Unable to load your saved game. Please close and reopen Tou.'; });
