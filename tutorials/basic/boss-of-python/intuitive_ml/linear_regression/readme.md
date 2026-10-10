
# Univariate Linear Regression

In linear regression we aim to find a hypothesis function, <img src="svgs/2ad9d098b937e46f9f58968551adac57.svg?" align=middle width=9.47111549999999pt height=22.831056599999986pt/>, that models a linear relationship between one or more explanatory variables, <img src="svgs/277fbbae7d4bc65b6aa601ea481bebcc.svg?" align=middle width=15.94753544999999pt height=14.15524440000002pt/>, ... <img src="svgs/d7084ce258ffe96f77e4f3647b250bbf.svg?" align=middle width=17.521011749999992pt height=14.15524440000002pt/>, and a dependent varaible, <img src="svgs/deceeaf6940a8c7a5a02373728002b0f.svg?" align=middle width=8.649225749999989pt height=14.15524440000002pt/>. <img src="svgs/2ad9d098b937e46f9f58968551adac57.svg?" align=middle width=9.47111549999999pt height=22.831056599999986pt/> can then be used to create predictions of <img src="svgs/deceeaf6940a8c7a5a02373728002b0f.svg?" align=middle width=8.649225749999989pt height=14.15524440000002pt/> for unseen examples of <img src="svgs/277fbbae7d4bc65b6aa601ea481bebcc.svg?" align=middle width=15.94753544999999pt height=14.15524440000002pt/>, ..., <img src="svgs/d7084ce258ffe96f77e4f3647b250bbf.svg?" align=middle width=17.521011749999992pt height=14.15524440000002pt/>.

## Importing packages


```python
import IPython.display
import base64
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import animation
from mpl_toolkits.mplot3d import Axes3D
```

## Importing data


```python
data = pd.read_csv('./ex1data1.txt', header=None).values
x, y = data[:, :-1], data[:, -1:]
m = len(x)

print("x.shape is %s" % (x.shape,))
print("y.shape is %s" % (y.shape,))
```

    x.shape is (97, 1)
    y.shape is (97, 1)


## Plotting


```python
plt.figure(figsize=(10,6))
plt.plot(x, y, 'bx', 'rx',markersize=10)
plt.ylabel('Profit in <img src="svgs/facbd29e8509c769f70060ba9cd2c68c.svg?" align=middle width=451.38631395000004pt height=124.7488638pt/>y = mx + c<img src="svgs/68e6b9bbfa397ea50739b1c5e352feda.svg?" align=middle width=52.169074649999985pt height=22.831056599999986pt/>m<img src="svgs/85ca86bacc603071e0285456663ef7b8.svg?" align=middle width=169.62802889999998pt height=22.831056599999986pt/>c<img src="svgs/16f49dbaf23837d106e7ad9ad94514f1.svg?" align=middle width=36.43005629999999pt height=22.831056599999986pt/>y<img src="svgs/d1fb761b37c63e05fdbc4e25f686eb9e.svg?" align=middle width=182.54296169999998pt height=22.831056599999986pt/>y = mx + c<img src="svgs/f5620b88506ea3be181a7d22e75bdcf9.svg?" align=middle width=253.22918445000002pt height=22.831056599999986pt/>x<img src="svgs/fd92a53167b3c6ae9574071613d555dc.svg?" align=middle width=27.11199479999999pt height=22.831056599999986pt/>y<img src="svgs/33e07ffa295ff46693e5c4d3b7d4936b.svg?" align=middle width=274.8959862pt height=22.831056599999986pt/>y = mx + c<img src="svgs/32ca5a1177dd59d988210c1d9ecd5f99.svg?" align=middle width=602.6566227pt height=22.831056599999986pt/>x_0, ..., x_n<img src="svgs/fd92a53167b3c6ae9574071613d555dc.svg?" align=middle width=27.11199479999999pt height=22.831056599999986pt/>y<img src="svgs/ff5362602a7c22bf38311caff8d66240.svg?" align=middle width=267.90027495000004pt height=45.84475499999998pt/>h(x) = \theta_0 + \theta_1x_1 + \theta_2x_2 +, ..., \theta_nx_n<img src="svgs/81630f78641c183f95047f9af61db09f.svg?" align=middle width=700.2746371499999pt height=124.74886379999998pt/>x_0<img src="svgs/3c65f872403110e62bd9daadbc330b0e.svg?" align=middle width=238.8812877pt height=22.831056599999986pt/>1<img src="svgs/2d6b4bef0bc89eb7b236d145f01e15ac.svg?" align=middle width=63.73313429999999pt height=22.831056599999986pt/>\theta_0<img src="svgs/5b7fdff107e1558ff2e513f03e88fa3a.svg?" align=middle width=12.785434199999989pt height=14.15524440000002pt/>\theta_0x_0<img src="svgs/7a19bcbc0c49095daf743cbb572bb338.svg?" align=middle width=755.99768805pt height=482.83100579999996pt/>\theta_0$')
    ax.set_ylabel(r'$\theta_1$')
    ax.set_zlabel('Cost')
    return fig,

frames = 180
rotation = 88
elevation = 30
elevation_offest = 15
rotation_offset = -45

def animate(i):
    # i >= 0, i <= frames
    elev = (np.sin(i / frames * 2 * np.pi + 3 / 2 * np.pi) + 1) / 2 * elevation + elevation_offest
    azim = np.sin(i / frames * 2 * np.pi) * (rotation / 2) + rotation_offset
    ax.view_init(elev=elev, azim=azim)
    return fig,

# Animate
ani = animation.FuncAnimation(fig, animate, init_func=init, frames=frames, interval=1, blit=True)
plt.close()
```


