# Extract html

_Source notebook: `100-programs/89_extract_html.ipynb`._

# 111. Extract text from any website(URL)

```python
!pip install oneai -q
```

```python
import requests
from config import one_ai as api_key

url = "https://api.oneai.com/api/v0/pipeline"
headers = {
  "api-key": api_key, 
  "content-type": "application/json"
}
payload = {
  "input":'https://tinyurl.com/4fr5cbje',
  "input_type": "article",
  "steps": [
      {
      "skill": "html-extract-article"
    }
    ],
  }
r = requests.post(url, json=payload, headers=headers)
data = r.json()
```

```python
data['input_text']
```

Output:

```
'Ind vs SA 2022 2nd T20I\n"Honestly, I\'m surprised I\'m getting this."\nKL Rahul\nhad just been adjudged Player of the Match for his 28-ball 57, which set the tone for India\'s 237 for 3 in the second T20I against South Africa in Guwahati. But the fact that India were able to sustain their tempo right through the innings on a surface Rahul felt was "a bit sticky and gripping a bit", was as much down to Suryakumar Yadav\n\'s pyrotechnics. That\'s what Rahul was referring to after India rode on their fourth-highest T20I total to take an unassailable 2-0 series lead.\nSuryakumar, currently No. 2 in the world among T20I batters, launched an offensive on South Africa\'s bowlers almost immediately after walking out to replace Rahul in the 12th over. He raised his half-century off just 18 deliveries, and finished on a 22-ball 61, displaying more than just shades of his 360-degree game that has left many in awe. He hit five fours and five sixes in all.\n"Quite honestly, after the first two-three overs, the chat between me and Rohit [Sharma] was that the wicket is a bit sticky, it\'s gripping a bit, certain slower ones were gripping, so we were in our minds saying 180-185 would be a really good target if we bat well, but the game always surprises you," Rahul said at the post-match presentation ceremony. "Quite honestly I\'m surprised I\'m getting this [award]. I think Surya, the way he batted, had a bigger impact on the game. And he changed the game."\nRahul chuckled when told that the decision was made by "a certain senior opening batter [Sunil Gavaskar]", because that was the more difficult role to play.\n"We as opening batters always think our job is tougher, but having batted a few innings in the middle order in ODIs, I do realise that\'s difficult as well," Rahul said with a smile. "Like I said, Surya had a bigger impact, the way Virat [Kohli, who scored 49* in 28] batted as well… it\'s not been easy for someone like Dinesh [Karthik, who got 17* in seven]; he doesn\'t get too many balls, just to walk in there and do what\'s expected was a phenomenal batting effort."\nRahul admitted to having derived a lot of satisfaction from playing two contrasting innings, both impactful, in the series so far. In Thiruvananthapuram, on a greenish surface with bounce and lateral movement, he grafted hard to fight through a top-order wobble in a small chase of 107. On 14 off 31 balls at one point, he finished with an unbeaten 51 off 56 even as Suryakumar came in and did his thing, making a robust 33-ball half-century as India got home by eight wickets.\n"It does, it really does - I mean, I think it\'s very important as an opening batter to understand what is required on a particular day and give it your best for the team," he said when asked if the knocks had given him satisfaction. "That\'s what I tried to do, that\'s the mindset I\'ve always played the game in and I\'ll continue to play that way. And yes, it\'s good to test yourself on different conditions as well. I\'m quite satisfied."\nRahul set the tone off the very first ball in Guwahati, when he rose with the bounce to punch Kagiso Rabada to the point boundary. His next boundary was a wristy pick-up shot for six over square leg off Wayne Parnell in the fourth over. The follow-up to that was another delightful punch behind point. Inside the first four overs, Rahul had already laid down a marker.\n"The first ball, the back-foot punch really set me up," he said. "When I play that shot, in my mind, when I play both sides of the wicket especially, I know my balance is pretty good. I hit the first ball square of the wicket on the off side, hit a few balls on the leg side, so it tells me head is stable and my positions are good."\nIs it instinctive?\n"Yes, I think it is," he said. "It\'s T20 cricket, you have to try and hit sixes, get yourself int positions where you can hit sixes. I tried to do that and react. When bowlers are bowling at 145kph, there\'s not much time to see the ball, it\'s a bit of instinct and a lot of practice and hard work over the years."\nShashank Kishore is a senior sub-editor at ESPNcricinfo'
```
