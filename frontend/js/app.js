// Initialize Framer Motion for animations
const { animate, inView, stagger } = window.Motion;

// DOM Elements
const chatForm = document.getElementById('chat-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// Demo responses
const demoResponses = {
    "hello": "Hello! I'm your educational AI assistant. How can I help you today?",
    "hi": "Hi there! What would you like to learn about today?",
    "who are you": "I'm an AI Educational Bot designed to help answer your questions and make learning more accessible.",
    "how does this work": "Simply type your question in the input field, and I'll provide an answer. You can also listen to the response by clicking the Listen button on any message.",
    "what can you do": "I can answer educational questions, provide explanations on various topics, and offer the information in both text and audio formats for better accessibility."
};

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    // Animate the welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    animate(welcomeMessage, { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.3 });

    // Set up form submission
    chatForm.addEventListener('submit', handleSubmit);

    // Set up inView animations
    inView('.intro h2', () => {
        animate('.intro h2', { opacity: [0, 1], y: [20, 0] }, { duration: 0.8 });
        return false; // Only animate once
    });

    inView('.intro p', () => {
        animate('.intro p', { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.2 });
        return false; // Only animate once
    });
});

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    // Disable input during processing
    setLoading(true);

    // Add user message to chat
    addMessage(question, 'user');

    // Clear input
    questionInput.value = '';

    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get response from demo responses or generate a default one
        const answer = demoResponses[question.toLowerCase()] ||
            `This is a demonstration of the AI Educational Bot interface. In a production environment, this would connect to a backend API that provides real AI-generated responses to your question: "${question}"`;

        // Add AI response
        addMessage(answer, 'ai');
    } catch (error) {
        console.error('Error:', error);
        addMessage("Sorry, I couldn't process your request at the moment. Please try again.", 'ai');
    } finally {
        setLoading(false);
    }
}

// Add message to chat
function addMessage(text, type) {
    // Remove welcome message if it exists
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.style.opacity = 0;
    messageDiv.style.transform = 'translateY(20px)';

    // Create message bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    messageDiv.appendChild(bubbleDiv);

    // Add actions for AI messages
    if (type === 'ai') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        // Listen button
        const listenButton = document.createElement('button');
        listenButton.className = 'action-button';
        listenButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 8.5C15.5 8.5 16 9.5 16 12C16 14.5 15.5 15.5 15.5 15.5M12 7C12 7 13 8 13 12C13 16 12 17 12 17M8.5 8.5C8.5 8.5 8 9.5 8 12C8 14.5 8.5 15.5 8.5 15.5M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Listen
        `;
        listenButton.addEventListener('click', () => textToSpeech(text));

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'action-button';
        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Copy
        `;
        copyButton.addEventListener('click', () => copyToClipboard(text));

        actionsDiv.appendChild(listenButton);
        actionsDiv.appendChild(copyButton);
        messageDiv.appendChild(actionsDiv);
    }

    // Add to chat box
    chatBox.appendChild(messageDiv);

    // Animate the new message
    animate(messageDiv, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5 });

    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Set loading state
function setLoading(isLoading) {
    questionInput.disabled = isLoading;
    sendButton.disabled = isLoading;

    if (isLoading) {
        sendButton.classList.add('loading');
    } else {
        sendButton.classList.remove('loading');
    }
}

// Text to speech
function textToSpeech(text) {
    if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in your browser.');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Speak
    window.speechSynthesis.speak(utterance);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // Show feedback (could be more elaborate)
            const feedback = document.createElement('div');
            feedback.textContent = 'Copied!';
            feedback.style.position = 'fixed';
            feedback.style.bottom = '20px';
            feedback.style.left = '50%';
            feedback.style.transform = 'translateX(-50%)';
            feedback.style.padding = '0.5rem 1rem';
            feedback.style.backgroundColor = 'var(--color-gray-800)';
            feedback.style.color = 'var(--color-foreground)';
            feedback.style.borderRadius = 'var(--border-radius)';
            feedback.style.opacity = '0';
            document.body.appendChild(feedback);

            // Animate feedback
            animate(feedback,
                { opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] },
                { duration: 2, times: [0, 0.1, 0.9, 1] }
            ).then(() => {
                document.body.removeChild(feedback);
            });
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
} 