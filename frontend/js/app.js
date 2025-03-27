// Import Framer Motion for refined animations
import { animate, motion, spring } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const welcomeMessage = document.getElementById('welcome-message');
const conversationContainer = document.getElementById('conversation-container');
const qaContainer = document.getElementById('qa-container');
const newConversationButton = document.getElementById('new-conversation');
const voiceInputButton = document.getElementById('voice-input-button');
const lightModeButton = document.getElementById('light-mode-button');
const darkModeButton = document.getElementById('dark-mode-button');
const conversation = document.getElementById('conversation');

// Topic buttons
const topicButtons = document.querySelectorAll('.topic-button');

// Educational-focused responses with clear, helpful language
const demoResponses = {
    "hello": "Hello! I'm your personal assistant. How can I help you today?",
    "who are you": "I'm an AI assistant designed to help you with information, answer questions, and assist with various tasks.",
    "what can you do": "I can answer questions on many topics, provide explanations, suggest ideas, and offer information in both text and audio formats.",
    "help": "I'd be happy to help! Just ask me any question or tell me what you need assistance with. I can explain concepts, provide information, or help you solve problems.",
    "thanks": "You're welcome! If you need anything else, feel free to ask. I'm here to help.",
};

// Simulate retrieval of information
const simulateAPIResponse = async (question) => {
    // Simulate network latency (300-800ms for realistic response)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Process query
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Information lookup
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Fallback responses
    const fallbackResponses = [
        "That's an interesting question! While I don't have specific information on this topic right now, I'd be happy to help with something else.",
        "Great question! In a fully developed system, I'd provide you with a detailed answer about this topic.",
        "I appreciate your curiosity! If you'd like to know about something else, just let me know.",
        "Thanks for asking! While I can't provide a complete answer to this specific question right now, I'd be glad to help with other topics.",
        "That's a thoughtful question. While I don't have all the details on this particular topic, feel free to ask me about something else."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a minimal typing indicator
const createTypingIndicator = () => {
    const template = document.getElementById('typing-indicator-template');
    return template.content.cloneNode(true);
};

// Enhanced notification with subtle animation
const showNotification = (message, duration = 2500) => {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    document.body.appendChild(notification);

    // Animate appearance with spring physics for more natural feel
    setTimeout(() => {
        notification.style.opacity = '0';

        animate(notification, {
            opacity: [0, 1],
            y: [15, 0]
        }, {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1]  // Spring-like curve for better feedback
        });
    }, 10);

    // Remove after duration with smooth exit
    setTimeout(() => {
        animate(notification, {
            opacity: [1, 0],
            y: [0, 10]
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => notification.remove());
    }, duration);
};

// Create a user message
const createUserMessage = (question) => {
    const template = document.getElementById('user-message-template');
    const message = template.content.cloneNode(true);

    message.querySelector('.message-text').textContent = question;

    return message;
};

// Create an assistant message
const createAssistantMessage = (answer) => {
    const template = document.getElementById('assistant-message-template');
    const message = template.content.cloneNode(true);

    message.querySelector('.message-text').textContent = answer;

    return message;
};

// Handle the submission of a question with subtle animations
const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = createUserMessage(question);
    conversation.appendChild(userMessage);

    // Add typing indicator
    const typingIndicator = createTypingIndicator();
    conversation.appendChild(typingIndicator);

    // Scroll to bottom
    conversation.scrollTop = conversation.scrollHeight;

    try {
        // Simulate information retrieval
        const response = await simulateAPIResponse(question);

        // Remove typing indicator
        const typingElement = conversation.querySelector('.typing').parentNode.parentNode;
        conversation.removeChild(typingElement);

        // Add assistant message
        const assistantMessage = createAssistantMessage(response);
        conversation.appendChild(assistantMessage);

        // Animate the new message
        const messageElement = assistantMessage.querySelector('.message');
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';

        animate(messageElement, {
            opacity: [0, 1],
            y: [10, 0]
        }, {
            duration: 0.4,
            delay: 0.1,
            ease: [0.34, 1.56, 0.64, 1]
        });

        // Setup action buttons
        setupActionButtons(messageElement.querySelector('.message-content'), response);

        // Scroll to bottom
        conversation.scrollTop = conversation.scrollHeight;

    } catch (error) {
        // Handle errors gracefully
        const typingElement = conversation.querySelector('.typing').parentNode.parentNode;
        conversation.removeChild(typingElement);

        showNotification("An error occurred. Please try again.");
    }
};

// Setup action buttons with subtle animations
const setupActionButtons = (messageContent, answerText) => {
    const playAudioButton = messageContent.querySelector('.play-audio-button');
    const regenerateButton = messageContent.querySelector('.regenerate-button');
    const downloadAudioButton = messageContent.querySelector('.download-audio-button');

    // Set up audio playback
    let isSpeaking = false;

    playAudioButton.addEventListener('click', async () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            playAudioButton.textContent = 'Listen';
            return;
        }

        try {
            await speak(answerText);
            isSpeaking = true;
            playAudioButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
            </svg>
            Stop`;

            // Reset when speech ends
            window.speechSynthesis.addEventListener('end', () => {
                isSpeaking = false;
                playAudioButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
                Listen`;
            }, { once: true });

        } catch (error) {
            showNotification('Could not play audio. Please try again.');
        }
    });

    // Set up regenerate button
    regenerateButton.addEventListener('click', async () => {
        try {
            // Get the question from the previous message
            const question = messageContent.parentNode.previousElementSibling.querySelector('.message-text').textContent;

            // Get new response
            const newResponse = await simulateAPIResponse(question);

            // Update answer text
            messageContent.querySelector('.message-text').textContent = newResponse;

            // Show notification
            showNotification('Response regenerated');

        } catch (error) {
            showNotification('Could not regenerate response. Please try again.');
        }
    });

    // Set up download audio button
    downloadAudioButton.addEventListener('click', async () => {
        try {
            await downloadAudio(answerText);
            showNotification('Audio file downloaded');
        } catch (error) {
            showNotification('Could not download audio. Please try again.');
        }
    });
};

