# Named tuples

_Source notebook: `basics/named_tuples.ipynb`._

## `namedtuples` in Python
namedtuple of collections provides an extension of the built-in tuple 
data type. namedtuples allow us to give names to each element in the tuple. 
We can iterate through named tuples either by index or key.

```python
from collections import namedtuple

# Create a named tuple to represent a student
Student = namedtuple('Student', ['first_name', 
                                  'last_name', 
                                  'age'])

# Create some person objects
Steave = Student('Steave', 'Smith', 15)
Rayan = Student('Rayan', 'Shaik', 4)

# Print the student's information
print(f"{Steave.first_name} is {Steave.age} years old.")
print(f"{Rayan[0]} {Rayan[1]} is {Rayan[2]} years old.")
```

Output:

```
Steave is 15 years old.
Rayan Shaik is 4 years old.
```
