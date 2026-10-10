# AI Building From Scratch – Course Structure

This directory breaks down the AI Building From Scratch curriculum into structured lessons. Each lesson includes the original resources (GitHub repos, articles, YouTube videos, notebooks) organized by topic.

> **Recommended order:** Foundations → Core Models → Retrieval & Memory → Developer Tools → AI Agents → Emerging Trends

---

## 01 – Foundations

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [Mathematics & Stats](01-foundations/01-mathematics-and-stats.md) | Linear algebra, calculus, statistics |
| 2 | [Programming Basics](01-foundations/02-programming-basics.md) | Python, NumPy, data manipulation |
| 3 | [Data Structures & Algorithms](01-foundations/03-data-structures-and-algorithms.md) | Graphs, trees, A* search, heuristics |
| 4 | [Foundations of Machine Learning](01-foundations/04-foundations-of-machine-learning.md) | Transformer architecture, attention, embeddings |
| 5 | [Optimization](01-foundations/05-optimization.md) | Gradient descent, backpropagation, autograd |

---

## 02 – Core Models

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [Bigram / N-gram Models](02-core-models/01-bigram-and-ngram-models.md) | Word probability, language modeling basics |
| 2 | [Mini GPT / Transformers](02-core-models/02-mini-gpt-and-transformers.md) | Self-attention, multi-head attention, positional encoding |
| 3 | [Inference Loops (KV Cache)](02-core-models/03-inference-loops.md) | Token generation, KV caching, sampling strategies |
| 4 | [Code Models](02-core-models/04-code-models.md) | Code tokenization, fine-tuning, The Stack dataset |
| 5 | [Vision Transformers (ViT)](02-core-models/05-vision-transformers.md) | Image patches as tokens, visual Transformers |
| 6 | [Audio / Speech Transformers](02-core-models/06-audio-and-speech-transformers.md) | Spectrograms, speech recognition |
| 7 | [CLIP (Text + Image)](02-core-models/07-clip.md) | Contrastive learning, shared embedding space |
| 8 | [GANs](02-core-models/08-gans.md) | Generator vs Discriminator, DCGAN, CycleGAN |
| 9 | [VAEs](02-core-models/09-vaes.md) | Latent space, reparameterization trick |
| 10 | [Diffusion Models](02-core-models/10-diffusion-models.md) | DDPM, noise scheduling, Stable Diffusion basics |

---

## 03 – Retrieval & Memory

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [Vector Representations & Embeddings](03-retrieval-and-memory/01-vector-representations-and-embeddings.md) | Word2Vec, skip-gram, semantic vectors |
| 2 | [Similarity Search & Vector Databases](03-retrieval-and-memory/02-similarity-search-and-vector-databases.md) | ANN, HNSW, FAISS, cosine similarity |
| 3 | [RAG](03-retrieval-and-memory/03-rag.md) | Retrieve → Augment → Generate architecture |
| 4 | [Memory in Agents](03-retrieval-and-memory/04-memory-in-agents.md) | Short-term vs long-term memory, memory scoring |
| 5 | [Long Context / Attention Scaling](03-retrieval-and-memory/05-long-context-and-attention-scaling.md) | RoPE, ALiBi, context window scaling |

---

## 04 – Developer Tools / AI IDEs

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [AI-Powered IDEs / Copilots](04-developer-tools/01-ai-powered-ides.md) | Context gathering, prompt construction, tool calling |
| 2 | [Prompt Tooling / Compilers](04-developer-tools/02-prompt-tooling.md) | Prompt chaining, ReAct in prompt form |
| 3 | [Agent Dashboards & Cowork](04-developer-tools/03-agent-dashboards.md) | Multi-agent sessions, supervision, UI orchestration |
| 4 | [Code + Notebook Integrations](04-developer-tools/04-code-and-notebook-integrations.md) | Jupyter AI, AutoGen, agent experimentation |

---

