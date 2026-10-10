# Index

_Source notebook: `advanced/pydantic/index.ipynb`._

### Basic Example

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    name: str
    email: str
    account_id: int

    @field_validator('account_id')
    def validate_account_id(cls, value):
        if value <= 0:
            raise ValueError(f'account_id must be postive: {value}')
        return value

user = User(name='Afiz', email='afiz@gmail.com', account_id=1234)
print(user)
```

Output:

```
name='Afiz' email='afiz@gmail.com' account_id=1234
```

### JSON

```python
user_json_str = user.json()
```

```python
print(type(user_json_str))
print(user_json_str)
```

Output:

```
<class 'str'>
{"name":"Afiz","email":"afiz@gmail.com","account_id":1234}
```

```python
# Python Dict

user.dict()
```

Output:

```
{'name': 'Afiz', 'email': 'afiz@gmail.com', 'account_id': 1234}
```

```python
User.parse_raw(user_json_str)
```

Output:

```
User(name='Afiz', email='afiz@gmail.com', account_id=1234)
```

### Pydantic Example

```python
from datetime import datetime
from typing import Tuple

from pydantic import BaseModel


class Delivery(BaseModel):
    timestamp: datetime
    dimensions: Tuple[int, int]
```

```python
m = Delivery(timestamp='2020-01-02T03:04:05Z', dimensions=['10', '20'])
```

```python
repr(m)
```

Output:

```
'Delivery(timestamp=datetime.datetime(2020, 1, 2, 3, 4, 5, tzinfo=TzInfo(UTC)), dimensions=(10, 20))'
```

```python
m.dimensions
```

Output:

```
(10, 20)
```

```python
m.timestamp
```

Output:

```
datetime.datetime(2020, 1, 2, 3, 4, 5, tzinfo=TzInfo(UTC))
```

#### Example 2

```python
from datetime import datetime

from pydantic import BaseModel, PositiveInt

class User(BaseModel):
    id: int
    name: str = 'Afiz'
    signup_ts: datetime | None
    tastes: dict[str, PositiveInt]
```

```python
external_data = {
    'id': 123,
    'signup_ts': '2019-06-01 12:22', 
    'tastes': {
        'wine': 9,
        'cheese': 7,
        'apple': 8
    }
}
```

```python
user = User(**external_data)
```

```python
user
```

Output:

```
User(id=123, name='Afiz', signup_ts=datetime.datetime(2019, 6, 1, 12, 22), tastes={'wine': 9, 'cheese': 7, 'apple': 8})
```

```python
user.model_dump()
```

Output:

```
{'id': 123,
 'name': 'Afiz',
 'signup_ts': datetime.datetime(2019, 6, 1, 12, 22),
 'tastes': {'wine': 9, 'cheese': 7, 'apple': 8}}
```

```python
type(user.model_dump())
```

Output:

```
dict
```

```python
user.model_dump_json()
```

Output:

```
'{"id":123,"name":"Afiz","signup_ts":"2019-06-01T12:22:00","tastes":{"wine":9,"cheese":7,"apple":8}}'
```

```python
from pydantic import ValidationError
from pprint import pprint

external_data = {'id': 'not an int', 'tastes': {}}

try:
    User(**external_data)  
except ValidationError as e:
    pprint(e.errors())
```

Output:

```
[{'input': 'not an int',
  'loc': ('id',),
  'msg': 'Input should be a valid integer, unable to parse string as an '
         'integer',
  'type': 'int_parsing',
  'url': 'https://errors.pydantic.dev/2.6/v/int_parsing'},
 {'input': {'id': 'not an int', 'tastes': {}},
  'loc': ('signup_ts',),
  'msg': 'Field required',
  'type': 'missing',
  'url': 'https://errors.pydantic.dev/2.6/v/missing'}]
```
