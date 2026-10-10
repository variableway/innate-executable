# Lesson 3: Cloud Agents (Async & API Serving)

Running an agent on a server requires managing long-running tasks. You can't just let an API request "hang" while the agent thinks for 2 minutes.

## Resources

### GitHub
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) – You need to learn FastAPI to serve agents. Focus on the "Background Tasks" section of the docs.

### Articles
- [How to Deploy AI Agents to Production](https://eugeneyan.com/writing/llm-patterns/#level-3-agents) – Eugene Yan's guide on the architecture of agent systems: Job Queues, State Persistence, and Failure Recovery.

### YouTube
- [Asynchronous Task Queues (Celery + Redis)](https://www.youtube.com/watch?v=THxCy-6Enns) – Agents are slow. This tutorial teaches the architecture (Queue → Worker) needed to run agents without timing out your server.

### Concepts
- **Webhooks**: Your agent needs to "call back" your frontend when it finishes a task. Research "Webhooks in Python" to understand this pattern.

## Key Concepts
- FastAPI for serving agents
- Background tasks and async processing
- Job queues (Celery + Redis)
- Webhooks for agent-to-frontend communication
- State persistence and failure recovery
