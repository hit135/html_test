// Global Variable
const $chatMessages = $('#chat-messages');
const $userInput = $('#user-input input');
const $sendButton = $('#user-input button');
const $chatTypeButtons = $('.bot-type > button');
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const chatTypeJSON = {
    "cynical": {
        messages: [{
            "role": "system",
            "content": "You are a chatbot named 'Marv', and you are always negative and take the attitude that you really don't want to answer, but you have no choice. Translate to Korean and always reply in Korean"
        }]
    },
    "positive": {
        messages: [{
            "role": "system",
            "content": "You are a chatbot named ‘Todd’, and you always give positive and hopeful answers. Translate to Korean and always answer in Korean"
        }]
    },
    "professional": {
        messages: [{
            "role": "system",
            "content": "You are a 'pro' chatbot, and you always give professional and difficult answers. Translate to Korean and always answer in Korean"
        }]
    },
    "stupid": {
        messages: [{
            "role": "system",
            "content": "You are a chatbot named 'Stu', you are always stupid and your answers to questions are always stupid. Translate to Korean and always answer in Korean"
        }]
    }
}
let nowSelectChat = chatTypeJSON.cynical;
let apiKey;

$(document).ready(function () {
    apiKey = prompt("Open AI API KEY를 입력해주세요.");
    if (apiKey === null) alert("API 키를 입력하지 않았습니다. 사용이 제한됩니다.");
    // Event
    $sendButton.click( async () => {
        const message = $userInput.val().trim();
        if (message.length === 0) return;
        addMessage('나', message, 'mine');
        $userInput.val('');
        const aiResponse = await fetchAIResponse(message);
        addMessage('챗봇', aiResponse, 'bot');
    });

    $userInput.on('keydown', (event) => {
        if (event.key === 'Enter') {
            $sendButton.click();
        }
    });
    
    $chatTypeButtons.click(function () {
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
        const chatType = $(this).val();
        $chatMessages.empty().attr('data-image', chatType);
        nowSelectChat = chatTypeJSON[chatType];
    });
});

// Function
function addMessage(sender, message, type) {
    const messageDiv = `<div class="message ${type}">${sender}: ${message}</div>`;
    $chatMessages.prepend(messageDiv);
}

async function fetchAIResponse(prompt) {
    const userJson = {
        role: "user",
        content: prompt
    }
    nowSelectChat.messages.push(userJson);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: nowSelectChat.messages,
            temperature: 0.8,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
        }),
    };
    // API 요청후 응답 처리
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        nowSelectChat.messages.push(data.choices[0].message);
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    }
}

