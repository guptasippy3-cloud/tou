package com.tou.petgame;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TouSpeechPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
