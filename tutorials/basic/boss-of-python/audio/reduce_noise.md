# Reduce noise

_Source notebook: `audio_processing_in_Python/02_reduce_noise.ipynb`._

## How to Reduce Noise using Python

```python
!pip install noisereduce -q
```

```python
from scipy.io import wavfile
import noisereduce as nr
# load data
rate, data = wavfile.read("mywav.wav")
# perform noise reduction
reduced_noise = nr.reduce_noise(y=data, sr=rate)
wavfile.write("mywav_reduced_noise.wav", rate, reduced_noise)
```

For More advanced options: 
https://github.com/timsainb/noisereduce

Follow me for more Python and ML content!
