# Lesson 4: Memory in Agents

How to make an AI "remember" a conversation from yesterday.

## Resources

### Research Papers
- [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) – The famous "Smallville" paper. Section 3 ("Agent Architecture") is the **gold standard** for designing a memory stream (Recency, Importance, Relevance).

### GitHub
- [joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents) – The official code for the paper above. Look at `memory.py` to see how they score memories to decide what to retrieve.

### Articles
- [Memory in LLM Agents](https://www.promptingguide.ai/research/llm-agents#memory) – A concise breakdown of Short-term (Context) vs Long-term (Vector DB) memory.

## Key Concepts
- Short-term memory (context window)
- Long-term memory (vector database)
- Memory scoring: Recency, Importance, Relevance
- How agents remember across conversations
