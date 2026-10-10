# Image processing

_Source notebook: `image-processing/image_processing.ipynb`._

```python
import matplotlib.image as img
import matplotlib.pyplot as plt

# reading the image
dog = img.imread('puppy.png')

# show all the images
def show_images(image_1, image_2, image_3):
    fig, (ax0, ax1, ax2) = plt.subplots(ncols=3, figsize=(8, 2))
    ax0.imshow(image_1)
    ax0.set_title("RGB image")
    # ax0.axis('off')
    ax1.imshow(image_2)
    ax1.set_title("Hue channel")
    # ax1.axis('off')
    ax2.imshow(image_3)
    ax2.set_title("Value channel")
    # ax2.axis('off')

    fig.tight_layout()
```

### Rotating Images in Python

```python
from skimage.transform import rotate 
from matplotlib import patches
```

```python
# rotate image 90 degrees clockwise
dog_rotated_90 = rotate(dog, -90)

# rotate image 180 degrees clockwise
dog_rotated_180 = rotate(dog, -180)

# Display all the images
show_images(dog, dog_rotated_90, dog_rotated_180)
```

Output:

```
<Figure size 576x144 with 3 Axes>
```

Follow me @itsafiz for more Python content.🚀

```python
def show_detected_face(result, detected, title='Face Image'):
    plt.imshow(result)
    img_des = plt.gca()
    plt.title(title)
    plt.axis('off')
    for patch in detected:
        img_des.add_patch(
            patches.Rectangle(
                (patch['c'], patch['r']),
                patch['width'],
                patch['height'], fill=False, color='y', linewidth=3)
        )
    plt.show()  
```

### Face Detection

```python
from skimage import data
```

```python
# import the classifier class
from skimage.feature import Cascade

# load the trained file from the module
trained_file = data.lbp_frontal_face_cascade_filename()

# initialize the detector cascade
detector = Cascade(trained_file)
```

```python
# read the image
rrr = img.imread('rrr.png')
```

```python
# detect the faces in the image using detect multi_scale method

detected = detector.detect_multi_scale(img=rrr, 
                                       scale_factor=1.2,
                                       step_ratio=1, 
                                       min_size=(10, 10),
                                       max_size=(200, 200))
```

```python
show_detected_face(rrr, detected)
```

Output:

```
<Figure size 432x288 with 1 Axes>
```
