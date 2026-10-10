# Analyze online post

_Source notebook: `100-programs/85_analyze_online_post.ipynb`._

## Detect Emotion, Sentiment and Trends using AI

```python
!pip install oneai -q
```

```python
import oneai

oneai.api_key = "ONE_AI_API_KEY"
text = "YOUR_URL"

pipeline = oneai.Pipeline(
  steps = [
		oneai.skills.HtmlToArticle(),
		oneai.skills.Topics(),
		oneai.skills.Emotions(),
  ]
)

output = pipeline.run(text)
```

🟡 Follow me @itsafiz
