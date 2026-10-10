# Lesson 3: Inference Loops (KV Cache)

Understanding how models generate text token by token, and how to make it fast.

## Resources

### Articles
- [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/) – Explains the math of inference (KV caching, memory bandwidth) which is critical for making your model fast.

### GitHub
- [calvin-mccoy/transformer-inference](https://github.com/calvin-mccoy/transformer-inference) – A minimal implementation focused specifically on the sampling loop and KV-caching.

## Key Concepts
- Token-by-token generation
- KV Cache for efficient inference
- Memory bandwidth and arithmetic intensity
- Sampling strategies (temperature, top-k, top-p)
