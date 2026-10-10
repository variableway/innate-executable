# Lesson 2: Similarity Search & Vector Databases

How do you find the "nearest" vector in a haystack of millions? You need Approximate Nearest Neighbors (ANN).

## Resources

### Articles
- [Building a Vector Database from Scratch in Python](https://medium.com/@vidiptvashist/building-a-vector-database-from-scratch-in-python-6bd683ba5171) – A perfect weekend project. You build a `VectorStore` class using just NumPy and cosine similarity.

### Theory
- [Hierarchical Navigable Small Worlds (Pinecone)](https://www.pinecone.io/learn/series/faiss/hnsw/) – HNSW is the algorithm behind almost every modern vector DB (Pinecone, Milvus, Chroma). This visualizes the "highway" graphs used for search.

### Libraries
- [facebookresearch/faiss](https://github.com/facebookresearch/faiss) – Not "from scratch," but studying the `IndexFlatL2` vs `IndexIVFFlat` documentation is essential for understanding quantization and indexing.

## Key Concepts
- Cosine similarity and distance metrics
- Approximate Nearest Neighbors (ANN)
- HNSW algorithm for fast search
- Vector database architecture (FAISS, Chroma, Pinecone)
