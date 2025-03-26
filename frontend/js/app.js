// Import Framer Motion for animation
import { animate, inView, stagger, transform } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const chatForm = document.getElementById('chat-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// Demo responses to simulate a backend
// Updated with more OpenAI-like, helpful and accurate responses
const demoResponses = {
    "hello": "Hello! I'm Knowledge, your AI learning companion. How can I help you with today?",
    "who are you": "I'm Knowledge, an AI assistant designed to help you learn and explore new topics. I'm here to answer questions, explain concepts, and assist with your learning journey.",
    "what can you do": "I can help you learn about a wide range of topics, answer questions, provide explanations, and assist with understanding complex concepts. I'm designed to be your personal learning companion. Feel free to ask me anything!",
    "help": "Of course! You can ask me questions about various topics, request explanations of concepts, or get assistance with learning something new. Just type your question, and I'll do my best to help.",
    "thanks": "You're welcome! If you have any more questions or need further assistance, feel free to ask.",
};

// Backend API simulation
const simulateAPIResponse = async (question) => {
    // Simulate network latency (500-1500ms)
    const delay = Math.floor(Math.random() * 1000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Normalize the question by removing punctuation and converting to lowercase
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Check for keywords in the question to determine the response
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Some common education-related fallback responses with a more human touch
    const fallbackResponses = [
        "That's an interesting question. To give you a comprehensive answer, I'd need to connect to the full knowledge database. In a full version, I would provide detailed information on this topic. What else would you like to know about?",
        "I understand you're asking about that. In the complete version, I would access my full knowledge to provide an accurate answer. For now, could you try a different question?",
        "That's a great question! The complete version of Knowledge would provide a detailed response. Is there another topic I could help you explore?",
        "I'm designed to answer questions like that in the full version. For this demo, I can help with basic questions or show you how I'd respond to different types of inquiries.",
        "In the production version, I would connect to OpenAI's API to give you a thorough answer on this topic. What other questions do you have about this subject?"
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

// Function to show notifications (toast messages)
const showNotification = (message, duration = 3000) => {
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

    // Animate the notification
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -10px)';
    }, 10);

    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 10px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
};

// Initialize chat
const initChat = () => {
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const questionInput = document.getElementById('question-input');
    const sendButton = document.getElementById('send-button');

    // Focus the input field when the page loads
    questionInput.focus();

    // Set up inView animation for the welcome message
    inView('.welcome-message', () => {
        animate('.welcome-content', {
            opacity: [0, 1],
            y: [20, 0]
        }, {
            duration: 0.8,
            delay: stagger(0.2),
            type: 'spring',
            stiffness: 50
        });

        // Subtle hover animation for welcome icon
        const welcomeIcon = document.querySelector('.welcome-icon-wrapper');
        if (welcomeIcon) {
            welcomeIcon.addEventListener('mouseenter', () => {
                animate(welcomeIcon, { scale: 1.05 }, { type: 'spring', stiffness: 300 });
            });
            welcomeIcon.addEventListener('mouseleave', () => {
                animate(welcomeIcon, { scale: 1 }, { type: 'spring', stiffness: 300 });
            });
        }

        return (info) => {
            // Optional cleanup
        };
    });

    // Add animation to the dots in typing indicator
    const animateTypingDots = (typingIndicator) => {
        const dots = typingIndicator.querySelectorAll('.dot');
        animate(dots, {
            y: ['0%', '-30%', '0%'],
            opacity: [0.5, 1, 0.5]
        }, {
            duration: 0.8,
            repeat: Infinity,
            delay: stagger(0.2),
            ease: 'easeInOut'
        });
    };

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
        animateTypingDots(typingIndicator);

        try {
            // Simulate API request to backend
            const response = await simulateAPIResponse(question);

            // Remove typing indicator with a fade out
            animate(typingIndicator, { opacity: 0, y: 10 }, { duration: 0.3 })
                .then(() => {
                    typingIndicator.remove();

                    // Add AI response with a slight delay for realism
                    setTimeout(() => {
                        addMessage(response, 'ai');
                    }, 300);
                });
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

    // Function to add message to chat
    window.addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        messageElement.appendChild(bubble);
        chatBox.appendChild(messageElement);

        // Animate the new message
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';

        // Give the DOM time to update
        setTimeout(() => {
            animate(messageElement, {
                opacity: [0, 1],
                y: [10, 0]
            }, {
                duration: 0.4,
                type: 'spring',
                stiffness: 100
            });

            chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);

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
                animate(listenButton, { scale: [1, 0.95, 1] }, { duration: 0.3 });
            });

            // Copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'action-button';
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';

            copyButton.addEventListener('click', () => {
                copyToClipboard(text);
                animate(copyButton, { scale: [1, 0.95, 1] }, { duration: 0.3 });
            });

            actions.appendChild(listenButton);
            actions.appendChild(copyButton);
            messageElement.appendChild(actions);

            // Animate the actions in
            actions.style.opacity = '0';
            setTimeout(() => {
                animate(actions, {
                    opacity: [0, 1]
                }, {
                    duration: 0.3,
                    delay: 0.2
                });
            }, 300);
        }
    };
};

