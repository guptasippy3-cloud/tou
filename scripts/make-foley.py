"""Create original animated-pet foley without external recordings."""
import math, random, struct, wave
from pathlib import Path
rate = 22050
random.seed(73)
out = Path(__file__).resolve().parents[1] / 'public/audio'
out.mkdir(exist_ok=True)
def render(name, length, events):
    samples = [0.] * int(rate * length)
    for kind, start, duration, volume in events:
        low = 0.; previous = 0.
        for j in range(int(duration * rate)):
            t = j / rate; x = t / duration
            n = random.uniform(-1,1); low += .12 * (n-low); high = n-previous; previous=n
            envelope = math.sin(math.pi*x)**1.5
            if kind.startswith('bell:'):
                freq = float(kind.split(':')[1])
                envelope = min(1,t/.01)*math.exp(-6*t)
                texture = .5*math.sin(2*math.pi*freq*t)+.12*math.sin(2*math.pi*freq*2.01*t)
            elif kind.startswith('pop:'):
                freq = float(kind.split(':')[1])
                envelope = min(1,t/.006)*math.exp(-18*t)
                texture = .55*math.sin(2*math.pi*(freq*t-freq*.6*t*t))+low*.08
            elif kind == 'cozy':
                # Soft little character hum with a rounded vowel spectrum.
                fundamental = 180 + 25*math.sin(math.pi*x)
                texture = sum(math.sin(2*math.pi*fundamental*k*t)*math.exp(-((fundamental*k-650)/500)**2)/k for k in range(1,9))*.35
            elif kind == 'snore':
                texture = low*.4 + .08*math.sin(2*math.pi*95*t)*(.5+.5*math.sin(2*math.pi*5*t))
            elif kind == 'crunch':
                envelope = (1-x)**2 * min(1,t/.008)
                texture = .2*high + .5*low
                texture *= .25 + .75*(random.random() > .67)
            elif kind == 'chew':
                texture = low*.7 + math.sin(2*math.pi*(110*t-35*t*t))*math.exp(-18*t)*.2
            elif kind == 'water':
                texture = .65*low + .14*n
                envelope *= .65+.35*math.sin(2*math.pi*5*t)**2
            elif kind == 'bubble':
                envelope = min(1,t/.004)*math.exp(-25*t)
                texture = math.sin(2*math.pi*(750*t+1000*t*t))*.35+low*.15
            elif kind == 'breath':
                texture = low*.7+n*.04
            elif kind == 'rustle':
                texture = high*.14+low*.4
                envelope *= .4+.6*math.sin(2*math.pi*13*t)**2
            elif kind == 'foot':
                envelope = min(1,t/.003)*math.exp(-30*t)
                texture = math.sin(2*math.pi*85*t)*.5*math.exp(-22*t)+low*.7+high*.05
            elif kind == 'swish':
                texture = low*.8+n*.08
            index = int(start*rate)+j
            if index < len(samples): samples[index] += texture*envelope*volume
    peak=max(max(abs(s) for s in samples), .001)
    # Normalize only loud clips; leave breathing soft.
    scale=min(1,.65/peak)
    with wave.open(str(out / (name+'.wav')),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
        w.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,s*scale))*32767)) for s in samples))
if __name__ == '__main__':
    render('eating',1.8,[(kind,start,d,v) for start in [0,.45,.95,1.35] for kind,d,v in [('crunch',.15,.5),('chew',.28,.65)]])
    render('washing',2.1,[('water',0,1.9,.8)]+[('bubble',t,.15,.4) for t in [.2,.42,.8,1.2,1.55]])
    render('sleeping',2.7,[('rustle',0,.35,.25),('breath',.3,.9,.65),('breath',1.4,1.1,.45)])
    render('waking',1.2,[('breath',0,.7,.6),('rustle',.5,.6,.45)])
    render('hop',.85,[('rustle',0,.18,.4),('swish',.12,.24,.45),('foot',.48,.22,.9)])
    # Twirl is generated separately by make-magic.py.
    # Dancing uses a generated Samantha 'la la la' voice clip.
    print('Generated five original foley WAV files.')