```python
ani.save('%s.gif' % 'cost', writer='imagemagick', fps=24)

with open('cost.gif', 'rb') as gif:
    url = b"data:image/gif;base64," +base64.b64encode(gif.read())
IPython.display.Image(url=url.decode('ascii'))
```

![](cost.gif)

## Feature normalisation

To prevent <img src="svgs/3c1a175df4fc8d57817e766a94962b4f.svg?" align=middle width=59.244705299999985pt height=22.831056599999986pt/> from oscilating during gradient descent, we normalise their range using z-score normalisation. This produces a uniform cost function that allows gradient descent to converge more quickly.


```python
# Remove x0 as we do not want to normalise it
x = x[:, 1:]

# Normalise x1, x2, ...
def feature_normalisation(x):
    mu = np.mean(x);
    sigma = np.std(x);
    return [(x - mu) / sigma, mu, sigma]

x, mu, sigma = feature_normalisation(x)

# Add x0
x = np.hstack((np.ones((m, 1)), x))
```

## Visualising the cost function after normalisation


```python
X = np.arange(5.83913505 - 6, 5.83913505 + 6,.2)
Y = np.arange(4.59304113 - 6, 4.59304113 + 6,.2)
X, Y = np.meshgrid(X, Y)
Z = np.zeros(X.shape)

for i in range(Z.shape[0]):
    for j in range(Z.shape[1]):
        Z[i][j] = half_mse(x, y, np.array([[X[i][j]], [Y[i][j]]]))
        
# Create a figure and a 3D Axes
fig = plt.figure()
ax = Axes3D(fig)

# Plot the surface.
ax.plot_surface(X, Y, Z, cmap="coolwarm", linewidth=0, antialiased=False)

def init():
    ax.set_xticklabels([])
    ax.set_yticklabels([])
    ax.set_zticklabels([])
    ax.set_xlabel(r'$\theta_0$')
    ax.set_ylabel(r'$\theta_1$')
    ax.set_zlabel('Cost')
    return fig,

frames = 180
rotation = 88
elevation = 45
elevation_offest = 15
rotation_offset = -45

def animate(i):
    # i >= 0, i <= frames
    elev = (np.sin(i / frames * 2 * np.pi + 3 / 2 * np.pi) + 1) / 2 * elevation + elevation_offest
    azim = np.sin(i / frames * 2 * np.pi) * (rotation / 2) + rotation_offset
    
    ax.view_init(elev=elev, azim=azim)
    return fig,

# Animate
ani = animation.FuncAnimation(fig, animate, init_func=init, frames=frames, interval=1, blit=True)
plt.close()
```


```python
ani.save('%s.gif' % 'normalised_cost', writer='imagemagick', fps=24)

with open('normalised_cost.gif', 'rb') as gif:
    url = b"data:image/gif;base64," +base64.b64encode(gif.read())
IPython.display.Image(url=url.decode('ascii'))
```

![](normalised_cost.gif)

## Gradient Descent

There are several methods of finding the optimal value of each coefficient <img src="svgs/3c1a175df4fc8d57817e766a94962b4f.svg?" align=middle width=59.244705299999985pt height=22.831056599999986pt/>, but two common methods are gradient descent and analytical analysis via normal equations.

The key difference between the two methods is their algrithmic complexity. Gradient descent has a complexity of <img src="svgs/3987120c67ed5a9162aa9841b531c3a9.svg?" align=middle width=43.02219404999999pt height=26.76175259999998pt/> while normal equations has a complexity of <img src="svgs/90846c243bb784093adbb6d2d0b2b9d0.svg?" align=middle width=43.02219404999999pt height=26.76175259999998pt/>, where <img src="svgs/55a049b8f161ae7cfeb0197d75aff967.svg?" align=middle width=9.86687624999999pt height=14.15524440000002pt/> is the number of explanatory variables, <img src="svgs/9c5ffbbaadf29257b87ab1639f470396.svg?" align=middle width=62.60089769999999pt height=14.15524440000002pt/>. This makes gradient descent more suitable for problems involving over <img src="svgs/1fbc19920b0478b294fc1a4f1d5f3162.svg?" align=middle width=48.401929949999996pt height=21.18721440000001pt/> explanatory variables.


