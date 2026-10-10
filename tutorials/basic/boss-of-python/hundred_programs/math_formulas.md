# Math formulas

_Source notebook: `100-programs/86_math_formulas.ipynb`._

#### ⚡️ LaTeX math description from Python functions

```python
%pip install latexify-py -q
```

```python
import math
import latexify
```

```python
@latexify.with_latex
def solve(a, b, c):
  return (-b + math.sqrt(b**2 - 4*a*c)) / (2*(a+b))
solve
```

Output:

```
<latexify.core.with_latex.<locals>._LatexifiedFunction at 0x7f60b81aa580>
```

```python
@latexify.with_latex
def sinc(x):
  if x == 0:
    return 1
  else:
    return math.sin(x) / x

sinc
```

Output:

```
<latexify.core.with_latex.<locals>._LatexifiedFunction at 0x7f60b8255dc0>
```

```python
# Some math symbols are converted automatically.
@latexify.with_latex
def greek(alpha, beta, gamma, Omega):
  return alpha * beta + math.gamma(gamma) + Omega

greek
```

Output:

```
<latexify.core.with_latex.<locals>._LatexifiedFunction at 0x7f60b81aa850>
```
