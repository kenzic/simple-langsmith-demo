# Simple LangSmith Demo

> This is a high-level README. For detailed guide on how to use this project, please refer to the [Medium Article]()

## Setup
1. Clone the reop: `git clone git@github.com:kenzic/simple-langsmith-demo.git`
2. Install dependencies: `yarn`
3. Move .env.example to .env and fill in the following values:
```
LANGCHAIN_API_KEY=<your-api-key>

# OpenAI API is used to make calls to LLM, but not required for using LangSmith
OPENAI_API_KEY=<your-openai-api-key>
```
4. run `yarn start`

## Usage

1. run `yarn start`
2. Go to [LangSmith](https://smith.langchain.com/) and view results.
3. Review Run Trace.
