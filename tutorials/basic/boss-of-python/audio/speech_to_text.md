# Speech to text

_Source notebook: `audio_processing_in_Python/01_speech_to_text.ipynb`._

## 1. Speech to Text using Python🎤

```python
import requests
from pprint import pprint
from time import sleep
from config import ASSEMBLY_AI_TOKEN as api_key

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
/home/studio-lab-user/.conda/envs/default/lib/python3.9/site-packages/requests/__init__.py:102: RequestsDependencyWarning: urllib3 (1.26.13) or chardet (5.0.0)/charset_normalizer (2.0.12) doesn't match a supported version!
  warnings.warn("urllib3 ({}) or chardet ({})/charset_normalizer ({}) doesn't match a supported "
transcript_id = '6km8tavygz-0570-4a28-b98a-7e066f83fc05'
Getting the transcription result ....
Getting the transcription result ....
Getting the transcription result ....
Getting the transcription result ....
('The following is the short story Innocence by Honoree Debalzac, presented by '
 'listen to Genius.com, narrated by Mel Foster by the double crest of my foul '
 "and by the rose lining of my sweetheart's slipper, by all the horns of well "
 'beloved cuckolds, and by the virtue of their blessed wives. The finest work '
 'of man is neither poetry, nor painted pictures, nor music, nor castles, nor '
 'statues, be they carved never so well, nor rowing, nor sailing galleys. But '
 'children, understand me, children up to the age of ten years, for after that '
 'they become men or women, and cutting their wisdom teeth are not worth what '
 'they cost. The worst are the best. Watch them playing prettily and '
 'innocently with slippers. Above all, cancellated ones with the household '
 'utensils, leaving that which displeases them, crying after that which '
 'pleases them, munching the sweets and confectionery in the house, nibbling '
 'at the stores, and always laughing as soon as their teeth are cut. And you '
 'will agree with me that they a')
```
