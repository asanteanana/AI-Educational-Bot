// Import Framer Motion for subtle animations
import { animate } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const welcomeMessage = document.getElementById('welcome-message');
const conversationContainer = document.getElementById('conversation-container');
const qaContainer = document.getElementById('qa-container');
const newConversationButton = document.getElementById('new-conversation');
const voiceInputButton = document.getElementById('voice-input-button');

// Demo responses to simulate a backend - using clear, concise language
const demoResponses = {
    "hello": "Hello! I'm Knowledge, your learning companion. How can I help you today?",
    "who are you": "I'm Knowledge, an AI assistant designed to help you learn and explore new topics. I provide information, answer questions, and can read responses aloud.",
    "what can you do": "I can answer questions about various topics, explain concepts, and provide information to help you learn. I can also read my responses aloud for a more accessible experience.",
    "help": "You can ask me questions about any topic you're interested in learning about. Just type your question, and I'll do my best to provide a helpful answer.",
    "thanks": "You're welcome! If you have any other questions, feel free to ask.",
};

// Backend API simulation
const simulateAPIResponse = async (question) => {
    // Simulate network latency (300-800ms)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Normalize the question
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Check for keywords in the question
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Fallback responses with clear, helpful tone
    const fallbackResponses = [
        "That's an interesting question. In a full implementation, I would connect to a knowledge base to provide a comprehensive answer.",
        "I understand your question. In the complete version, I would provide a detailed answer with reliable information.",
        "Good question. The full version would access a knowledge database to give you an in-depth response to this topic.",
        "This is a demo version with limited responses. The full implementation would provide thorough answers on this subject.",
        "I'd like to help with that. In the complete version, I would provide a detailed answer to your question."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a minimal typing indicator
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.setAttribute('aria-label', 'Assistant is thinking');

    // Create 3 dots for the typing animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }

    return typingIndicator;
};

// Clean notification function
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
    notification.setAttribute('role', 'status');
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

// Create a new QA pair from the template
const createQAPair = (question, answer) => {
    const template = document.getElementById('qa-pair-template');
    const qaPair = template.content.cloneNode(true);

    // Set question and answer text
    qaPair.querySelector('.question-text').textContent = question;
    qaPair.querySelector('.answer-text').textContent = answer;

    return qaPair;
};

// Handle the submission of a question
const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Hide welcome message if visible
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }

    // Show conversation container
    conversationContainer.classList.remove('hidden');

    // Create a new QA pair and add it to the container
    const newPair = createQAPair(question, '');
    const qaPairElement = newPair.querySelector('.qa-pair');

    // Add the pair to the container
    qaContainer.appendChild(newPair);

    // Create and add typing indicator to the answer container
    const answerContainer = qaPairElement.querySelector('.answer-container');
    const answerText = qaPairElement.querySelector('.answer-text');
    const typingIndicator = createTypingIndicator();

    // Hide answer text and actions initially
    answerText.style.display = 'none';
    qaPairElement.querySelector('.answer-actions').style.display = 'none';

    // Add typing indicator
    answerContainer.insertBefore(typingIndicator, answerContainer.firstChild);

    try {
        // Simulate API request
        const response = await simulateAPIResponse(question);

        // Remove typing indicator
        typingIndicator.remove();

        // Show answer with subtle fade in
        answerText.textContent = response;
        answerText.style.opacity = '0';
        answerText.style.display = 'block';

        animate(answerText, { opacity: [0, 1] }, { duration: 0.3 });

        // Show answer actions
        const actionsElement = qaPairElement.querySelector('.answer-actions');
        actionsElement.style.opacity = '0';
        actionsElement.style.display = 'flex';

        setTimeout(() => {
            animate(actionsElement, { opacity: [0, 1] }, { duration: 0.3 });
        }, 200);

        // Set up action buttons
        setupActionButtons(qaPairElement, response);

        // Scroll to the answer
        setTimeout(() => {
            qaPairElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } catch (error) {
        console.error('Error:', error);

        // Remove typing indicator and show error message
        typingIndicator.remove();
        answerText.textContent = "I'm having trouble connecting right now. Please try again later.";
        answerText.style.display = 'block';
    }
};

// Set up action buttons for a QA pair
const setupActionButtons = (qaPairElement, answerText) => {
    const playButton = qaPairElement.querySelector('.play-audio-button');
    const regenerateButton = qaPairElement.querySelector('.regenerate-button');
    const downloadButton = qaPairElement.querySelector('.download-audio-button');

    // Play audio button
    playButton.addEventListener('click', () => {
        speak(answerText);
    });

    // Regenerate button
    regenerateButton.addEventListener('click', async () => {
        const questionText = qaPairElement.querySelector('.question-text').textContent;
        const answerTextElement = qaPairElement.querySelector('.answer-text');
        const actionsElement = qaPairElement.querySelector('.answer-actions');

        // Hide answer and actions
        await animate(answerTextElement, { opacity: [1, 0] }, { duration: 0.2 }).then(() => {
            answerTextElement.style.display = 'none';
        });

        await animate(actionsElement, { opacity: [1, 0] }, { duration: 0.2 }).then(() => {
            actionsElement.style.display = 'none';
        });

        // Create and add typing indicator
        const answerContainer = qaPairElement.querySelector('.answer-container');
        const typingIndicator = createTypingIndicator();
        answerContainer.insertBefore(typingIndicator, answerContainer.firstChild);

        try {
            // Get a new response
            await new Promise(resolve => setTimeout(resolve, 500));
            const newResponse = await simulateAPIResponse(questionText);

            // Remove typing indicator
            typingIndicator.remove();

            // Update answer text
            answerTextElement.textContent = newResponse;
            answerTextElement.style.display = 'block';
            animate(answerTextElement, { opacity: [0, 1] }, { duration: 0.3 });

            // Show answer actions
            setTimeout(() => {
                actionsElement.style.display = 'flex';
                animate(actionsElement, { opacity: [0, 1] }, { duration: 0.3 });
            }, 200);

            // Update the action buttons with the new response
            playButton.onclick = () => speak(newResponse);
            downloadButton.onclick = () => downloadAudio(newResponse);

            showNotification('Response updated');
        } catch (error) {
            console.error('Error regenerating response:', error);
            typingIndicator.remove();
            answerTextElement.textContent = "I'm having trouble generating a response. Please try again.";
            answerTextElement.style.display = 'block';
            actionsElement.style.display = 'flex';
        }
    });

    // Download audio button
    downloadButton.addEventListener('click', () => {
        downloadAudio(answerText);
    });
};

// Accessible text-to-speech function
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

    // Find a good voice
    const findVoiceByName = (nameFragment) => {
        return voices.find(voice =>
            voice.name.toLowerCase().includes(nameFragment.toLowerCase())
        );
    };

    // Prefer high-quality voices
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

    utterance.onend = () => {
        showNotification("Audio complete", 1500);
    };

    window.speechSynthesis.speak(utterance);
};

