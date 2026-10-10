# Multiple progressbar

_Source notebook: `100-programs/92_multiple_progressbar.ipynb`._

## 108. Multiple Progress Bars in Jupyter Notebook

```python
%pip install tqdm -q
```

```python
from time import sleep
from tqdm.notebook import trange

for i in trange(5, desc='Extract Data from Home Page'):
    sleep(0.1)
    for x in trange(100, desc=f'Child Page {i}'):
        sleep(0.05)
```

Output:

```
Extract Data from Home Page:   0%|          | 0/5 [00:00<?, ?it/s]
Child Page 0:   0%|          | 0/100 [00:00<?, ?it/s]
Child Page 1:   0%|          | 0/100 [00:00<?, ?it/s]
Child Page 2:   0%|          | 0/100 [00:00<?, ?it/s]
Child Page 3:   0%|          | 0/100 [00:00<?, ?it/s]
Child Page 4:   0%|          | 0/100 [00:00<?, ?it/s]
```

🟢 Hope you like this program! 📚  
🟡 Follow → @itsafiz  
🟢 100 Programs: https://github.com/afizs/be-theboss-in-python
