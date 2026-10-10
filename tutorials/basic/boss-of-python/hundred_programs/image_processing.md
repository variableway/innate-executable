# Image processing

_Source notebook: `100-programs/81_image_processing.ipynb`._

## Image Processing in Python

```python
from skimage import data, color
from tools import show_image
```

```python
rocket = data.rocket()
show_image(rocket)
```

Output:

```
<Figure size 432x288 with 1 Axes>
```

```python
rocket_gray = color.rgb2gray(rocket)
show_image(rocket_gray)
```

Output:

```
<Figure size 432x288 with 1 Axes>
```

## Grayscale to Color

```python
color_rocket = color.gray2rgb(rocket_gray)
show_image(color_rocket)
```

Output:

```
<Figure size 432x288 with 1 Axes>
```

```python
import matplotlib.pyplot as plt
plt.imshow(color_rocket)
plt.show()
```

Output:

```
<Figure size 432x288 with 1 Axes>
```
