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
const lightModeButton = document.getElementById('light-mode-button');
const darkModeButton = document.getElementById('dark-mode-button');

// Wikipedia-style informational responses
const demoResponses = {
    "hello": "Hello. This knowledge system provides information on a wide range of topics. You can ask specific questions to retrieve relevant information.",
    "who are you": "This is a knowledge retrieval system designed to provide factual information through text and audio responses. It functions similarly to encyclopedic sources but with interactive query capabilities.",
    "what can you do": "This system can retrieve information on various subjects, provide contextual explanations, and deliver responses in both text and audio formats. It's particularly suited for educational and research queries.",
    "help": "To use this system effectively, try asking specific questions rather than making broad statements. The more precise your query, the more relevant the information provided will be.",
    "thanks": "You're welcome. If you need additional information on any topic, you can submit a new query.",
};

// Simulate retrieval of information
const simulateAPIResponse = async (question) => {
    // Simulate reasonable network latency (300-600ms)
    const delay = Math.floor(Math.random() * 300) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Process query
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Information lookup
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Wikipedia-style fallback responses
    const fallbackResponses = [
        "The information requested is not available in the current knowledge base. In a complete implementation, this would connect to relevant reference sources.",
        "Your query has been processed, but no specific entry was found. A more comprehensive system would provide detailed information from verified sources.",
        "This query falls outside the current reference framework. A production system would access academic and encyclopedic sources to provide verified information.",
        "No specific entry matches your query. The full system would analyze your question against multiple reliable sources to generate a comprehensive response.",
        "This demonstration has limited reference materials. A complete implementation would draw from curated knowledge sources to address your specific question."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a minimal typing indicator
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.setAttribute('aria-label', 'Retrieving information');

    // Create dots for the animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }

    return typingIndicator;
};

// Clean notification
const showNotification = (message, duration = 2000) => {
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

    // Animate appearance
    setTimeout(() => {
        notification.style.opacity = '0';

        animate(notification, {
            opacity: [0, 1],
            y: [5, 0]
        }, {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        });
    }, 10);

    // Remove after duration
    setTimeout(() => {
        animate(notification, {
            opacity: [1, 0],
            y: [0, 5]
        }, {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => notification.remove());
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

// Handle the submission of a query
const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Hide welcome message if visible
    if (welcomeMessage && welcomeMessage.style.display !== 'none') {
        animate(welcomeMessage, { opacity: [1, 0] }, { duration: 0.2 }).then(() => {
            welcomeMessage.style.display = 'none';
        });
    }

    // Show conversation container
    if (conversationContainer.classList.contains('hidden')) {
        conversationContainer.classList.remove('hidden');
        conversationContainer.style.opacity = '0';
        animate(conversationContainer, { opacity: [0, 1] }, { duration: 0.3 });
    }

    // Create a new QA pair and add it to the container
    const newPair = createQAPair(question, '');
    const qaPairElement = newPair.querySelector('.qa-pair');

    // Set initial opacity for animation
    qaPairElement.style.opacity = '0';
    qaPairElement.style.transform = 'translateY(8px)';

    // Add the pair to the container
    qaContainer.appendChild(newPair);

    // Animate the new pair appearing
    animate(qaPairElement, {
        opacity: [0, 1],
        y: [8, 0]
    }, {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
    });

    // Create and add typing indicator
    const answerContainer = qaPairElement.querySelector('.answer-container');
    const answerText = qaPairElement.querySelector('.answer-text');
    const typingIndicator = createTypingIndicator();

    // Hide answer text and actions initially
    answerText.style.display = 'none';
    qaPairElement.querySelector('.answer-actions').style.display = 'none';

    // Add typing indicator
    answerContainer.insertBefore(typingIndicator, answerContainer.firstChild);

    try {
        // Simulate information retrieval
        const response = await simulateAPIResponse(question);

        // Remove typing indicator
        typingIndicator.remove();

        // Show answer with fade in
        answerText.textContent = response;
        answerText.style.opacity = '0';
        answerText.style.display = 'block';

        animate(answerText, {
            opacity: [0, 1]
        }, {
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1]
        });

        // Show answer actions with emphasis on audio
        const actionsElement = qaPairElement.querySelector('.answer-actions');
        actionsElement.style.opacity = '0';
        actionsElement.style.display = 'flex';

        setTimeout(() => {
            animate(actionsElement, {
                opacity: [0, 1]
            }, {
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
            });
        }, 150);

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
        answerText.textContent = "Unable to retrieve information at this time. Please try again later.";
        answerText.style.display = 'block';
    }
};

// Set up action buttons for a QA pair with focus on audio
const setupActionButtons = (qaPairElement, answerText) => {
    const playButton = qaPairElement.querySelector('.play-audio-button');
    const regenerateButton = qaPairElement.querySelector('.regenerate-button');
    const downloadButton = qaPairElement.querySelector('.download-audio-button');

    // Play audio button - primary action
    playButton.addEventListener('click', () => {
        speak(answerText);
    });

    // Regenerate button
    regenerateButton.addEventListener('click', async () => {
        const questionText = qaPairElement.querySelector('.question-text').textContent;
        const answerTextElement = qaPairElement.querySelector('.answer-text');
        const actionsElement = qaPairElement.querySelector('.answer-actions');

        // Hide answer and actions with animation
        await animate(answerTextElement, {
            opacity: [1, 0],
            y: [0, -5]
        }, {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            answerTextElement.style.display = 'none';
        });

        await animate(actionsElement, {
            opacity: [1, 0]
        }, {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
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

            // Update answer text with animation
            answerTextElement.textContent = newResponse;
            answerTextElement.style.display = 'block';
            answerTextElement.style.transform = 'translateY(5px)';

            animate(answerTextElement, {
                opacity: [0, 1],
                y: [5, 0]
            }, {
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
            });

            // Show answer actions
            setTimeout(() => {
                actionsElement.style.display = 'flex';
                animate(actionsElement, {
                    opacity: [0, 1]
                }, {
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1]
                });
            }, 150);

            // Update the action buttons with the new response
            playButton.onclick = () => speak(newResponse);
            downloadButton.onclick = () => downloadAudio(newResponse);

            showNotification("Information refreshed");
        } catch (error) {
            console.error('Error regenerating response:', error);
            typingIndicator.remove();
            answerTextElement.textContent = "Unable to refresh information. Please try again.";
            answerTextElement.style.display = 'block';
            actionsElement.style.display = 'flex';
        }
    });

    // Download audio button
    downloadButton.addEventListener('click', () => {
        downloadAudio(answerText);
    });
};

// Enhanced text-to-speech for better audio experience
const speak = (text) => {
    if (!window.speechSynthesis) {
        showNotification("Audio not supported in your browser");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Find a good voice for informational content
    const findVoiceByName = (nameFragment) => {
        return voices.find(voice =>
            voice.name.toLowerCase().includes(nameFragment.toLowerCase())
        );
    };

    // Prefer high-quality voices
    const selectedVoice = findVoiceByName('Daniel') ||
        findVoiceByName('Google US English') ||
        voices.find(voice => voice.lang === 'en-US') ||
        voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Better speech parameters
    utterance.rate = 0.98; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch

    // Show notification
    utterance.onstart = () => {
        showNotification("Audio playback started");
    };

    utterance.onend = () => {
        showNotification("Audio playback complete");
    };

    window.speechSynthesis.speak(utterance);
};

// Audio download implementation
const downloadAudio = async (text) => {
    try {
        showNotification("Preparing audio file...");

        // In a real implementation, this would connect to a backend
        setTimeout(() => {
            showNotification("Audio file ready for download", 2000);
        }, 1000);

        // Real implementation would use:
        /*
        const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text,
                format: 'mp3',
                quality: 'high',
                voice: 'en-US-Neural2-D'
            })
        });
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'knowledge_audio.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        */
    } catch (error) {
        console.error('Error downloading audio:', error);
        showNotification("Could not prepare audio for download");
    }
};

// Voice input setup
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
        showNotification("Voice input active");
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
        showNotification("Voice input error. Please try again.");
    };

    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
};

// Theme toggle implementation
const setupThemeToggle = () => {
    // Check for user preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on preference or previous selection
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (prefersDarkMode && !savedTheme)) {
        document.body.classList.add('dark-mode');
        lightModeButton.classList.remove('active');
        darkModeButton.classList.add('active');
    }

    // Light mode button handler
    lightModeButton.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        darkModeButton.classList.remove('active');
        lightModeButton.classList.add('active');
    });

    // Dark mode button handler
    darkModeButton.addEventListener('click', () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        lightModeButton.classList.remove('active');
        darkModeButton.classList.add('active');
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
        animate(qaContainer, {
            opacity: [1, 0]
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            // Clear the QA container
            qaContainer.innerHTML = '';

            // Show welcome message, hide conversation container
            if (welcomeMessage) {
                welcomeMessage.style.display = 'flex';
                welcomeMessage.style.opacity = '0';
                animate(welcomeMessage, { opacity: [0, 1] }, { duration: 0.3 });
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

    // Set up theme toggle
    setupThemeToggle();
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge system initialized');

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