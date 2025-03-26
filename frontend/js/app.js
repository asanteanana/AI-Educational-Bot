// Import Framer Motion for technical animations
import { animate, spring } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const welcomeMessage = document.getElementById('welcome-message');
const conversationContainer = document.getElementById('conversation-container');
const qaContainer = document.getElementById('qa-container');
const newConversationButton = document.getElementById('new-conversation');
const voiceInputButton = document.getElementById('voice-input-button');

// Technical, Wikipedia-like responses
const demoResponses = {
    "hello": "Hello. This is the Knowledge Base system. I'm designed to provide technical information and assistance. How may I help you today?",
    "who are you": "I am a knowledge retrieval and information processing system. My primary function is to provide factual information, technical explanations, and research assistance through natural language understanding.",
    "what can you do": "My capabilities include: information retrieval from my knowledge base, explanation of complex topics, providing reference information, and generating audio versions of textual responses for accessibility.",
    "help": "You can interact with this system by entering queries related to any topic you wish to learn about. The system will attempt to provide factual, relevant information based on available knowledge.",
    "thanks": "Acknowledged. If you require further information, please submit a new query.",
};

// Backend API simulation with technical response
const simulateAPIResponse = async (question) => {
    // Simulate realistic network latency (400-700ms)
    const delay = Math.floor(Math.random() * 300) + 400;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Process input query
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Information retrieval logic
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Technical fallback responses
    const fallbackResponses = [
        "The system does not currently have sufficient information to provide a comprehensive answer to this query. In a production environment, this would connect to a knowledge base with relevant data.",
        "Query processed. This demonstration has limited data access. A complete implementation would retrieve information from technical documentation and knowledge repositories.",
        "This query requires access to specialized data sources that are not available in this demonstration. The production system would access scientific and technical databases to provide accurate information.",
        "This is a limited demonstration environment. The full system would analyze your query against verified information sources to generate a precise technical response.",
        "Query noted. In a production environment, this system would perform information retrieval from trusted sources to provide a factual, referenced response to your question."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a technical typing indicator
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.setAttribute('aria-label', 'Processing query');

    // Create dots for the typing animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }

    return typingIndicator;
};

// Clean, minimal notification
const showNotification = (message, duration = 2000) => {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    document.body.appendChild(notification);

    // Animate appearance with Framer Motion
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 0)';

        animate(notification, {
            opacity: [0, 1],
            y: [10, 0]
        }, {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        });
    }, 10);

    // Remove after duration
    setTimeout(() => {
        animate(notification, {
            opacity: [1, 0],
            y: [0, 10]
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
    if (welcomeMessage) {
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

    // Set initial opacity to 0 for animation
    qaPairElement.style.opacity = '0';
    qaPairElement.style.transform = 'translateY(10px)';

    // Add the pair to the container
    qaContainer.appendChild(newPair);

    // Animate the new pair appearing
    animate(qaPairElement, {
        opacity: [0, 1],
        y: [10, 0]
    }, {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
    });

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

        // Show answer with technical fade in
        answerText.textContent = response;
        answerText.style.opacity = '0';
        answerText.style.display = 'block';

        animate(answerText, {
            opacity: [0, 1]
        }, {
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1]
        });

        // Show answer actions
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
        answerText.textContent = "System error: Unable to process query at this time. Please try again later.";
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

        // Hide answer and actions with technical animation
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
            // Get a new response with appropriate delay for realism
            await new Promise(resolve => setTimeout(resolve, 600));
            const newResponse = await simulateAPIResponse(questionText);

            // Remove typing indicator
            typingIndicator.remove();

            // Update answer text with technical animation
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

            showNotification("Response regenerated");
        } catch (error) {
            console.error('Error regenerating response:', error);
            typingIndicator.remove();
            answerTextElement.textContent = "System error: Unable to regenerate response at this time.";
            answerTextElement.style.display = 'block';
            actionsElement.style.display = 'flex';
        }
    });

    // Download audio button
    downloadButton.addEventListener('click', () => {
        downloadAudio(answerText);
    });
};

// Technical text-to-speech implementation
const speak = (text) => {
    if (!window.speechSynthesis) {
        showNotification("Text-to-speech functionality unavailable in this browser");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Find an appropriate voice for technical content
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

    // Technical parameters
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch

    // Show notification
    utterance.onstart = () => {
        showNotification("Audio playback initiated");
    };

    utterance.onend = () => {
        showNotification("Audio playback complete");
    };

    window.speechSynthesis.speak(utterance);
};

// Technical download audio implementation
const downloadAudio = async (text) => {
    try {
        showNotification("Preparing audio file...");

        // In a real implementation, this would connect to a backend
        setTimeout(() => {
            showNotification("Audio file prepared and ready for download", 2000);
        }, 1200);

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
        a.download = 'knowledge_response.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        */
    } catch (error) {
        console.error('Error downloading audio:', error);
        showNotification("Unable to prepare audio file for download");
    }
};

// Technical voice input setup
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
        showNotification("Voice input error: Unable to process speech");
    };

    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
};

// Initialize the app with technical focus
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

    // Set up new conversation button with technical animation
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
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge Base system initialized');

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