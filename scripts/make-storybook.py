"""Original whimsical animated-film care sounds. Preserves all trick audio."""
import importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('foley',Path(__file__).with_name('make-foley.py'))
foley=importlib.util.module_from_spec(spec)
spec.loader.exec_module(foley)
render=foley.render

render('eating',1.9,[('crunch',t,.12,.3) for t in [0,.32,.7,1.04]]+[('chew',t,.2,.5) for t in [.08,.4,.78,1.12]]+[('pop:240',.1,.16,.35),('pop:300',.75,.16,.25),('cozy',1.35,.38,.6),('bell:784',1.5,.35,.12)])
render('washing',2.1,[('water',0,1.65,.35)]+[(f'pop:{freq}',t,.2,.4) for t,freq in [(0.1,400),(.35,600),(.65,500),(.9,800),(1.15,1000)]]+[('bell:1046.5',1.45,.5,.22),('bell:1318.5',1.6,.45,.2),('bell:1568',1.75,.3,.16)])
render('sleeping',2.7,[('rustle',0,.35,.18),('cozy',.25,.6,.3),('bell:523.25',0,.6,.13),('bell:392',.3,.65,.1),('bell:261.63',.6,.8,.08),('breath',1.1,.75,.35),('snore',1.9,.65,.35)])
render('waking',1.65,[('cozy',0,.75,.45),('rustle',.25,.5,.2),('pop:350',.65,.18,.22),('bell:523.25',.72,.5,.18),('bell:659.25',.88,.5,.2),('bell:784',1.04,.55,.22)])
print('Updated eating, washing, sleeping, and waking with original storybook sounds.')
