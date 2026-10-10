# Lesson 4: Multi-Agent Systems (Orchestration)

How to make two agents talk to each other without them getting stuck in an infinite loop of "Hello" "Hi".

## Resources

### GitHub
- [scrapegraphai/ScrapeGraphAI](https://github.com/VinciGit00/ScrapeGraphAI) – A library that uses a graph of agents to scrape websites. The code is readable and shows how to pass state between a "Fetcher Agent" and a "Summary Agent."

### Articles
- [How to Create Multi-Agent Systems Without Frameworks](https://scrapegraphai.com/blog/how-to-create-agent-without-frameworks) – A brilliant tutorial that builds a "Researcher" and "Analyst" agent using raw Python/OpenAI calls, explicitly avoiding LangGraph/CrewAI.

### YouTube
- [Multi-Agent Collaboration with AutoGen](https://www.youtube.com/watch?v=1yv-u9Jv8CQ) – Andrew Ng's breakdown of _Conversation Patterns_ (Sequential vs. Hierarchical chat).

### Notebooks
- [Camel Role-Playing](https://github.com/camel-ai/camel/blob/master/examples/ai_society/role_playing.py) – One of the first papers on multi-agent roleplay. The code shows how to prompt-engineer "Inception" (getting agents to instruct each other).

## Key Concepts
- Agent-to-agent communication
- State passing between agents
- Sequential vs Hierarchical conversation patterns
- Role-playing and agent instruction
