// Import Framer Motion for basic animations
import { animate } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const welcomeContainer = document.getElementById('welcome-container');
const conversationContainer = document.getElementById('conversation-container');
const qaContainer = document.getElementById('qa-container');
const newConversationButton = document.getElementById('new-conversation');
const voiceInputButton = document.getElementById('voice-input-button');

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
    // Simulate network latency (500-1200ms)
    const delay = Math.floor(Math.random() * 700) + 500;
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

// Create a typing indicator
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.setAttribute('aria-label', 'Assistant is typing');

    // Create 3 dots for the typing animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }

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

    // Hide welcome container and show conversation container
    welcomeContainer.classList.add('hidden');
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

        // Remove typing indicator and show answer
        typingIndicator.remove();
        answerText.textContent = response;
        answerText.style.display = 'block';

        // Show answer actions
        qaPairElement.querySelector('.answer-actions').style.display = 'flex';

        // Set up action buttons
        setupActionButtons(qaPairElement, response);

        // Scroll to the answer
        qaPairElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        answerTextElement.style.display = 'none';
        actionsElement.style.display = 'none';

        // Create and add typing indicator
        const answerContainer = qaPairElement.querySelector('.answer-container');
        const typingIndicator = createTypingIndicator();
        answerContainer.insertBefore(typingIndicator, answerContainer.firstChild);

        try {
            // Get a new response (with added delay for realism)
            await new Promise(resolve => setTimeout(resolve, 500));
            const newResponse = await simulateAPIResponse(questionText);

            // Remove typing indicator
            typingIndicator.remove();

            // Update answer text
            answerTextElement.textContent = newResponse;
            answerTextElement.style.display = 'block';
            actionsElement.style.display = 'flex';

            // Update the action buttons with the new response
            playButton.onclick = () => speak(newResponse);
            downloadButton.onclick = () => downloadAudio(newResponse);

            showNotification('Response regenerated');
        } catch (error) {
            console.error('Error regenerating response:', error);
            typingIndicator.remove();
            answerTextElement.textContent = "I'm having trouble regenerating a response. Please try again.";
            answerTextElement.style.display = 'block';
            actionsElement.style.display = 'flex';
        }
    });

    // Download audio button
    downloadButton.addEventListener('click', () => {
        downloadAudio(answerText);
    });
};

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

// Download audio function
const downloadAudio = async (text) => {
    try {
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // Select best available voice
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name.includes('Samantha')) ||
            voices.find(voice => voice.lang === 'en-US') ||
            voices[0];

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // For a real implementation, you would convert speech to an audio file server-side
        // As a workaround for this demo, we'll show a notification
        showNotification("In a full implementation, this would download an MP3 file");

        // Here's what a real implementation might do:
        // 1. Send text to a server endpoint that converts text to speech
        // 2. Server returns an audio file URL
        // 3. Create a download link and trigger the download

        // Simulated implementation
        /*
        const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        showNotification("Could not download audio");
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
        // Clear the QA container
        qaContainer.innerHTML = '';

        // Show welcome container, hide conversation container
        welcomeContainer.classList.remove('hidden');
        conversationContainer.classList.add('hidden');

        // Focus on input
        mainQuestionInput.focus();
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
            speechSynthesis.onvoiceschanged = () => console.log('Voices loaded');
        }
    }
}); 