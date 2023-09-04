"use client";

import { useChat } from "ai/react";

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	return (
		<main>
			<section>
				{messages.map((message) => (
					<p key={message.id}>{message.content}</p>
				))}
			</section>

			<form onSubmit={handleSubmit}>
				<input
					value={input}
					onChange={handleInputChange}
					placeholder="Enter a message..."
				/>
				<button type="submit">Send</button>
			</form>
		</main>
	);
}