// Text-to-speech functionality
const speak = (text) => {
    return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Use a more natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Female') || voice.name.includes('Samantha'))
        );

        utterance.voice = preferredVoice || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

        window.speechSynthesis.speak(utterance);
    });
};

// Download audio file
const downloadAudio = async (text) => {
    return new Promise((resolve, reject) => {
        try {
            // In a real implementation, this would convert text to an audio file
            // For demo purposes, we'll just simulate the download
            setTimeout(() => {
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `response-${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            }, 800);
        } catch (error) {
            reject(error);
        }
    });
};

// Setup voice input with visual feedback
const setupVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        voiceInputButton.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    let isListening = false;

    voiceInputButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            return;
        }

        // Clear input
        mainQuestionInput.value = '';
        mainQuestionInput.placeholder = 'Listening...';

        // Show recording state
        voiceInputButton.classList.add('recording');

        recognition.start();
        isListening = true;
    });

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');

        mainQuestionInput.value = transcript;
    };

    recognition.onend = () => {
        isListening = false;
        voiceInputButton.classList.remove('recording');
        mainQuestionInput.placeholder = 'What would you like to know?';

        if (mainQuestionInput.value.trim()) {
            // If we captured something, submit after a short delay
            setTimeout(() => {
                mainForm.dispatchEvent(new Event('submit'));
            }, 300);
        }
    };

    recognition.onerror = () => {
        isListening = false;
        voiceInputButton.classList.remove('recording');
        mainQuestionInput.placeholder = 'What would you like to know?';
    };
};

// Setup theme toggle with smooth transitions
const setupThemeToggle = () => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        lightModeButton.classList.remove('active');
        darkModeButton.classList.add('active');
    }

    // Light mode toggle
    lightModeButton.addEventListener('click', () => {
        if (lightModeButton.classList.contains('active')) return;

        // Animated transition for smoother theme change
        animate(document.body, { opacity: [1, 0.98, 1] }, { duration: 0.3 });

        document.body.classList.remove('dark-mode');
        darkModeButton.classList.remove('active');
        lightModeButton.classList.add('active');
        localStorage.setItem('theme', 'light');

        // Button press feedback
        animate(lightModeButton, { scale: [1, 1.05, 1] }, { duration: 0.3 });
    });

    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        if (darkModeButton.classList.contains('active')) return;

        // Animated transition for smoother theme change
        animate(document.body, { opacity: [1, 0.98, 1] }, { duration: 0.3 });

        document.body.classList.add('dark-mode');
        lightModeButton.classList.remove('active');
        darkModeButton.classList.add('active');
        localStorage.setItem('theme', 'dark');

        // Button press feedback
        animate(darkModeButton, { scale: [1, 1.05, 1] }, { duration: 0.3 });
    });
};

// Setup topic buttons
const setupTopicButtons = () => {
    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.getAttribute('data-topic');
            mainQuestionInput.value = `Tell me about ${topic}`;
            mainForm.dispatchEvent(new Event('submit'));
        });
    });
};

// Initialize the application
const initApp = () => {
    // Setup event listeners
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = mainQuestionInput.value.trim();
        if (question) {
            handleQuestionSubmit(question);
            mainQuestionInput.value = '';
        }
    });

    // Setup voice input
    setupVoiceInput();

    // Setup theme toggle
    setupThemeToggle();

    // Setup topic buttons
    setupTopicButtons();

    // Focus input after load
    setTimeout(() => {
        mainQuestionInput.focus();
    }, 500);
};

// Start the application
document.addEventListener('DOMContentLoaded', initApp); 