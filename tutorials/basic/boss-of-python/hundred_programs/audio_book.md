# Audio book

_Source notebook: `100-programs/98_audio_book.ipynb`._

### 102. Create Your Audiobook in Python ⚡️

```python
%pip install pyttsx3 -q
%pip install pdfplumber -q
```

```python
import pyttsx3
import pdfplumber as pp

engine = pyttsx3.init()

all_the_data = ''
with pp.open('book.pdf') as book:
    for page_no, page in enumerate(book.pages, start=1):
        data = page.extract_text()
        all_the_data += data

engine.save_to_file(all_the_data, 'audio_book.mp3')
engine.runAndWait()
engine.stop()
```

🟢 Hope you like this program! 📚
🟡 Follow → @itsafiz
✅ Note: Run this program on your local system
