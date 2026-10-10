# Built in functions

_Source notebook: `basics/built_in_functions.ipynb`._

# Built-in Functions in Python

### `round()`

The `round()` function returns a floating-point number rounded to the specified number of decimals

**syntax**: `round(number, number_of_decimals)`

```python
x = 13.55
round(x)
```

Output:

```
14
```

```python
a = 3.8898
round(a, 3)
```

Output:

```
3.89
```

### `set()`

The `set()` function is used to create a set in Python. 

**syntax**: `set(iterable)`

```python
number = [1,2,3,4,5]
set(number)
```

Output:

```
{1, 2, 3, 4, 5}
```

```python
duplicate_numbers = [1,2,3,4,2,9,1]
set(duplicate_numbers)
```

Output:

```
{1, 2, 3, 4, 9}
```

### `slice()`

The `slice()` function returns a slice object that is used to slice any sequence (string, tuple, list, etc..)

**syntax**: `slice(start, stop, step)`

```python
numbers = [1,2,3,4,5,6,7,8,9]
slice_numbers = slice(2) # it is equalant to 0:2
numbers[slice_numbers]
```

Output:

```
[1, 2]
```

```python
s = 'function returns a slice object that is used to slice any sequence'
slice_text = slice(5, 20) # starting from 5th character to 20th character
s[slice_text]
```

Output:

```
'ion returns a s'
```

```python
s = 'function returns a slice object that is used to slice any sequence'
slice_text = slice(5, 20, 3) # starting from 5th character to 20th character, every 3rd char
s[slice_text]
```

Output:

```
'i tna'
```

### `sorted()`

The `sorted()` function is used to sort the iterables like list, tuples and strings. 

**syntax**: `sorted(iterable, Key=None, reverse=False)`

```python
numbers = [11, 14, 21, 12, 8, 2]
sorted(numbers)
```

Output:

```
[2, 8, 11, 12, 14, 21]
```

sort the numbers in descending order

```python
numbers = [11, 14, 21, 12, 8, 2]
sorted(numbers, reverse=True)
```

Output:

```
[21, 14, 12, 11, 8, 2]
```

**sort the words based on the length of the word**

```python
words = ['apple', 'ball', 'cat', 'dog', 'fish', 'chocolate', 'mobile']

sorted(words, key=len)
```

Output:

```
['cat', 'dog', 'ball', 'fish', 'apple', 'mobile', 'chocolate']
```

More examples on sorted in the future threads 🧵
