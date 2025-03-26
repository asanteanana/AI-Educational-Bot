// Import Framer Motion for basic animations
import { animate, inView, stagger } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const chatForm = document.getElementById('chat-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// Demo responses to simulate a backend
const demoResponses = {
    "hello": "Hello! I'm Knowledge, your learning companion. How can I help you today?",
    "who are you": "I'm Knowledge, an assistant designed to help you learn and explore new topics. I'm here to answer questions and assist with your learning journey.",
    "what can you do": "I can help you learn about various topics, answer questions, and provide explanations to assist with understanding complex concepts.",
    "help": "You can ask me questions about different topics or request explanations of concepts. Just type your question, and I'll do my best to help.",
    "thanks": "You're welcome! If you have more questions, feel free to ask.",
};

// Backend API simulation
const simulateAPIResponse = async (question) => {
    // Simulate network latency (300-800ms)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Normalize the question by removing punctuation and converting to lowercase
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Check for keywords in the question
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Fallback responses
    const fallbackResponses = [
        "That's an interesting question. In a full implementation, I would connect to a knowledge database to provide a comprehensive answer.",
        "I understand you're asking about that topic. Could you try a different question for this demo?",
        "That's a good question. In the complete version, I would provide a detailed response.",
        "For this demo, I can help with basic questions. Is there another topic I could help you explore?",
        "I'd need to connect to a complete knowledge base to give you a thorough answer on this topic."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create the typing indicator element
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Create 3 dots for the typing animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        bubble.appendChild(dot);
    }

    typingIndicator.appendChild(bubble);
    return typingIndicator;
};

// Simple notification function
const showNotification = (message, duration = 2000) => {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
};

// Initialize chat
const initChat = () => {
    // Focus the input field when the page loads
    questionInput.focus();

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = questionInput.value.trim();

        if (!question) return;

        // Disable form while processing
        questionInput.disabled = true;
        sendButton.disabled = true;
        sendButton.classList.add('loading');

        // Add user message
        addMessage(question, 'user');

        // Clear input
        questionInput.value = '';

        // Add typing indicator
        const typingIndicator = createTypingIndicator();
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Animate typing dots (simple CSS animation)
        const dots = typingIndicator.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.style.animation = `typingDot 1s ${i * 0.2}s infinite`;
        });

        try {
            // Simulate API request to backend
            const response = await simulateAPIResponse(question);

            // Remove typing indicator
            typingIndicator.remove();

            // Add AI response
            addMessage(response, 'ai');
        } catch (error) {
            console.error('Error:', error);

            // Remove typing indicator
            typingIndicator.remove();

            // Add error message
            addMessage("I'm having trouble connecting right now. Please try again later.", 'ai');
        } finally {
            // Re-enable form
            questionInput.disabled = false;
            sendButton.disabled = false;
            sendButton.classList.remove('loading');
            questionInput.focus();
        }
    });
};

// Function to add message to chat
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    messageElement.appendChild(bubble);
    chatBox.appendChild(messageElement);

    // Simple fade-in animation
    messageElement.style.opacity = '0';
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 10);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add actions for AI messages
    if (sender === 'ai') {
        const actions = document.createElement('div');
        actions.className = 'actions';

        // Listen button for text-to-speech
        const listenButton = document.createElement('button');
        listenButton.className = 'action-button';
        listenButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg> Listen';

        listenButton.addEventListener('click', () => {
            speak(text);
        });

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'action-button';
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';

        copyButton.addEventListener('click', () => {
            copyToClipboard(text);
        });

        actions.appendChild(listenButton);
        actions.appendChild(copyButton);
        messageElement.appendChild(actions);
    }
}

// Text-to-speech function
const speak = (text) => {
    if (!window.speechSynthesis) {
        showNotification("Text-to-speech is not supported in your browser");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Try to get a good voice
    const findVoiceByName = (nameFragment) => {
        return voices.find(voice =>
            voice.name.toLowerCase().includes(nameFragment.toLowerCase())
        );
    };

    // Select voice
    const selectedVoice = findVoiceByName('Samantha') ||
        findVoiceByName('Google US English') ||
        voices.find(voice => voice.lang === 'en-US') ||
        voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Show notification
    utterance.onstart = () => {
        showNotification("Playing audio...");
    };

    window.speechSynthesis.speak(utterance);
};

// Copy text to clipboard
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification("Copied to clipboard");
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification("Failed to copy text");
        });
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge chat initialized');

    // Initialize chat
    initChat();

    // Add simple CSS for the typing animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typingDot {
            0%, 100% { opacity: 0.5; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-2px); }
        }
    `;
    document.head.appendChild(style);

    // Listen for voices to load (needed in some browsers)
    if (window.speechSynthesis) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => console.log('Voices loaded');
        }
    }
}); 