# Transcribe video

_Source notebook: `100-programs/95_transcribe_video.ipynb`._

## 105. Generate Subtitles for YouTube Video

```python
import youtube_dl

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'outtmpl': '%(id)s.%(ext)s',
}
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=BaW_jenozKc'])
```

```python
import requests
from config import api_key
filename = "BaW_jenozKc.mp3"
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

print(response.json())
```

Output:

```
{'upload_url': 'https://cdn.assemblyai.com/upload/c0afa8a7-09d5-4fe5-8fb6-4a22be40ce12'}
```

🟢 Hope you like this program! 📚  
🟡 Follow → @itsafiz

```python
import requests
from config import api_key
filename = "BaW_jenozKc.mp3"
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

print(response.json())
```

Output:

```
{'upload_url': 'https://cdn.assemblyai.com/upload/c0afa8a7-09d5-4fe5-8fb6-4a22be40ce12'}
```

```python
from pprint import pprint
from time import sleep

audio_url = 'https://cdn.assemblyai.com/upload/c0afa8a7-09d5-4fe5-8fb6-4a22be40ce12'
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
transcript_id = 'remn3gxlay-66a1-450f-adca-f899954f69c0'
Getting the transcription result ....
Getting the transcription result ....
('This is a test video for you to BL. For more information, contact PH. '
 'Ihagsphihag Dot.')
```
