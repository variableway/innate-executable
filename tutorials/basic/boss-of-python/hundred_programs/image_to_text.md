# Image to text

_Source notebook: `100-programs/image_to_text.ipynb`._

## 115. Extract Text from Image

`pip install pytesseract -q`

```python
import pytesseract
print(pytesseract.image_to_string('hi.png'))
```

Output:

```
Hi WY, | am Afiz.
Follow me if you want to learn

1. Pythen
2. Data science
3. ME
```

Note: Windows users download `tesseract` and set the tesseract executable location to pytesseract library

`pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'`
