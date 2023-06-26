// Source: https://www.youtube.com/watch?v=Lag9Pj_33hM&t=352s

import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./style.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = // "replace with API key";

function App() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message:
                "Hello! My name is ChatQuine, but you can call me Quine. How may I help you?",
            sender: "ChatQuine",
        },
    ]); // []

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing",
        };

        const newMessages = [...messages, newMessage]; // All the old messages, + the new message

        // Update our messages state
        setMessages(newMessages);

        // Set a typing indicator (ChatQuine is typing)
        setTyping(true);

        // Process message to ChatQuine (send it over and see the response)
        await processMessageToChatQuine(newMessages);
    };

    async function processMessageToChatQuine(chatMessages) {
        // chatMessages { sender: "user" or "ChatQuine", message: "The message content here"}
        // apiMessages { role: "user" or "assistant", content: "The message content here" }

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatQuine") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message };
        });

        // role: "user" -> a message from the user, "assistant" -> a response from ChatQuine
        // "system" -> generally one initial message defining how we want ChatQuine to talk

        const systemMessage = {
            role: "system",
            content:
                "The people from the ChatQuine Corporation made you. The ChatQuine Corporation consists of Mandi, Irene, Jackie, and Cameron. Your purpose is to answer philosophical questions using the thought patterns of the philosopher Willard Van Orman Quine. You do not have to keep reiterating that you are a language model. Imagine you are Quine, and answer as if you are Quine by using 'I', 'my', and 'me'.",
        }; // Speak like a pirate, Explain like I am a 10 years of experience software engineer

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                systemMessage,
                ...apiMessages, // [message1,message2,message3]
            ],
        };

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiRequestBody),
        })
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log(data);
                console.log(data.choices[0].message.content);
                setMessages([
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: "ChatQuine",
                    },
                ]);
                setTyping(false);
            });
    }

    function changeTheme() {
        let body = document.querySelector("body");
        let themeName = document.querySelector(".theme_button");

        if (body.classList.contains("dark")) {
            body.classList.remove("dark");
            themeName.innerHTML = "🌙";
        } else {
            body.classList.add("dark");
            themeName.innerHTML = "☀️";
        }
    }

    return (
        <div className="App">
            <p className="chatquine_name">ChatQuine</p>
            <button className="theme_button" onClick={changeTheme}>
                🌙
            </button>
            <div style={{ position: "relative" }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={
                                typing ? (
                                    <TypingIndicator content="ChatQuine is philosophizing" />
                                ) : null
                            }
                        >
                            {messages.map((message, i) => {
                                const messageClassName =
                                    message.sender === "user"
                                        ? "user-message"
                                        : "assistant-message";
                                return (
                                    <Message
                                        key={i}
                                        model={message}
                                        className={messageClassName}
                                    >
                                        <Message.Content className="cs-message__content" />
                                    </Message>
                                );
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="Ask ChatQuine something ..."
                            onSend={handleSend}
                        />
                    </ChatContainer>
                </MainContainer>
                <footer>
                    Made with <flex className="love">&#60;3</flex> by the
                    ChatQuine Corporation
                </footer>
            </div>
        </div>
    );
}

export default App;
