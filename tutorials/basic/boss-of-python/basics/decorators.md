# Decorators

_Source notebook: `basics/decorators.ipynb`._

# Decorators in Python

Decorators in Python allow us to modify the function, arguments and results without touching the actual code of the function.

#### Decorators Definition 
A function that accepts a function as input and returns a function as output.   
Here is a simple example of a Decorator which actually adds a banner to hello world. 👇

### Example 1: Add a banner to Hello World!

```python
# decorator function 
def add_banner(func): # it accepts any function as input 
    def wrapper():
        print('*'*11) # before calling function
        func()
        print('*'*11) # after calling function 
    return wrapper # returns the function 
        
@add_banner # decorating your hello function 
def hello():
    print('Hello Afiz!')
    

hello()
```

Output:

```
***********
Hello Afiz!
***********
```

Write a decorator function to add one to the result of the function
### Example 2: Add one to the result

```python
def add_one(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result + 1
    return wrapper 


@add_one
def sum_of_two(a, b):
    return a + b

print(sum_of_two(10, 9)) # output: 20
```

Output:

```
20
```

Write a decorator function to validate if all the params are integers.   

In this example, we will see how we can make use of decorators to validate the parameters of a function.   

### Example 3: Validate all the parameters are integers

```python
def validate_params(func):
    def wrapper(*args, **kwargs):
        try:
            for arg in args:
                if not isinstance(arg, (int, float)):
                    raise TypeError
            return func(*args, **kwargs)
        except TypeError as e:
            return 'All the params are not numbers'
    return wrapper 

@validate_params
def sum_of_two(a, b):
    return a + b
```

```python
sum_of_two(10, 20)
```

Output:

```
30
```

```python
sum_of_two('afd', 21)
```

Output:

```
'All the params are not numbers'
```
