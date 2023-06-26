# ChatQuine Analysis Notebook

_Mandi Li, Irene Bui Anh Thu, Jackie Mok, and Cameron Meinsma_

---

## Table of Contents

1. Introduction
2. User Manual
3. App.jsx File
4. style.css File
5. index.html File

---
## Introduction

This Analysis Notebook consists of both a user manual to help you run the ChatQuine interface on your own computer, as well as an analysis of the different code blocks in the App.jsx, style.css, and index.html files.

Furthermore, we used the YouTube video called [Build A Chatbot With The ChatGPT API In React (gpt-3.5-turbo Tutorial)](https://www.youtube.com/watch?v=Lag9Pj_33hM&t=0m00s) to code the larger portion of the `App.jsx` file. Moreover, we came up with the whole `style.css` file ourselves. Finally, we kept most of the `index.html` file true to its original state.

---
## User Manual

**Requirements:**

-   Have [Node.js](https://nodejs.org/en/download) installed
-   Have npm installed
-   Put the API key in the App.jsx file at the given place

For more information regarding installing Node.js and npm, see: [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

1. Click on the "Code" or "Clone" button to get the URL of the repository.
2. Click "Download ZIP".
3. Extract the ZIP file to a location on your computer.
4. Open a command prompt or terminal on your computer. In VSCode you can press `Ctrl+Shft+`\` to open a terminal.
5. In the terminal, navigate to the folder where you extracted the ZIP file. You can use the `cd` command.
6. In the command prompt or terminal type the following line of code: `npm run dev`.
7. Click on the Local host server URL. E.g. `http://localhost:5173/`.
8. You can now interact with the ChatQuine interface.

---
## App.jsx File

_Line 3 - 14:_

```
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
```

We imported certain modules and components that are part of the chatscope library. Furthermore, we linked the `App.css` and `style.css` stylesheets to the `App.jsx` file.

_Line 16:_

```
const API_KEY = "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";
```

We linked the API key to a variable called `API_KEY`. We created this key by following the steps below:

1. Creating an OpenAI account on the [OpenAI Website](https://openai.com/).
2. Clicking on 'API - Integrate OpenAI models into your application or business'.
3. Clicking on 'Personal'.
4. Clicking on 'View API keys'.
5. Clicking on 'Create new secret key'.
6. Naming the new secret key.
7. Clicking on 'Create secret key'.
8. Copying the API key.

_Line 18 - 26:_

```
function App() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message:
                "Hello! My name is ChatQuine, but you can call me Quine. How may I help you?",
            sender: "ChatQuine",
        },
    ]); // []
```

We created the first portion of our function called `App`. This portion stores the `useStates`. Furthermore, this block of code stores the first message of every ChatQuine conversation, which goes as follows: 'Hello! My name is ChatQuine, but you can call me Quine. How may I help you?'. Moreover, it is in this block of code that we named the assistant ChatQuine. The assistant is who the user will interact with during each session.

_line 28 - 45:_

```
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
```

The `handleSend` function is triggered when the user sends a message to ChatQuine. Moreover, it informs ChatQuine about the fact that the user has sent a new message, waiting to be answered by ChatQuine. While ChatQuine is generating a response, the text 'ChatQuine is Philosophising' will show up on the bottom left corner of the screen, to let the user know that ChatQuine is generating a response. This occurs due to the `setTyping(true);` line in the `handleSend` function. In other words, this function makes sure that the user gets a response from ChatQuine.

_Line 47 - 59:_

```
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
```

the `processMessageToChatQuine` function utilizes an array of chat messages, which will be processed. The processing will include giving the messages a `role` which will be based on the `sender` of the messages in question. Furthermore, this function will create an array called `apiMessages`. This array will contain the messages together with the `role` that they were assigned. The available roles are `assistant` and `user`.

_Line 61 - 68:_

```
        // role: "user" -> a message from the user, "assistant" -> a response from ChatQuine
        // "system" -> generally one initial message defining how we want ChatQuine to talk

        const systemMessage = {
            role: "system",
            content:
                "The people from the ChatQuine Corporation made you. The ChatQuine Corporation consists of Mandi, Irene, Jackie, and Cameron. Your purpose is to answer philosophical questions using the thought patterns of the philosopher Willard Van Orman Quine. You do not have to keep reiterating that you are a language model. Imagine you are Quine, and answer as if you are Quine by using 'I', 'my', and 'me'.",
        }; // Speak like a pirate, Explain like I am a 10 years of experience software engineer
```

We gave the `system` `role` content regarding who made ChatQuine, what the purpose of ChatQuine is, and how to respond to messages from the user.

_Line 70 - 76:_

```
        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                systemMessage,
                ...apiMessages, // [message1,message2,message3]
            ],
        };
```

This code snippet defines the specific model that we want to use, which in our case is the 'gpt-3.5-turbo' model. Furthermore, this code block makes sure that every conversation starts with the system message and is followed by the conversation history. This is achieved by passing an array with those messages in that order to the OpenAI API.

_Line 78 - 101:_

```
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
```

This code snippet results in the OpenAI API receiving a request to give a response to the user. This response will then be logged to the console, which in turn will update the message state as well as turn off the typing indicator.

_Line 103 - 114:_

```
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
```

We came up with the `changeTheme` function ourselves. This function makes it possible for the user to change the theme from light to dark and vice versa. This function will solely run when the button in charge of changing the theme is clicked. The `document.querySelector("body");` selects the body element and assigns it to the `body` variable. The `document.querySelector(".theme_button");` selects the button that is capable of changing the theme, and assigns it to the `themeName` variable. The `if-else` statement removes the `dark` class if the `body` element contains it. Furthermore, in such cases, the `themeName.innerHTML = "🌙";` will change the sun emoji, which is part of the button text, to the crescent moon emoji. However, if the `body` element does not contain the `dark` class, it will be added to the `body` element. Moreover, the `themeName.innerHTML = "☀️";` will then change the crescent moon emoji to the sun emoji.

_Line 116 - 121:_

```
    return (
        <div className="App">
            <p className="chatquine_name">ChatQuine</p>
            <button className="theme_button" onClick={changeTheme}>
                🌙
            </button>
```

This is the start of the html that will be returned. Furthermore, line 118 - 121 were not part of the YouTube video, and instead we came up with it ourselves. Moreover, we used the `className` property to give the ChatQuine paragraph element a class name of `chatquine_name`. We did this so we could style the element in the `style.css` file. Furthermore, we created a button which, when clicked, will trigger the `changeTheme` function.

_Line 122 - 148:_

```
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
```

The `TypingIndicator` is set to 'ChatQuine is philosophizing', which will show up when ChatQuine is generating an answer to a message that a user sends. Furthermore, the `MessageList` tag contains all of the messages that are in the array which was created earlier on in the `App` function.

_Line 149 - 154:_

```
                        MessageInput
                            placeholder="Ask ChatQuine something ..."
                            onSend={handleSend}
                        />
                    </ChatContainer>
                </MainContainer>
```

The `MessageInput` tag has a placeholder which states 'Ask ChatQuine something ...', indicating to the user that they can input text in the message input content editor.

_Line 155 - 164:_

```
                <footer>
                    Made with <flex className="love">&#60;3</flex> by the
                    ChatQuine Corporation
                </footer>
            </div>
        </div>
    );
}

export default App;
```

We came up with line 155 - 158 ourselves. The footer element will show the text 'Made with <3 by the ChatQuine Corporation' at the bottom of the interface. Furthermore the `export default App` will export the `App` function.

---
## style.css File

_Line 1 & 2:_

```
body {
    background: linear-gradient(0.25turn, #c294de 0%, #9497de 100%);
}
```

This sets the background of the `body` element to a gradient that goes from left to right. Moreover, the color on the left side of the screen is the same as the ChatQuine messages that are part of the light theme. The color on the right side of the screen is the same as the user messages that are part of the light theme.

_Line 5 - 10:_

```
footer {
    text-align: center;
    font-size: 12px;
    line-height: 35px;
    color: white;
}
```

The `footer` element is centered and styled here.

_Line 12 - 14:_

```
.fa-paperclip {
    display: none;
}
```

The `.fa-paperclip` is set to `none`. This is because we did not have a purpose for that function, which resulted in it unnecessarily taking up space for the message input content editor. Thus, by setting the `display` to `none`, we made sure that it is not visible to the user.

_Line 16 - 18:_

```
.fa-paper-plane {
    margin: 6px 0px;
}
```

We used the `margin` property to make sure that the `.fa-paper-plane` element was vertically in the middle of the message input content editor.

_Line 20 - 22:_

```
.love {
    color: rgb(185, 36, 36);
}
```

We made the '<3' that is part of the `footer` red.

_Line 24 - 30:_

```
.chatquine_name {
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    margin: 0;
    color: #ffffff;
}
```

We styled the 'ChatQuine' text that is visible at the top of the screen.

_Line 32 - 37:_

```
.App {
    max-width: 700px;
    margin: 0 auto;
    padding: 0;
    text-align: left;
}
```

We used `margin: 0 auto;` to make sure that the `cs-main-container` is centered. Furthermore, we set the `text-align` to `left`, which resulted in the text not being aligned in the center anymore, and instead being aligned to the left side of the text bubbles.

_Line 39 - 48:_

```
.theme_button {
    display: block;
    margin: 0 0 10px 653px;
    transition: all 150ms ease-in-out;
    font-size: 11px;
    background: #c294de;
    padding: 5 8px;
    border-radius: 35px;
    border: 2px solid #c294de;
}
```

We styled the button that is capable of changing the theme. Moreover we added a `transition` property. This property uses the `ease-in-out` effect when the user hovers over the button.

_Line 50 - 54:_

```
.theme_button:hover {
    cursor: pointer;
    border: 2px solid #c294de;
    background: white;
}
```

We styled the button capable of changing the theme, when a user hovers over the button. Moreover, the `cursor: pointer;` line results in the cursor transforming into a pointer, the moment a user hovers over this button.

_Line 56 - 59:_

```
.theme_button:focus {
    outline: none;
    box-shadow: none;
}
```

We used the [How to remove focus around buttons on click](https://stackoverflow.com/questions/19053181/how-to-remove-focus-around-buttons-on-click) post on stackoverflow to figure out how to change the design of the button back to its original state after being clicked, instead of it staying in the clicked state.

_Line 61 - 67:_

```
.cs-main-container {
    border-radius: 20px;
    border: 2px solid rgb(255, 255, 255);
    height: 69.14vh;
    overflow: hidden;
    margin: 0;
}
```

We styled the main chat container.

_Line 69 - 81:_

```
/* Assistant message */
.assistant-message .cs-message__content {
    margin: 2px;
    background-color: #c294de;
    color: #fff;
}

.assistant-message .cs-message__content-wrapper {
    margin: 10px 0px 0px 5px;
    border-radius: 0px 30px 30px 30px;
    background: #c294de;
    overflow: hidden;
}
```

We styled the assistant messages. Furthermore, we made sure that if the messages were rather long, the text would not spill out of the text bubbles, due to its rounded corners.

_Line 83 - 95:_

```
/* User message */
.user-message .cs-message__content {
    margin: 2px;
    background-color: #9497de;
    color: #fff;
}

.user-message .cs-message__content-wrapper {
    border-radius: 30px 0px 30px 30px;
    background: #9497de;
    margin: 10px 5px 0px 0px;
    overflow: hidden;
}
```

We styled the user messages. Furthermore, we made sure that the user text would not spill out of the text bubbles either.

_Line 97 - 108:_

```
.cs-message-input__content-editor {
    background: #e1dddd;
    padding: 0 12px;
}

.cs-message-input__content-editor-wrapper {
    margin: 10px 0px 5px;
    background: #e1dddd;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 100px;
    overflow: hidden;
}
```

We styled the message input content editor as well as the wrapper of the message input content editor.

_Line 110 - 183:_

```
/* DARKMODE */
.dark {
    background: linear-gradient(0.25turn, #7f6292 0%, #67699b 100%);
}

.dark .chatquine_name {
    color: rgb(0, 0, 0);
}

.dark .theme_button {
    background: #7f6292;
    padding: 5 8px;
    border-radius: 35px;
    border: 2px solid #7f6292;
}

.dark .theme_button:hover {
    background: white;
}

.dark .cs-chat-container {
    background: rgb(36, 35, 38);
}

.dark .cs-main-container {
    border-radius: 20px;
    border: 2px solid rgb(36, 35, 38);
    height: 69.14vh;
    overflow: hidden;
    margin: 0;
}

.dark .cs-typing-indicator {
    background: rgb(36, 35, 38);
}

.dark .cs-message-list {
    background: rgb(36, 35, 38);
}

/* Assistant message */
.dark .assistant-message .cs-message__content {
    background-color: #7f6292;
}

.dark .assistant-message .cs-message__content-wrapper {
    background: #7f6292;
}

/* User message */
.dark .user-message .cs-message__content {
    background-color: #67699b;
}

.dark .user-message .cs-message__content-wrapper {
    background: #67699b;
}

.dark .cs-message-input__content-editor {
    background: #e1dddd;
    color: rgb(0, 0, 0);
}

.dark .cs-message-input__content-editor-wrapper {
    background: #e1dddd;
}

.dark .cs-message-input {
    background: rgb(36, 35, 38);
}

.dark footer {
    color: rgb(0, 0, 0);
}
```

Creating a dark mode was relatively easy yet tedious, due to the fact that we predominantly had to change the colors of the multitude of CSS properties. One rather noticeable change is the background color. To illustrate, in dark mode, the color on the left side of the screen is the same as the ChatQuine messages that are part of the dark theme, whereas the color on the right side of the screen is the same as the user messages that are part of the dark theme.

---
## index.html File

_Line 1 - 13:_

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ChatQuine | ChatQuine Corporation</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
    </body>
</html>
```

In the `index.html` file, we solely changed the title element to `ChatQuine | ChatQuine Corporation`.
