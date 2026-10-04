"""Create a voiced six-syllable la-la-la clip with formant synthesis."""
import math, struct, wave
from pathlib import Path
rate=22050
samples=[0.] * int(rate*2.4)
for start,pitch in [(0,262),(.3,294),(.6,330),(1.1,330),(1.4,294),(1.7,262)]:
    filters=[[0.,0.] for _ in range(3)]
    phase=0.
    for j in range(int(.29*rate)):
        t=j/rate
        phase+=(pitch*(1+.012*math.sin(2*math.pi*5*t)))/rate
        phase%=1
        # A harmonic-rich voiced source, softened to remove sharp buzz.
        source=sum(math.sin(2*math.pi*phase*k)/(k**1.6) for k in range(1,24))
        blend=min(1,t/.065)
        formants=[350+450*blend,1100+150*blend,2600]
        value=0.
        for i,(freq,band,gain) in enumerate(zip(formants,[100,130,180],[1,.6,.18])):
            radius=math.exp(-math.pi*band/rate)
            a=2*radius*math.cos(2*math.pi*freq/rate)
            y=(1-radius)*source+a*filters[i][0]-radius*radius*filters[i][1]
            filters[i][1]=filters[i][0];filters[i][0]=y
            value+=y*gain
        envelope=min(1,t/.02)*min(1,(.29-t)/.045)
        samples[int(start*rate)+j]=value*envelope
peak=max(map(abs,samples));samples=[s*.72/peak for s in samples]
with wave.open(str(Path(__file__).resolve().parents[1]/'public/audio/dancing.wav'),'wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
    w.writeframes(b''.join(struct.pack('<h',round(s*32767)) for s in samples))
print('Generated 2.4-second voiced dance clip.')
