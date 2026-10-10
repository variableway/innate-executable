# Edge detection

_Source notebook: `image-processing/edge_detection.ipynb`._

## Edge detection using Python

`sobel` function is used to detect edges in the image

```python
# import soble function from filter module
from skimage.filters import sobel

# import data module from skimage
from skimage import data

# load coins image from data, You can use your own image
coins = data.coins()

# apply sobel function on coins image
edges = sobel(coins)

# display original and edges image 
image_comparison(coins, edges)
```

Output:

```
<Figure size 1728x1296 with 2 Axes>
```

### `image_comparison` function code

```python
import matplotlib.image as img
import matplotlib.pyplot as plt

def image_comparison(original, filtered, title_f='Edges'):
    fig, (ax1, ax2) = plt.subplots(ncols=2, figsize=(24,18), sharex=True, sharey=True)
    ax1.imshow(original, cmap=plt.cm.gray)
    ax1.set_title('original')
    ax1.axis('off')
    ax2.imshow(filtered, cmap=plt.cm.gray)
    ax2.set_title(title_f)
    ax2.axis('off')
```
