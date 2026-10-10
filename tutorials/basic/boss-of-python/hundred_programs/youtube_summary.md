# Youtube summary

_Source notebook: `100-programs/94_youtube_summary.ipynb`._

```python
%pip install -U youtube-dl

def download_youtube_vide(url):
    # see the actual code to download YouTube videos here:
    # https://github.com/afizs/be-theboss-in-python/blob/main/100-programs/95_transcribe_video.ipynb
    return 'audio_book.mp3'
    
def upload_audiofile_to_assemblyai(file):
    import requests
    from config import api_key
    filename = "audio_book.mp3"
    def read_file(filename, chunk_size=5242880):
        with open(filename, 'rb') as _file:
            while True:
                data = _file.read(chunk_size)
                if not data:
                    break
                yield data

    headers = {'authorization': api_key}
    response = requests.post('https://api.assemblyai.com/v2/upload',
                            headers=headers,
                            data=read_file(filename))

    return response.json().get('upload_url')
```

## 106. Summarize YouTube Videos 📺

```python
from config import api_key
import requests
from pprint import pprint
from time import sleep

# 1️⃣ Download YouTube video as mp3
audio_file = download_youtube_vide("https://www.youtube.com/watch?v=hfRMHvUaI")

# 2️⃣ Upload Audio file to AssemblyAI
audio_url = upload_audiofile_to_assemblyai(audio_file)

# 3️⃣ Submit the audio url for transcription 

endpoint = "https://api.assemblyai.com/v2/transcript"

headers = {
    'authorization': api_key, 
    'content-type': 'application/json'}

body = { 'audio_url': audio_url,
          'auto_chapters': True}

# ✅ Submitting Files for Transcription
res = requests.post(endpoint, json=body, headers=headers)
transcript_id = res.json().get('id')
print(f'{transcript_id = }')

# ✅ Getting the Transcription Result
endpoint_full = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
status = 'processing'
while status != 'completed':
    print('Getting the transcription result ....')
    sleep(5)
    res_text = requests.get(endpoint_full, headers=headers)
    status = res_text.json().get('status')
```

```python
res_text.json().get('chapters')
```

Output:

```
[{'summary': 'Alice is tired of sitting by her sister on the bank and has nothing to do. She peeks into the book her sister is reading but finds it boring. Alice is considering making a daisy chain when a white rabbit with pink eyes runs close by her and takes a watch out of its waistcoat pocket. Alice runs after it and falls down a rabbit hole under the hedge.',
  'headline': 'A white rabbit with pink eyes runs close to Alice and takes a watch out of its waistcoat pocket.',
  'gist': 'A rabbit in the hedge.',
  'start': 70,
  'end': 90720}]
```
