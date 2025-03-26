// Initialize Framer Motion for animations
const { animate, inView, stagger, transform } = window.Motion;

// DOM Elements
const chatForm = document.getElementById('chat-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// Demo responses with Apple-style language
const demoResponses = {
    "hello": "Hello! I'm Knowledge, your personal learning assistant. How can I help you discover something new today?",
    "hi": "Hi there! I'm ready to help you explore any topic you're curious about.",
    "who are you": "I'm Knowledge, an AI assistant designed by Apple to make learning intuitive and accessible. I'm here to answer questions and provide insights on virtually any topic.",
    "how does this work": "Just type your question in the input field below, and I'll respond with helpful information. You can also tap the Listen button to hear the response read aloud. It's that simple.",
    "what can you do": "I can answer questions about almost any topic, explain complex concepts in simple terms, and even read my responses aloud for easier learning. I'm designed to be your personal knowledge companion."
};

// Typing indicator animation
const createTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatBox.appendChild(typingDiv);

    // Animate dots
    const dots = typingDiv.querySelectorAll('.dot');
    animate(dots,
        { opacity: [0.4, 1, 0.4], y: [0, -6, 0] },
        {
            duration: 1.2,
            repeat: Infinity,
            delay: stagger(0.2)
        }
    );

    return typingDiv;
};

// Create notification message
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    animate(notification,
        { opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] },
        { duration: 2.5, times: [0, 0.1, 0.9, 1] }
    ).then(() => {
        document.body.removeChild(notification);
    });
};

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    // Focus input field
    setTimeout(() => {
        questionInput.focus();
    }, 500);

    // Animate the welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    animate(welcomeMessage,
        { opacity: [0, 1], scale: [0.95, 1] },
        { duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }
    );

    // Set up form submission
    chatForm.addEventListener('submit', handleSubmit);

    // Set up inView animations with Apple-style spring animations
    inView('.intro h2', ({ target }) => {
        animate(target,
            { opacity: [0, 1], y: [30, 0] },
            { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        );
        return false; // Only animate once
    });

    inView('.intro p', ({ target }) => {
        animate(target,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }
        );
        return false; // Only animate once
    });

    // Add date separator animation
    const dateDivider = document.querySelector('.date-divider');
    animate(dateDivider,
        { opacity: [0, 1] },
        { duration: 0.8, delay: 0.1 }
    );
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

    // Create typing indicator
    const typingIndicator = createTypingIndicator();

    try {
        // Simulate API delay with natural timing variation (Apple-style attention to detail)
        const delay = 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Remove typing indicator
        typingIndicator.remove();

        // Get response from demo responses or generate a default one
        let answer;
        if (demoResponses[question.toLowerCase()]) {
            answer = demoResponses[question.toLowerCase()];
        } else {
            // Create a more Apple-style generic response
            const genericResponses = [
                `I'd be happy to help with "${question}". In the full version, I would connect to Apple's knowledge base to provide accurate information on this topic.`,
                `That's an interesting question about "${question}". When fully implemented, I'd use Apple's advanced learning models to give you a comprehensive answer.`,
                `I understand you're asking about "${question}". In the production version, I would draw from a vast knowledge base to provide you with precise information.`
            ];
            answer = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }

        // Add AI response
        addMessage(answer, 'ai');
    } catch (error) {
        console.error('Error:', error);
        // Remove typing indicator
        typingIndicator.remove();
        addMessage("I'm sorry, I couldn't process your request at the moment. Please try again.", 'ai');
    } finally {
        setLoading(false);
    }
}

// Add message to chat
function addMessage(text, type) {
    // Remove welcome message if it exists
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        animate(welcomeMessage,
            { opacity: [1, 0], height: [welcomeMessage.offsetHeight, 0] },
            { duration: 0.3 }
        ).then(() => {
            welcomeMessage.remove();
        });
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.style.opacity = 0;

    // Create message bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    messageDiv.appendChild(bubbleDiv);

    // Add actions for AI messages
    if (type === 'ai') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        actionsDiv.style.opacity = 0;

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

    // Apple-style spring animations
    animate(messageDiv,
        { opacity: [0, 1], scale: [0.98, 1], y: [10, 0] },
        { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    );

    // Animate actions with slight delay
    if (type === 'ai') {
        const actionsDiv = messageDiv.querySelector('.actions');
        animate(actionsDiv,
            { opacity: [0, 1] },
            { duration: 0.4, delay: 0.3 }
        );
    }

    // Scroll to the bottom with smooth animation
    const targetScroll = chatBox.scrollHeight;
    animate(chatBox, { scrollTop: targetScroll }, { duration: 0.5, ease: [0.23, 1, 0.32, 1] });
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

// Text to speech with Apple-like voice settings
function textToSpeech(text) {
    if (!('speechSynthesis' in window)) {
        showNotification("Text-to-speech is not supported in your browser.");
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.97; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Try to select a higher quality voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = ['Samantha', 'Alex', 'Daniel', 'Google US English', 'Microsoft Zira'];

    for (const preferredVoice of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferredVoice));
        if (voice) {
            utterance.voice = voice;
            break;
        }
    }

    // Show feedback notification
    showNotification("Playing audio...");

    // Speak
    window.speechSynthesis.speak(utterance);
}

// Copy to clipboard with Apple-style feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification("Copied to clipboard");
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            showNotification("Couldn't copy text");
        });
} 