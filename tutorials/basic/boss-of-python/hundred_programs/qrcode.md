# Qrcode

_Source notebook: `100-programs/80_qrcode.ipynb`._

## How to generate QR code?

```python
import qrcode

# Create a QR code instance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data('https://x.com/python_spaces')
qr.make(fit=True)

# Generate an image
img = qr.make_image(fill_color="black", back_color="white")
```

```python
img
```

Output:

```
<qrcode.image.pil.PilImage at 0x7f6e8c2a5040>
```
