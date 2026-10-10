# Lesson 6: Agent Evaluation (Safety & Metrics)

How do you know if your agent is stuck in a loop or hallucinating?

## Resources

### GitHub
- [ukgovernmentbeis/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) – An evaluation framework by the UK AI Safety Institute. It's code-heavy but shows the standard for testing agent safety and capability.

### Articles
- [Evaluation of LLM Agents](https://huyenchip.com/2023/04/11/llm-engineering.html#eval) – Chip Huyen explains why "Unit Tests" don't work for agents and introduces "Evals" (using an LLM to grade another LLM).

### YouTube
- [Eval Driven Development](https://www.youtube.com/watch?v=4W1t8e3q7f4) – Teaches you to write the "Test Case" (e.g., "Did the agent actually book the flight?") _before_ you write the agent.

### Metrics
- **Pass@k**: If you run your agent 10 times on the same task, how many times does it succeed? This is the only metric that matters for agents.

## Key Concepts
- Why unit tests don't work for agents
- LLM-based evaluation (Evals)
- Eval Driven Development
- Pass@k as the key agent metric
- Safety and capability testing
