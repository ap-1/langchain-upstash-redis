import { type NextRequest } from "next/server";
import { LangChainStream, StreamingTextResponse } from "ai";
import { Redis } from "@upstash/redis";

import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";

export const runtime = "edge";

export async function POST(req: NextRequest) {
	const { messages } = await req.json();
	const { stream, handlers } = LangChainStream();

	const latestMessage = messages[messages.length - 1];

	const memory = new BufferMemory({
		chatHistory: new UpstashRedisChatMessageHistory({
			sessionId: new Date().toLocaleDateString(),
			client: Redis.fromEnv(),
		}),
	});

	const model = new ChatOpenAI({
		modelName: "gpt-3.5-turbo",
		streaming: true,
	});

	const chain = new ConversationChain({ llm: model, memory });

	chain.call({
		input: latestMessage.content,
		callbacks: [handlers],
	});

	return new StreamingTextResponse(stream);
}
