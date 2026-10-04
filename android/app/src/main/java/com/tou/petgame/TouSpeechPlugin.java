package com.tou.petgame;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.*;

@CapacitorPlugin(name = "TouSpeech")
public class TouSpeechPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean ready;
    private boolean initialized;
    private final List<PluginCall> waiting = new ArrayList<>();
    private String currentId = "";

    @Override public void load() {
        getActivity().runOnUiThread(() -> {
            tts = new TextToSpeech(getContext(), status -> {
                initialized = true;
                ready = status == TextToSpeech.SUCCESS;
                getActivity().runOnUiThread(() -> {
                    for (PluginCall call : waiting) {
                        if (ready) resolveVoices(call); else call.reject("Speech engine unavailable");
                    }
                    waiting.clear();
                });
            });
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                public void onStart(String id) { if (id.equals(currentId)) speaking(true); }
                public void onDone(String id) { if (id.equals(currentId)) speaking(false); }
                public void onError(String id) { if (id.equals(currentId)) speaking(false); }
                public void onStop(String id, boolean interrupted) { if (id.equals(currentId)) speaking(false); }
            });
        });
    }
    private void speaking(boolean active) {
        getActivity().runOnUiThread(() -> { JSObject value = new JSObject(); value.put("active", active); notifyListeners("speaking", value); });
    }
    @PluginMethod public void getVoices(PluginCall call) {
        getActivity().runOnUiThread(() -> { if (ready) resolveVoices(call); else if (initialized) call.reject("Speech engine unavailable"); else waiting.add(call); });
    }
    private void resolveVoices(PluginCall call) {
        JSArray voices = new JSArray();
        Set<Voice> installed = tts.getVoices();
        if (installed != null) for (Voice voice : installed) {
            if (voice.isNetworkConnectionRequired() || voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
            JSObject item = new JSObject(); item.put("name", voice.getName()); item.put("voiceURI", voice.getName());
            item.put("lang", voice.getLocale().toLanguageTag()); item.put("default", voice.equals(tts.getDefaultVoice())); voices.put(item);
        }
        JSObject result = new JSObject(); result.put("voices", voices); call.resolve(result);
    }
    @PluginMethod public void speak(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!ready) { call.reject("Speech engine unavailable"); return; }
            String text = call.getString("text", "");
            String requested = call.getString("voice", "");
            Voice chosen = null;
            Set<Voice> installed = tts.getVoices();
            if (installed != null) for (Voice voice : installed) {
                if (voice.isNetworkConnectionRequired() || voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                if (voice.getName().equals(requested)) { chosen = voice; break; }
                if (chosen == null && voice.getLocale().getLanguage().equals("en")) chosen = voice;
            }
            if (chosen == null) { call.reject("No installed offline English voice"); return; }
            tts.setVoice(chosen);
            tts.setPitch(Math.max(.5f, Math.min(2f, call.getFloat("pitch", 1.65f))));
            tts.setSpeechRate(Math.max(.5f, Math.min(1.5f, call.getFloat("rate", 1.02f))));
            Bundle params = new Bundle(); params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, Math.max(0f, Math.min(1f, call.getFloat("volume", .8f))));
            currentId = UUID.randomUUID().toString();
            if (tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, currentId) == TextToSpeech.ERROR) call.reject("Speech failed"); else call.resolve();
        });
    }
    @PluginMethod public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> { currentId = ""; if (tts != null) tts.stop(); speaking(false); call.resolve(); });
    }
    @Override protected void handleOnDestroy() { if (tts != null) { tts.stop(); tts.shutdown(); } }
}
