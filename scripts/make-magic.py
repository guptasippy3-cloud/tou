"""Generate an original sparkling chime for the twirl animation."""
import math, wave, struct
from pathlib import Path
rate=22050
samples=[0.] * int(1.6*rate)
for start,freq in [(0,1046.5),(.12,1318.5),(.24,1568),(.36,2093),(.5,2637),(.68,3136)]:
    for i in range(int(.85*rate)):
        t=i/rate
        envelope=min(1,t/.007)*math.exp(-7*t)
        shimmer=math.sin(2*math.pi*freq*t)+.28*math.sin(2*math.pi*freq*2.76*t)+.12*math.sin(2*math.pi*freq*4.07*t)
        j=int(start*rate)+i
        if j<len(samples):samples[j]+=.2*envelope*shimmer
with wave.open(str(Path(__file__).resolve().parents[1]/'public/audio/twirl.wav'),'wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
    w.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,v))*32767)) for v in samples))
