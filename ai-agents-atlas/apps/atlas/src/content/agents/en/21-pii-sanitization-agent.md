---
title: "PII Sanitization Agent"
description: "Redacts emails, phones, national IDs, bank accounts, and API keys from text before it reaches an LLM."
framework: "cross"
llm: "Configurable"
industry: "Privacy / Compliance"
difficulty: "advanced"
tags: ["privacy", "compliance", "pii", "redaction"]
language: "Python"
entrypoint: "agent.py"
requirements: "requirements.txt"
githubPath: "agents/21-pii-sanitization-agent"
publishedAt: 2025-12-04
order: 21
objectives:
  - "Detect PII with high recall across locales"
  - "Fail-closed when uncertain"
  - "Generate on-chain proof of sanitisation via TrustBoost"
---

Redacts PII (emails, phones, national IDs, bank accounts, API keys) from text before it reaches an LLM. Fail-closed, multilingual, with on-chain proof via TrustBoost.

## Why this matters

Most agent demos skip the boring-but-critical question: *what happens to the user's data before it leaves their machine?* This agent is a defensive layer you can drop in front of any LLM call.

## Quick start

```bash
cd agents/21-pii-sanitization-agent
pip install -r requirements.txt
python agent.py --input "Email me at john.doe@example.com or call +1-555-0123"
```

## What it does

- Multi-pattern detection (regex + lightweight NER).
- Locale-aware phone / ID / bank-account formats.
- Substitution strategy: per-field hashes or `REDACTED:EMAIL` placeholders.
- Optional TrustBoost integration for a tamper-evident audit trail.