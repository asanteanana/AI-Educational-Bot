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

// Educational-focused responses with clear, helpful language
const demoResponses = {
    "hello": "Hello! Welcome to Insight. I'm your educational companion designed to make learning more accessible. How can I help you learn today?",
    "who are you": "I'm Insight, your AI learning companion. I'm designed to make education more accessible by providing clear explanations that you can read or listen to. I combine text and audio capabilities to support different learning preferences.",
    "what can you do": "I can help you learn about various topics through conversation, explain concepts in clear language, and provide information in both text and audio formats. I'm particularly helpful for those who prefer listening over reading or need more accessible ways to engage with educational content.",
    "help": "I'd be happy to help you learn! To get the most out of our conversation, try asking specific questions about topics you're curious about. I can explain concepts, provide definitions, or explore subjects in depth. You can also use the voice button to ask questions by speaking.",
    "thanks": "You're welcome! I'm glad I could help with your learning. If you have more questions or want to explore other topics, just ask. Learning is a journey we're on together.",
};

// Simulate retrieval of educational information
const simulateAPIResponse = async (question) => {
    // Simulate network latency (300-800ms for realistic educational API response)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Process query
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Educational information lookup
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Educational fallback responses
    const fallbackResponses = [
        "That's an interesting question! While I don't have specific information on this topic in my current knowledge base, in a complete implementation I would connect to educational resources to provide you with an accurate answer. The best learning happens when we have access to reliable information.",
        "Great question! This particular topic would require me to access educational databases that aren't connected in this demonstration. In a fully developed system, I would provide information from trusted academic sources to help you learn about this subject.",
        "I appreciate your curiosity! Learning involves asking questions like yours. In a complete system, I would access scholarly sources to give you a well-researched answer about this topic.",
        "Thanks for asking! Your question shows a desire to learn. While this demonstration has limited reference materials, a complete educational system would provide detailed information drawn from textbooks and educational resources.",
        "That's exactly the kind of question that helps learning! In a fully implemented system, I would connect to educational databases to provide you with clear, accurate information on this topic, complete with the option to listen to the response."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a more engaging typing indicator with Framer Motion
const createTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.setAttribute('aria-label', 'Finding information for your learning');

    // Create dots for the animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }

    return typingIndicator;
};

// Enhanced notification with more engaging animation
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

// Create a new QA pair from the template
const createQAPair = (question, answer) => {
    const template = document.getElementById('qa-pair-template');
    const qaPair = template.content.cloneNode(true);

    // Set question and answer text
    qaPair.querySelector('.question-text').textContent = question;
    qaPair.querySelector('.answer-text').textContent = answer;

    return qaPair;
};

// Handle the submission of a learning query with enhanced animations
const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Hide welcome message with improved animation
    if (welcomeMessage && welcomeMessage.style.display !== 'none') {
        animate(welcomeMessage, {
            opacity: [1, 0],
            y: [0, -10]
        }, {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            welcomeMessage.style.display = 'none';
        });
    }

    // Show conversation container with staggered animation
    if (conversationContainer.classList.contains('hidden')) {
        conversationContainer.classList.remove('hidden');
        conversationContainer.style.opacity = '0';
        animate(conversationContainer, {
            opacity: [0, 1],
            y: [20, 0]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1] // Spring effect
        });
    }

    // Create a new QA pair and add it to the container
    const newPair = createQAPair(question, '');
    const qaPairElement = newPair.querySelector('.qa-pair');

    // Set initial opacity for animation
    qaPairElement.style.opacity = '0';
    qaPairElement.style.transform = 'translateY(20px)';

    // Add the pair to the container
    qaContainer.appendChild(newPair);

    // Animate the new pair appearing with spring effect
    animate(qaPairElement, {
        opacity: [0, 1],
        y: [20, 0]
    }, {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1] // Spring physics for more engaging animation
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
        // Simulate information retrieval for educational content
        const response = await simulateAPIResponse(question);

        // Remove typing indicator with fade
        animate(typingIndicator, {
            opacity: [1, 0],
            y: [0, -5]
        }, {
            duration: 0.3
        }).then(() => typingIndicator.remove());

        // Show answer with typewriter-like effect for educational emphasis
        answerText.textContent = '';
        answerText.style.display = 'block';

        // Split text into characters for typewriter effect
        const characters = response.split('');
        let index = 0;

        // Function to add next character
        const typeNextCharacter = () => {
            if (index < characters.length) {
                answerText.textContent += characters[index];
                index++;

                // Randomize the delay slightly for natural effect
                const randomDelay = Math.random() * 10 + 25; // 25-35ms
                setTimeout(typeNextCharacter, randomDelay);
            } else {
                // Show answer actions with emphasis on audio accessibility
                const actionsElement = qaPairElement.querySelector('.answer-actions');
                actionsElement.style.opacity = '0';
                actionsElement.style.display = 'flex';

                // Stagger animate the actions buttons
                animate(actionsElement, {
                    opacity: [0, 1],
                    y: [10, 0]
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });

                // Setup action buttons (audio player, regenerate, etc)
                setupActionButtons(qaPairElement, response);
            }
        };

        // Start typewriter effect
        typeNextCharacter();

    } catch (error) {
        // Handle errors gracefully for better user experience
        typingIndicator.remove();
        answerText.textContent = "I'm sorry, but I couldn't process your question right now. Please try again in a moment.";
        answerText.style.display = 'block';
        showNotification("An error occurred. Please try again.");
    }
};

