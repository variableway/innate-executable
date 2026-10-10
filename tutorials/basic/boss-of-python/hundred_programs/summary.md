# Summary

_Source notebook: `100-programs/97_summary.ipynb`._

# 103. Summarize Any Book 📚

```python
%pip install transformers -q
%pip install pdfplumber -q
```

```python
import pdfplumber as pp

def get_book_data(book_name):
    all_data = ''
    with pp.open(book_name) as book:
        for page_no, page in enumerate(book.pages, start=1):
            data = page.extract_text()
            all_data += data
    return all_data
```

```python
from transformers import pipeline

book_content = get_book_data('example.pdf')

classifier = pipeline("summarization")
summary = classifier(book_content)
```

```python
print(summary[0]['summary_text'])
```

Output:

```
 Alice was beginning to get tired of sitting by her sister on the bank, and of having nothing to do . She was considering in her own mind whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies . A White Rabbit with pink eyes ran close by her and took a watch out of its waistcoat-pocket, and looked at it, and then hurried on . Alice was just in time to see it pop down a large rabbit-hole under the hedge .
```

🟢 Hope you like this program! 📚  
🟡 Follow → @itsafiz
