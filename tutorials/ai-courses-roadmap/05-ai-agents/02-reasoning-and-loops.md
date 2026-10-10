# Lesson 2: AI Agents (Reasoning & Loops)

This is the core logic: The "ReAct" loop (Reason + Act) where the model pauses, executes code, and observes the output.

## Resources

### GitHub
- [pguso/ai-agents-from-scratch](https://github.com/pguso/ai-agents-from-scratch) – **The best resource on this list.** It builds an agent system step-by-step (Introduction → Tools → Memory → Planning) with zero frameworks. It explains _why_ agents are built this way.

### Articles
- [ReAct: Synergizing Reasoning and Acting](https://react-lm.github.io/) – The original blog post that introduced the concept of "Reasoning Traces" (Thought → Action → Observation).

### YouTube
- [DeepLearning.AI: Functions, Tools and Agents](https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/) – Even though it uses LangChain, the first module explains the _theory_ of the ReAct loop better than almost any other video.

### Code Examples
- [Simple Python ReAct Loop](https://til.simonwillison.net/llms/python-react-pattern) – A single Python file that implements the ReAct loop using RegEx, showing you don't need a library to parse agent thoughts.

## Key Concepts
- ReAct pattern (Reason + Act + Observe)
- Thought → Action → Observation traces
- How agents execute code and observe results
- Building agents without frameworks