// Setup action buttons with enhanced interactivity
const setupActionButtons = (qaPairElement, answerText) => {
    const playAudioButton = qaPairElement.querySelector('.play-audio-button');
    const regenerateButton = qaPairElement.querySelector('.regenerate-button');
    const downloadAudioButton = qaPairElement.querySelector('.download-audio-button');

    // Add audio visualization to the play button
    const addAudioWave = (button) => {
        const audioWave = document.createElement('div');
        audioWave.className = 'audio-wave';
        audioWave.setAttribute('aria-hidden', 'true');

        // Add bars for visualization
        for (let i = 0; i < 3; i++) {
            const bar = document.createElement('span');
            bar.className = 'bar';
            audioWave.appendChild(bar);
        }

        // Insert at beginning of button
        button.insertBefore(audioWave, button.firstChild);
        return audioWave;
    };

    const audioWave = addAudioWave(playAudioButton);

    // Set up audio playback with visualization
    let isSpeaking = false;
    let audioContext;
    let animation;

    playAudioButton.addEventListener('click', async () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            playAudioButton.querySelector('span').textContent = 'Listen';

            // Reset visualization
            const bars = audioWave.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.height = '3px';
            });

            if (animation) {
                animation.stop();
            }

            return;
        }

        playAudioButton.classList.add('loading');

        try {
            await speak(answerText);
            playAudioButton.classList.remove('loading');
            isSpeaking = true;
            playAudioButton.querySelector('span').textContent = 'Stop';

            // Animate audio wave
            const bars = audioWave.querySelectorAll('.bar');

            // Use Framer Motion to animate the audio bars
            bars.forEach((bar, index) => {
                const randomHeight = () => Math.floor(Math.random() * 12) + 3;
                const randomDuration = () => (Math.random() * 0.7) + 0.5;

                animation = animate(bar,
                    { height: [randomHeight(), randomHeight(), randomHeight(), randomHeight()] },
                    {
                        duration: randomDuration(),
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }
                );
            });

            // Reset when speech ends
            window.speechSynthesis.addEventListener('end', () => {
                isSpeaking = false;
                playAudioButton.querySelector('span').textContent = 'Listen';

                // Reset visualization
                bars.forEach(bar => {
                    if (animation) {
                        animation.stop();
                    }
                    bar.style.height = '3px';
                });
            }, { once: true });

        } catch (error) {
            playAudioButton.classList.remove('loading');
            showNotification('Could not play audio. Please try again.');
        }
    });

    // Set up regenerate button
    regenerateButton.addEventListener('click', async () => {
        regenerateButton.classList.add('loading');

        try {
            // Get the question text
            const questionText = qaPairElement.querySelector('.question-text').textContent;

            // Clear and hide the answer
            const answerTextElement = qaPairElement.querySelector('.answer-text');
            answerTextElement.style.display = 'none';

            // Show typing indicator
            const answerContent = qaPairElement.querySelector('.answer-content');
            const typingIndicator = createTypingIndicator();
            answerContent.appendChild(typingIndicator);

            // Hide action buttons
            const actionsElement = qaPairElement.querySelector('.answer-actions');
            animate(actionsElement, { opacity: [1, 0] }, { duration: 0.3 })
                .then(() => { actionsElement.style.display = 'none'; });

            // Get new response
            const newResponse = await simulateAPIResponse(questionText);

            // Remove typing indicator
            typingIndicator.remove();

            // Show new answer with typewriter effect
            answerTextElement.textContent = '';
            answerTextElement.style.display = 'block';

            // Split text into characters for typewriter effect
            const characters = newResponse.split('');
            let index = 0;

            // Function to add next character
            const typeNextCharacter = () => {
                if (index < characters.length) {
                    answerTextElement.textContent += characters[index];
                    index++;

                    // Randomize the delay slightly for natural effect
                    const randomDelay = Math.random() * 10 + 25; // 25-35ms
                    setTimeout(typeNextCharacter, randomDelay);
                } else {
                    // Show answer actions
                    actionsElement.style.display = 'flex';
                    animate(actionsElement, { opacity: [0, 1] }, { duration: 0.4 });

                    // Update action buttons
                    setupActionButtons(qaPairElement, newResponse);
                }
            };

            // Start typewriter effect
            typeNextCharacter();

            regenerateButton.classList.remove('loading');

        } catch (error) {
            regenerateButton.classList.remove('loading');
            showNotification('Could not regenerate response. Please try again.');
        }
    });

    // Set up download audio button
    downloadAudioButton.addEventListener('click', async () => {
        downloadAudioButton.classList.add('loading');
        try {
            await downloadAudio(answerText);
            downloadAudioButton.classList.remove('loading');

            // Animation feedback for successful download
            animate(downloadAudioButton,
                { scale: [1, 1.05, 1] },
                { duration: 0.4, ease: "easeInOut" }
            );

        } catch (error) {
            downloadAudioButton.classList.remove('loading');
            showNotification('Could not download audio. Please try again.');
        }
    });
};

