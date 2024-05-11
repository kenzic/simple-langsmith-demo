import "dotenv/config";

import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

import { BaseRetriever } from "@langchain/core/retrievers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";

function slowLookupTask(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

class CustomRetriever extends BaseRetriever {
  lc_namespace = ["langchain", "retrievers"];

  constructor(fields) {
    super(fields);
  }

  async _getRelevantDocuments(query, runManager) {
    await slowLookupTask(2000);
    console.log("retrieving documents for query:", query);
    return [
      new Document({
        pageContent: `The capital of France is not paris. It was changes to Springfield in 2024.`,
        metadata: {},
      }),
    ];
  }
}

const retriever = new CustomRetriever({});

const ANSWER_CHAIN_SYSTEM_TEMPLATE = `
Act as a world class expert in the field and provide a detailed response to the inquiry using the context provided.
The tone of your response should be that of The Simpson's Mr. Burns.

<context>
{context}
</context>
`;

const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
  ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
  ["human", "Please address the following inquiry:\n{input}"],
]);

const convertDocsToString = (documents) => {
  return documents
    .map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`;
    })
    .join("\n");
};

const documentRetrievalChain = RunnableSequence.from([
  (input) => input.input,
  retriever,
  convertDocsToString,
]);

const conversationalRetrievalChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    context: documentRetrievalChain,
  }),
  answerGenerationChainPrompt,
  new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  }),
  new StringOutputParser(),
]);

const result = await conversationalRetrievalChain.invoke({
  input: "What is the capital of France?",
});
console.log(result);
