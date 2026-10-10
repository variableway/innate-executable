# Animations in Python

_Source notebook: `100-programs/93_animations_in_Python.ipynb`._

## 107. Mathematical Animations in Python using Manim
A community maintained Python library for creating mathematical animations.

```python
class CircleToSquare(Scene):
    def construct(self):
        blue_circle = Circle(color=BLUE, fill_opacity=0.5)
        green_square = Square(color=GREEN, fill_opacity=0.8)
        label = Text("Afiz")
        label.next_to(blue_circle, UP, buff=0.5)
        self.play(Create(blue_circle))
        self.wait()
        
        self.play(Transform(blue_circle, green_square), 
                  Write(label))
        self.wait()
```

Manim GitHub Repo: https://github.com/manimCommunity/manim  
Try Manim Without installing: https://try.manim.community/
