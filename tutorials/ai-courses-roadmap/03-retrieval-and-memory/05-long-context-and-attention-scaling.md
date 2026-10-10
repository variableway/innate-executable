# Lesson 5: Long Context / Attention Scaling

How do we make models read entire books? You need better positional embeddings than just 1, 2, 3...

## Resources

### Articles (RoPE)
- [Rotary Embeddings: A Relative Revolution](https://blog.eleuther.ai/rotary-embeddings/) – RoPE is used in Llama, GPT-NeoX, and PaLM. This article explains the complex number rotation math intuitively.

### GitHub
- [lucidrains/rotary-embedding-torch](https://github.com/lucidrains/rotary-embedding-torch) – A standalone, copy-pasteable implementation of RoPE.

### Articles (ALiBi)
- [ALiBi: Train Short, Test Long](https://ofir.io/train_short_test_long.html) – Explains how to bias attention based on distance, allowing models to handle longer text than they were trained on.

## Key Concepts
- Rotary Position Embeddings (RoPE)
- ALiBi (Attention with Linear Biases)
- Context window scaling
- How models handle long documents
