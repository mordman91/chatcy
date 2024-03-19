document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chat-container');
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  let pageContent;

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'updatePageContent') {
      pageContent = message.content;
      console.log('Received pageContent from contentScript:', pageContent);
    }
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageDiv);
  }

  function sendMessage() {
    console.log('Sending message...');
    const systemMessage =
      ('You are a friendly and helpful assistant who loves to assist people. ' +
      'Your task is to answer the users question using only the page content provided below. ' +
      'Your response should be explaned as if you were talking to a 5 year old. ' +
      'If you cannot answer the question based on the page content then say "Sorry the content on this page does not offer that information". ' +
      'Only base your answer on the information found within the page content and dont add any additional information. ' +
      'Here is the page content: ' + pageContent);
    console.log('The system message: ', systemMessage);

    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
      appendMessage('You', userMessage);
      console.log('The user entered:', userMessage);

      // Make a request to the ChatGPT API
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },

        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemMessage},
            { role: 'user', content: userMessage }],
          model: "gpt-3.5-turbo",
        }),
      })

      .then(response => response.json())
      .then(data => {
            console.log('Received data from API:', data);
            appendMessage('ChatGPT', data.choices[0].message.content);})
      .catch(error => console.error('Error:', error));

      // Clear user input
      userInput.value = '';

    }
  }

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
