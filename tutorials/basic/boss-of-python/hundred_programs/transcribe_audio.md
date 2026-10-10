# Transcribe audio

_Source notebook: `100-programs/96_transcribe_audio.ipynb`._

## 104. Audio to Text Transcription 🔊

```python
import requests
from pprint import pprint
from time import sleep
from config import api_key

audio_url = 'https://listentogenius.com/recordings4/Innocence.mp3'
endpoint = "https://api.assemblyai.com/v2/transcript"

headers = {
    'authorization': api_key, 
    'content-type': 'application/json'
}

body = { 'audio_url': audio_url}

# 1. Submitting Files for Transcription

res = requests.post(endpoint, json=body, headers=headers)
transcript_id = res.json().get('id')
print(f'{transcript_id = }')

# 2. Getting the Transcription Result

endpoint_full = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
status = 'processing'
while status != 'completed':
    print('Getting the transcription result ....')
    sleep(5)
    res_text = requests.get(endpoint_full, headers=headers)
    status = res_text.json().get('status')
data = res_text.json().get('text')
pprint(data[:1000])
```

Output:

```
transcript_id = 'rep1x1zkm2-c2eb-497f-91c8-f28ec67bcffc'
Getting the transcription result ....
('The following is the short story Innocence by Honore de Balzac presented by '
 'listen to Genius.com narrated by Mel Foster by the double crest of my fowl '
 "and by the rose lining of my sweetheart's slipper, by all the horns of well "
 'beloved cuckolds, and by the virtue of their blessed wives. The finest work '
 'of man is neither poetry, nor painted pictures, nor music, nor castles, nor '
 'statues, be they carved never so well, nor rowing, nor sailing galleys. But '
 'children, understand me, children up to the age of ten years, for after that '
 'they become men or women, and cutting their wisdom teeth are not worth what '
 'they cost. The worst are the best. Watch them playing prettily and '
 'innocently with slippers above all, cancellated ones with the household '
 'utensils, leaving that which displeases them, crying after that which '
 'pleases them, munching the sweets and confectionery in the house, nibbling '
 'at the stores, and always laughing as soon as their teeth are cut. And you '
 'will agree with me that they are ')
```
