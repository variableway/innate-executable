# Any function

_Source notebook: `basics/any_function.ipynb`._

## `any()` function in Python

`any()` function returns `True` if any one of the elements of iterable is `True`.   
If not, it returns `False`

**syntax**: `any(iterable)`

### 1. `any()` on Python Lists 

```python
numbers = [1,2,3,4,5,6,0]

any(numbers)
```

Output:

```
True
```

```python
all_zeros = [0, 0, 0, 0, 0]
any(all_zeros)
```

Output:

```
False
```

```python
all_zeros_except_one = [0,0,0,0,1,0,0]
any(all_zeros_except_one)
```

Output:

```
True
```

```python
all_false = [False, False, False]
any(all_false)
```

Output:

```
False
```

🟢 Hope you like the content. 
🟡 Follow me @itsafiz

## 2. `any()` on string

```python
s = 'Python'
any(s)
```

Output:

```
True
```

```python
s = '00000'
any(s) # '0' is True
```

Output:

```
True
```

Converting all the string characters into Integer 👇

```python
z = [int(c) for c in s]
any(z)
```

Output:

```
False
```

## 3. `any()` on Dictionary

```python
d = {'name': 'Rayan', 'age': 4}
any(d) # checks if any of the key is True
```

Output:

```
True
```

```python
d = {0: 'Rayan', 1: 4}
# keys of d -> [0, 1] 
any(d) # checks if any of the key is True
```

Output:

```
True
```

```python
d = {0: True}
any(d) # checks [0]
```

Output:

```
False
```

```python
d = {False: 1000}
any(d)
```

Output:

```
False
```
