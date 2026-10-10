# Lesson 1: CLI Agents (The Interface)

Before agents can "think," they need a way to interact with the world. The simplest agent is a CLI tool that parses natural language into command arguments.

## Resources

### GitHub
- [simonw/llm](https://github.com/simonw/llm) – The definitive CLI tool for interacting with LLMs. Study how it handles piping (`cat file.txt | llm "summarize"`) and plugin systems.

### Articles
- [Building a CLI Agent with Python](https://simonwillison.net/2023/May/2/llm-cli/) – Simon Willison explains how to treat LLMs as Unix command-line tools. This is essential for understanding how agents can fit into existing developer workflows.

### YouTube
- [Build a CLI Chatbot with Python & Typer](https://www.youtube.com/watch?v=IVwZs5493yA) – Shows how to build the "frontend" of your agent using `Typer`, which is the industry standard for Python CLIs.

### Notebooks
- [Command Line Assistant](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_call_functions_with_chat_models.ipynb) – OpenAI's cookbook on using "Function Calling" to turn natural language into CLI commands.

## Key Concepts
- Natural language to command parsing
- CLI as the simplest agent interface
- Piping and Unix integration
- Function calling for command generation