## 05 – AI Agents

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [CLI Agents](05-ai-agents/01-cli-agents.md) | NL to commands, Typer, function calling |
| 2 | [Reasoning & Loops (ReAct)](05-ai-agents/02-reasoning-and-loops.md) | Thought → Action → Observation, framework-free agents |
| 3 | [Cloud Agents](05-ai-agents/03-cloud-agents.md) | FastAPI, background tasks, webhooks, job queues |
| 4 | [Multi-Agent Systems](05-ai-agents/04-multi-agent-systems.md) | Agent communication, state passing, conversation patterns |
| 5 | [Autonomous Agents](05-ai-agents/05-autonomous-agents.md) | BabyAGI, AutoGPT, task creation loop |
| 6 | [Agent Evaluation](05-ai-agents/06-agent-evaluation.md) | Evals, Pass@k, safety testing |

---

## 06 – Emerging Trends

| # | Lesson | Key Topics |
|---|--------|------------|
| 1 | [OpenClaw](06-emerging-trends/01-openclaw.md) | Proactive AI, local-first, system integration |
| 2 | [NanoBot](06-emerging-trends/02-nanobot.md) | Lightweight MCP agents, tool orchestration |

---

## Websites to Visit by Stage

### Foundations
- [dair-ai/Mathematics-for-ML](https://github.com/dair-ai/Mathematics-for-ML)
- [The Matrix Calculus You Need for Deep Learning](https://explained.ai/matrix-calculus/)
- [3Blue1Brown – Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
- [trekhleb/homemade-machine-learning](https://github.com/trekhleb/homemade-machine-learning)
- [Real Python – First Steps](https://realpython.com/python-first-steps/)
- [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python)
- [Introduction to A* Search](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [karpathy/micrograd](https://github.com/karpathy/micrograd)

### Core Models
- [karpathy/makemore](https://github.com/karpathy/makemore)
- [karpathy/minGPT](https://github.com/karpathy/minGPT)
- [The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html)
- [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/)
- [salesforce/CodeGen](https://github.com/salesforce/CodeGen)
- [The Stack (BigCode)](https://huggingface.co/datasets/bigcode/the-stack)
- [lucidrains/vit-pytorch](https://github.com/lucidrains/vit-pytorch)
- [moein-shariatnia/OpenAI-CLIP](https://github.com/moein-shariatnia/OpenAI-CLIP)
- [eriklindernoren/PyTorch-GAN](https://github.com/eriklindernoren/PyTorch-GAN)
- [The Annotated Diffusion Model](https://huggingface.co/blog/annotated-diffusion)

### Retrieval & Memory
- [The Illustrated Word2Vec](https://jalammar.github.io/illustrated-word2vec/)
- [Building a Vector DB from Scratch](https://medium.com/@vidiptvashist/building-a-vector-database-from-scratch-in-python-6bd683ba5171)
- [HNSW (Pinecone)](https://www.pinecone.io/learn/series/faiss/hnsw/)
- [facebookresearch/faiss](https://github.com/facebookresearch/faiss)
- [RAG Original Paper](https://arxiv.org/abs/2005.11401)
- [Generative Agents (Smallville)](https://arxiv.org/abs/2304.03442)
- [Rotary Embeddings](https://blog.eleuther.ai/rotary-embeddings/)
- [ALiBi: Train Short, Test Long](https://ofir.io/train_short_test_long.html)

### Developer Tools
- [Continue](https://github.com/continuedev/continue)
- [Zed (AI features)](https://github.com/zed-industries/zed)
- [LangChain](https://github.com/langchain-ai/langchain)
- [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [AionUi](https://github.com/iOfficeAI/AionUi)
- [Jupyter AI](https://github.com/jupyterlab/jupyter-ai)
- [AutoGen Studio](https://github.com/microsoft/autogen)

### AI Agents
- [simonw/llm](https://github.com/simonw/llm)
- [pguso/ai-agents-from-scratch](https://github.com/pguso/ai-agents-from-scratch)
- [ReAct Paper](https://react-lm.github.io/)
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi)
- [ScrapeGraphAI](https://github.com/VinciGit00/ScrapeGraphAI)
- [babyagi](https://github.com/yoheinakajima/babyagi)
- [inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai)

### Emerging Trends
- [OpenClaw](https://openclaw.ai) | [GitHub](https://github.com/openclaw/openclaw) | [Docs](https://docs.openclaw.ai/start/getting-started)
- [NanoBot](https://www.nanobot.ai)
