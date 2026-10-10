# Lists

_Source notebook: `basics/lists.ipynb`._

# Lists in Python 

Python list is an ordered sequence of items. We can store more than one   
item of different types in a list. Items in the list are accessed using the index. 

→ Make a list

```python
numbers = [1, 2, 3]

fruits = ['apple', 'banana']

mix_list = [3, 'python', 97, 2.1]
```

→ Access first item

```python
numbers[0]
```

Output:

```
1
```

→ Access last item

```python
numbers[-1]
```

Output:

```
5
```

### ✨ Get the index of the item  
returns the index of the given item

```python
numbers.index(4)
```

Output:

```
3
```

### 🟡 Add items using append

`append` method add the items at the end of the list as   
single item

```python
numbers.append(10)
numbers.append([1,2,3])
```

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 10, [1, 2, 3]]
```

🟡 Follow me @itsafiz 

### ✨ extend method  
extend method adds all the elements of an iterable(string, list, tuple) to the end of the list 

```python
numbers.extend([1,2,3])
```

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 10, [1, 2, 3], 1, 2, 3]
```

### ✨ insert method

insert method inserts the item/items at the given index. 

```python
numbers.insert(2,99)
numbers
```

Output:

```
[1, 2, 99, 3, 4, 5, 10, [1, 2, 3], 1, 2, 3]
```

### ✨ remove method

remove method deletes the first matching item from the list

```python
numbers.remove(99)
```

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 10, [1, 2, 3], 1, 2, 3]
```

```python
numbers.remove([1,2,3])
```

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 10, 1, 2, 3]
```

### ✨ Count method

The `count()` method returns the number of times the given element appears in the list

```python
numbers.count(2)
```

Output:

```
2
```

```python
numbers.count(3)
```

Output:

```
2
```

### ✨ pop method

`pop()` method deletes the element from the given index

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 10, 1, 2, 3]
```

```python
numbers.pop(5)
```

Output:

```
10
```

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 1, 2, 3]
```

### ✨ sorting list itmes

`sort()` method is used to sort the items in the list

```python
numbers
```

Output:

```
[1, 2, 3, 4, 5, 1, 2, 3]
```

```python
numbers.sort()
```

```python
numbers
```

Output:

```
[1, 1, 2, 2, 3, 3, 4, 5]
```

```python
numbers.sort(reverse=True) # descending order
```

```python
numbers
```

Output:

```
[5, 4, 3, 3, 2, 2, 1, 1]
```

### ✨ reverse list itmes

`reverse()` method is used to reverse the items in the list

```python
numbers
```

Output:

```
[5, 4, 3, 3, 2, 2, 1, 1]
```

```python
numbers.reverse()
numbers
```

Output:

```
[1, 1, 2, 2, 3, 3, 4, 5]
```

### ✨ delete all the list itmes

`clear()` method is used to delete all the items in the list

```python
numbers
```

Output:

```
[1, 1, 2, 2, 3, 3, 4, 5]
```

```python
numbers.clear()
```

```python
numbers
```

Output:

```
[]
```

# Lists in Python