```python
def gradient_descent(x, y, theta, alpha, iterations):
    history = []
    history.append(theta)
    for i in range(iterations):
        theta = theta - alpha / m * x.T @ (x @ theta - y)
        history.append(theta)
    return history
```


```python
# Initialise theta0, theta1, ...
theta = np.zeros((x.shape[1], 1));

# Set the parameters of gradient descent
iterations = 500
alpha = 0.01

# Run gradient descent
history = gradient_descent(x, y, theta, alpha, iterations)
theta = history[-1]

for i, t in enumerate(theta.squeeze()):
    print("Theta%s = %s" % (i, t))
```

    Theta0 = 5.800769113707832
    Theta1 = 4.562862634482999


## Plotting the cost of <img src="svgs/8bf0db2265caf24f67b2976f8d91272c.svg?" align=middle width=59.244705299999985pt height=22.831056599999986pt/> during gradient descent


```python
history = np.array(history).squeeze()
Z = np.array([half_mse(x, y, np.array([[u], [v]])) for u, v in zip(history[:, 0], history[:, 1])])
plt.figure(figsize=(10,6))
plt.plot(Z, '-',markersize=10)
plt.ylabel('Cost')
plt.xlabel('Iteration')
plt.show()
```


![png](output_27_0.png)


## Visualising gradient descent


```python
X = np.arange(5.83913505 - 6, 5.83913505 + 6,.2)
Y = np.arange(4.59304113 - 6, 4.59304113 + 6,.2)
X, Y = np.meshgrid(X, Y)
Z = np.zeros(X.shape)

for i in range(Z.shape[0]):
    for j in range(Z.shape[1]):
        Z[i][j] = half_mse(x, y, np.array([[X[i][j]], [Y[i][j]]]))
        
W = history[:, 0]
U = history[:, 1]
V = np.array([half_mse(x, y, np.array([[w], [u]])) for w, u in zip(W, U)])
        
# Create a figure and a 3D Axes
fig = plt.figure()
ax = Axes3D(fig)

ax.plot_surface(X, Y, Z, cmap="coolwarm", zorder=-100)
line, = ax.plot(W, U, V, '-r', linewidth=5, zorder=100)

def init():
    line.set_data([], [])
    line.set_3d_properties([])
    ax.set_xticklabels([])
    ax.set_yticklabels([])
    ax.set_zticklabels([])
    ax.set_xlabel(r'$\theta_0$')
    ax.set_ylabel(r'$\theta_1$')
    ax.set_zlabel('Cost')
    return fig,

frames = 180
rotation = 88
elevation = 45
elevation_offest = 15
rotation_offset = -45

def animate(i):
    # i >= 0, i <= frames
    elev = (np.sin(i / frames * 2 * np.pi + 3 / 2 * np.pi) + 1) / 2 * elevation + elevation_offest
    azim = np.sin(i / frames * 2 * np.pi) * (rotation / 2) + rotation_offset
    ax.view_init(elev=elev, azim=azim)

    line.set_data(W[:round(i/frames * 500)], U[:round(i/frames * 500)])
    line.set_3d_properties(V[:round(i/frames * 500)])
    return fig,

# Animate
ani = animation.FuncAnimation(fig, animate, init_func=init, frames=frames, interval=1, blit=True)
plt.close()
```


```python
ani.save('%s.gif' % 'gradient_descent', writer='imagemagick', fps=24)

with open('gradient_descent.gif', 'rb') as gif:
    url = b"data:image/gif;base64," +base64.b64encode(gif.read())
IPython.display.Image(url=url.decode('ascii'))
```

![](gradient_descent.gif)

## Plotting the hypothesis function


```python
plt.figure(figsize=(10,6))
plt.plot(x[:, 1], y, 'bx', 'rx',markersize=10)
plt.plot(x[:, 1], x @ theta, '-')
plt.ylabel('Profit in $10,000s')
plt.xlabel('Population of City in 10,000s')
plt.show()
```


![png](output_32_0.png)


# Multivariate Linear Regression


```python
data = pd.read_csv('./ex1data2.txt', header=None).values
x, y = data[:, :-1], data[:, -1:]
m = len(x)

print("x.shape is %s" % (x.shape,))
print("y.shape is %s" % (y.shape,))
```

## Plotting


```python
fig = ipv.figure()
s = ipv.scatter(x[:, 0].astype(float), y.squeeze().astype(float), x[:, 1].astype(float), marker='sphere', size=5)
ipv.show()
```


```python
x = np.linspace(0, 360, 360)
y = np.sin(x / 360 * 2 * np.pi) * 45
z = (np.sin(x / 360 * 2 * np.pi + 3 / 2 * np.pi ) + 1) / 2 * 45

plt.plot(x, y, label='Rotation')
plt.plot(x, z, label='Elevatin')
plt.legend()
plt.show()
```


```python

```
