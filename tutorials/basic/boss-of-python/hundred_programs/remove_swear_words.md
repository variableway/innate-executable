# Remove swear words

_Source notebook: `100-programs/91_remove_swear_words.ipynb`._

## 109. Remove Swear words from YouTube video

### 1️. Download YouTube Video as MP3 🟡

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
    ydl.download(['https://www.youtube.com/watch?v=XByiHpUvrj0'])
```

Output:

```
[youtube] XByiHpUvrj0: Downloading webpage
[download] Destination: XByiHpUvrj0.m4a
[download] 100% of 1.86MiB in 00:3670KiB/s ETA 00:007
[ffmpeg] Correcting container in "XByiHpUvrj0.m4a"
[ffmpeg] Destination: XByiHpUvrj0.mp3
Deleting original file XByiHpUvrj0.m4a (pass -k to keep)
```

### 2. Upload MP3 to AssemblyAI 🟢  
🟢 Hope you like this program! 📚  
🟡 Follow → @itsafiz

```python
import requests
from config import api_key
filename = "XByiHpUvrj0.mp3"
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
{'upload_url': 'https://cdn.assemblyai.com/upload/ad6ef570-41f6-4fce-8544-e572324d58af'}
```

### 3. Submit the Audio URL and remove swear words 🔥

```python
from pprint import pprint
from time import sleep

audio_url = 'https://cdn.assemblyai.com/upload/ad6ef570-41f6-4fce-8544-e572324d58af'
endpoint = "https://api.assemblyai.com/v2/transcript"

headers = {
    'authorization': api_key, 
    'content-type': 'application/json'
}

body = { 'audio_url': audio_url, 
        'filter_profanity': True } # 👈

# 1. Submitting Files for Transcription

res = requests.post(endpoint, json=body, headers=headers)
transcript_id = res.json().get('id')
print(f'{transcript_id = }')

# 2. Getting the Transcription Result

endpoint_full = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
status = 'processing'
while status != 'completed':
    sleep(5)
    res_text = requests.get(endpoint_full, headers=headers)
    status = res_text.json().get('status')
data = res_text.json().get('text')
pprint(data)
```

Output:

```
transcript_id = 'ro3d6956j4-e21b-4ee0-aaad-222c0e9cf368'
("Swear words. They're the most popular and alluring taboos we have. But the "
 'secrets to their strange power have been shrouded in mystery until now. Join '
 'me on a journey through the history, evolution and cultural impact of swear '
 "words. Words don't start out as swear words. They're just words. Somebody "
 "decided at some point that this is a swear word. There's an acronymic "
 'etymology fornication under consent is the case. This household has been '
 'given my consent to fight it is total horseshit. Imagine you can call the '
 "words that you could be called so often that doesn't mean anything to you "
 "anymore, taking that negative and inverting it. What's the intention of the "
 "speaker? And what's the reception of the hero? My dog's a b****, but I never "
 "call her that. Who you calling a b****? I call her a con. There's something "
 'innately human about swearing. More conservative people try and invalidate '
 'people they disagree with by, like, pointing to their language. French '
 "advisory sticker to me. Was implicitly racist. Who's deciding these are bad "
 "words? Who did it? We're going to do an experiment. There are scientific "
 'studies that say that you feel better when you swear. You can hold your hand '
 "in a bucket of nearly freezing water about 50% longer if you're swearing. "
 "And if you're not, s***. I think there's a need now for swearing and "
 "profanity more than any other time. The power of cursing. Like it's "
 "important. The release. That's really what profanity gives it. Oh, yeah. I'm "
 "Nicholas Cage. Let's get f*****.")
```

🟢 Hope you like this program! 📚  
🟡 Follow → @itsafiz
