# Remove bg image

_Source notebook: `100-programs/87_remove_bg_image.ipynb`._

### 113. Remove Image Background in 2 lines using Python

```python
%pip install rembg -q
```

Output:

```

[1m[[0m[34;49mnotice[0m[1;39;49m][0m[39;49m A new release of pip available: [0m[31;49m22.2.2[0m[39;49m -> [0m[32;49m22.3.1[0m
[1m[[0m[34;49mnotice[0m[1;39;49m][0m[39;49m To update, run: [0m[32;49mpip install --upgrade pip[0m
Note: you may need to restart the kernel to use updated packages.
```

```python
from rembg import remove
from PIL import Image
```

Output:

```
/home/studio-lab-user/.conda/envs/default/lib/python3.9/site-packages/requests/__init__.py:102: RequestsDependencyWarning: urllib3 (1.26.9) or chardet (5.0.0)/charset_normalizer (2.0.12) doesn't match a supported version!
  warnings.warn("urllib3 ({}) or chardet ({})/charset_normalizer ({}) doesn't match a supported "
```

```python
without_bg = remove(Image.open('puppy.png'))
without_bg.save('puppy_out.png')
```

```python
from rembg import remove
from PIL import Image
without_bg = remove(Image.open('sanju.jpeg'))
without_bg.save('sanju_out.png')
```