// Download audio function
const downloadAudio = async (text) => {
    try {
        showNotification("Preparing audio download...");

        // In a real implementation, this would connect to a backend
        setTimeout(() => {
            showNotification("Audio ready to download", 2000);
        }, 1000);

        // Real implementation would use:
        /*
        const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'knowledge_response.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        */
    } catch (error) {
        console.error('Error downloading audio:', error);
        showNotification("Could not prepare audio for download");
    }
};

// Set up voice input
const setupVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        voiceInputButton.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        voiceInputButton.classList.add('recording');
        showNotification("Listening...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        mainQuestionInput.value = transcript;
        // Focus on input to show the user what was transcribed
        mainQuestionInput.focus();
    };

    recognition.onend = () => {
        voiceInputButton.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceInputButton.classList.remove('recording');
        showNotification("Couldn't understand speech. Please try again.");
    };

    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
};

// Initialize the app
const initApp = () => {
    // Focus on input field
    mainQuestionInput.focus();

    // Set up main form submission
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = mainQuestionInput.value.trim();

        if (!question) return;

        // Disable input while processing
        mainQuestionInput.disabled = true;
        mainSendButton.disabled = true;
        mainSendButton.classList.add('loading');

        // Handle the question
        handleQuestionSubmit(question)
            .finally(() => {
                // Clear and re-enable input
                mainQuestionInput.value = '';
                mainQuestionInput.disabled = false;
                mainSendButton.disabled = false;
                mainSendButton.classList.remove('loading');
                mainQuestionInput.focus();
            });
    });

    // Set up new conversation button
    newConversationButton.addEventListener('click', () => {
        // Fade out the conversation container
        animate(qaContainer, { opacity: [1, 0] }, { duration: 0.3 })
            .then(() => {
                // Clear the QA container
                qaContainer.innerHTML = '';

                // Show welcome message, hide conversation container
                if (welcomeMessage) {
                    welcomeMessage.style.display = 'flex';
                }
                conversationContainer.classList.add('hidden');

                // Reset the view
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Focus on input
                mainQuestionInput.focus();
            });
    });

    // Set up voice input if available
    setupVoiceInput();
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge app initialized');

    // Initialize app
    initApp();

    // Listen for voices to load (needed in some browsers)
    if (window.speechSynthesis) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }
}); 