// Enhanced text-to-speech with better voice selection for education
const speak = (text) => {
    return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Use a more natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const findVoiceByName = (nameFragment) => {
            return voices.find(voice =>
                voice.name.toLowerCase().includes(nameFragment.toLowerCase()) &&
                voice.lang.startsWith('en')
            );
        };

        // Try to find a natural sounding voice for educational content
        const preferredVoices = [
            findVoiceByName('samantha'),
            findVoiceByName('daniel'),
            findVoiceByName('premium'),
            findVoiceByName('enhanced'),
            findVoiceByName('neural'),
            voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en')),
            voices.find(voice => voice.lang.startsWith('en-US')),
            voices.find(voice => voice.lang.startsWith('en'))
        ];

        utterance.voice = preferredVoices.find(Boolean) || voices[0];
        utterance.rate = 0.95; // Slightly slower for educational clarity
        utterance.pitch = 1;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

        window.speechSynthesis.speak(utterance);
    });
};

// Download audio file for offline learning
const downloadAudio = async (text) => {
    return new Promise((resolve, reject) => {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                throw new Error('AudioContext not supported');
            }

            // Generate audio and create download
            const createDownload = (audioBlob) => {
                const url = URL.createObjectURL(audioBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `insight-response-${Date.now()}.mp3`;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            };

            // For demonstration, use browser TTS then download
            if (window.speechSynthesis) {
                showNotification('Preparing audio file for download...');

                // In a real app, we would use proper TTS-to-file conversion here
                // This is a simulation to demonstrate the feature
                setTimeout(() => {
                    const dummyBlob = new Blob(['audio-data-placeholder'], { type: 'audio/mpeg' });
                    createDownload(dummyBlob);
                    showNotification('Audio file downloaded successfully!');
                }, 1200);
            } else {
                reject(new Error('Speech synthesis not supported'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Setup voice input with animated feedback
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

        // Show recording state with animation
        voiceInputButton.classList.add('recording');

        // Pulse animation using Framer Motion
        animate(voiceInputButton,
            { scale: [1, 1.05, 1] },
            {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity
            }
        );

        recognition.start();
        isListening = true;

        showNotification('Listening... Speak clearly');
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
        mainQuestionInput.placeholder = 'What would you like to learn about?';

        // Stop animation
        animate(voiceInputButton, { scale: 1 });

        if (mainQuestionInput.value.trim()) {
            // If we captured something, submit after a short delay
            setTimeout(() => {
                mainForm.dispatchEvent(new Event('submit'));
            }, 300);
        } else {
            showNotification('No speech detected. Please try again.');
        }
    };

    recognition.onerror = (event) => {
        isListening = false;
        voiceInputButton.classList.remove('recording');
        mainQuestionInput.placeholder = 'What would you like to learn about?';

        // Stop animation
        animate(voiceInputButton, { scale: 1 });

        showNotification(`Speech recognition error: ${event.error}`);
    };
};

// Setup theme toggle with improved transition
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

// Initialize the application with improved animations
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

    newConversationButton.addEventListener('click', () => {
        // Confirmation for better UX
        if (qaContainer.children.length > 0) {
            const isConfirmed = confirm('Start a new conversation? This will clear your current session.');
            if (!isConfirmed) return;
        }

        // Clear conversation with fade out animation
        if (qaContainer.children.length > 0) {
            animate(qaContainer, { opacity: [1, 0] }, { duration: 0.3 })
                .then(() => {
                    qaContainer.innerHTML = '';

                    // Show welcome message again
                    welcomeMessage.style.display = 'flex';
                    welcomeMessage.style.opacity = '0';
                    animate(welcomeMessage, { opacity: [0, 1], y: [-10, 0] }, { duration: 0.4 });

                    // Hide conversation container
                    animate(conversationContainer, { opacity: [1, 0] }, { duration: 0.3 })
                        .then(() => {
                            conversationContainer.classList.add('hidden');
                        });
                });
        }
    });

    // Setup voice input for accessibility
    setupVoiceInput();

    // Setup theme toggle for personalization
    setupThemeToggle();

    // Animation for initial page load
    const elementsToAnimate = [
        document.querySelector('header'),
        document.querySelector('.hero-title'),
        document.querySelector('.hero-subtitle'),
        document.querySelector('.divider'),
        welcomeMessage,
        document.querySelector('.main-input-container')
    ];

    // Staggered animation for page elements
    elementsToAnimate.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(15px)';

            setTimeout(() => {
                animate(element, {
                    opacity: [0, 1],
                    y: [15, 0]
                }, {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            }, index * 100); // Stagger animations
        }
    });

    // Focus input after animations complete
    setTimeout(() => {
        mainQuestionInput.focus();
    }, elementsToAnimate.length * 100 + 100);

    // If speechSynthesis is available, load voices
    if (window.speechSynthesis) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                // Voices loaded and ready for use
                console.log('Text-to-speech voices loaded');
            };
        }
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', initApp); 