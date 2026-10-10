# Lesson 3: Retrieval-Augmented Generation (RAG)

The architecture that connects your database to your LLM. The bridge between knowledge and generation.

## Resources

### Articles
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) – The original paper. It's surprisingly readable and defines the standard architecture.

### GitHub
- [ask-my-pdf (Minimal RAG)](https://github.com/mayooear/gpt4-pdf-chatbot-langchain) – While it uses LangChain, look at the `ingest.py` file. It shows the flow: Load PDF → Split Text → Embed → Store → Query.

### Tutorials
- [Build your own RAG without LangChain](https://www.youtube.com/watch?v=tcqEUSNCn8I) – Excellent video showing how to wire OpenAI API + a local vector store using just Python lists and dictionaries.

## Key Concepts
- RAG architecture (Retrieve → Augment → Generate)
- Document chunking and embedding
- Query-document matching
- How LLMs access external knowledge
