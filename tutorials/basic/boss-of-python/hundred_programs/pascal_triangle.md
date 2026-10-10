# Pascal triangle

_Source notebook: `100-programs/101_pascal_triangle.ipynb`._

```python
# Pascal’s Triangle
# Pascal’s triangle is a pattern of the triangle which is based on nCr, below is the pictorial representation of Pascal’s triangle.

# Example:
# n = 5

#     1
#    1 1
#   1 2 1
#  1 3 3 1
# 1 4 6 4 1
```

Pascal’s triangle is a pattern of the triangle which is based on nCr, below is the pictorial representation of Pascal’s triangle.

```python
from math import factorial
```

```python
def pascal_triangle(n):

    triangle = []
    for i in range(n):
        row = []
        for j in range(i+1):
            # nCr = n!/((n-r)!*r!)
            row.append(factorial(i)//(factorial(j)*factorial(i-j)))
    
        # for new line
        triangle.append(row)
    return triangle
```

```python
pascal_triangle(3)
```

Output:

```
[[1], [1, 1], [1, 2, 1]]
```

```python
pascal_triangle(5)
```

Output:

```
[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
```

```python
pascal_triangle(7)
```

Output:

```
[[1],
 [1, 1],
 [1, 2, 1],
 [1, 3, 3, 1],
 [1, 4, 6, 4, 1],
 [1, 5, 10, 10, 5, 1],
 [1, 6, 15, 20, 15, 6, 1]]
```