// Text-to-speech function with better voice selection
const speak = (text) => {
    if (!window.speechSynthesis) {
        showNotification("Text-to-speech is not supported in your browser", 3000);
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get available voices and select a good one
    const voices = window.speechSynthesis.getVoices();

    // Try to get a high-quality voice (prefer English voices)
    // Prioritize Apple's Samantha, Google's US English, or any other good quality voice
    let selectedVoice = null;

    // Function to find voice by name (partial match)
    const findVoiceByName = (nameFragment) => {
        return voices.find(voice =>
            voice.name.toLowerCase().includes(nameFragment.toLowerCase())
        );
    };

    // Try to get better quality voices first
    selectedVoice = findVoiceByName('Samantha') || // Apple's high quality voice
        findVoiceByName('Google US English') ||
        findVoiceByName('Microsoft Zira') ||
        findVoiceByName('Daniel') ||
        voices.find(voice => voice.lang === 'en-US') ||
        voices.find(voice => voice.lang.startsWith('en')) ||
        voices[0]; // Fallback to first available voice

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Set properties for better speech
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Show notification when speech starts
    utterance.onstart = () => {
        showNotification("Playing audio...", 2000);
    };

    // Clear notification when speech ends
    utterance.onend = () => {
        // Optional: Do something when speech ends
    };

    window.speechSynthesis.speak(utterance);
};

// Copy text to clipboard
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification("Copied to clipboard", 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification("Failed to copy text", 2000);
        });
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge chat initialized');

    // Add gradient background div
    const gradientBg = document.createElement('div');
    gradientBg.className = 'gradient-bg';
    document.body.appendChild(gradientBg);

    // Initialize chat
    initChat();

    // Listen for voices to load (needed in some browsers)
    if (window.speechSynthesis) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => console.log('Voices loaded');
        }
    }

    // Add animation to input field and send button
    const questionInput = document.getElementById('question-input');
    const sendButton = document.getElementById('send-button');

    questionInput.addEventListener('focus', () => {
        animate(questionInput, { scale: 1.01 }, { duration: 0.3, type: 'spring', stiffness: 300 });
    });

    questionInput.addEventListener('blur', () => {
        animate(questionInput, { scale: 1 }, { duration: 0.3, type: 'spring', stiffness: 300 });
    });

    sendButton.addEventListener('mouseover', () => {
        if (!sendButton.disabled) {
            animate(sendButton, { scale: 1.05 }, { duration: 0.3, type: 'spring', stiffness: 300 });
        }
    });

    sendButton.addEventListener('mouseout', () => {
        animate(sendButton, { scale: 1 }, { duration: 0.3, type: 'spring', stiffness: 300 });
    });
}); 