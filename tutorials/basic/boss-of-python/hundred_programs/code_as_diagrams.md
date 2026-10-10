# Code as diagrams

_Source notebook: `100-programs/90_code_as_diagrams.ipynb`._

# 110. Architecture Diagrams with Python

```python
!pip install diagrams -q
```

```python
from diagrams import Diagram
from diagrams.aws.compute import EC2
from diagrams.aws.database import RDS
from diagrams.aws.network import ELB

with Diagram("Web Service", show=False):
    ELB("lb") >> EC2("web") >> RDS("userdb")
```

![web_service.png](attachment:05e27ba0-343e-4c71-a48b-00910a4c6879.png)

```python
from diagrams import Cluster, Diagram
from diagrams.aws.compute import ECS
from diagrams.aws.database import ElastiCache, RDS
from diagrams.aws.network import ELB
from diagrams.aws.network import Route53

with Diagram("Clustered Web Services", show=False):
    dns = Route53("dns")
    lb = ELB("lb")

    with Cluster("Services"):
        svc_group = [ECS("web1"),
                     ECS("web2"),
                     ECS("web3")]

    with Cluster("DB Cluster"):
        db_primary = RDS("userdb")
        db_primary - [RDS("userdb ro")]

    memcached = ElastiCache("memcached")

    dns >> lb >> svc_group
    svc_group >> db_primary
    svc_group >> memcached
```

![clustered_web_services.png=50x50](attachment:ffec3eee-b1e4-4557-bbc7-94b1a81f5f94.png)

```python
from diagrams.ibm.analytics import Analytics, DataIntegration

with Diagram("IBM", show=False):
    Analytics("lb") >> DataIntegration("web") >> Analytics("userdb")
```

![ibm.png](attachment:341b4ea1-7376-451e-955d-7c8c964bf41e.png)
