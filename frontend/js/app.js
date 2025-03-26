// Import Framer Motion for advanced animations
import { animate, transform, stagger, inView } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const welcomeContainer = document.getElementById('welcome-container');
const conversationContainer = document.getElementById('conversation-container');
const qaContainer = document.getElementById('qa-container');
const newConversationButton = document.getElementById('new-conversation');
const voiceInputButton = document.getElementById('voice-input-button');
const heroSection = document.querySelector('.hero');

// Demo responses to simulate a backend - updated for a friendlier, more Apple-like tone
const demoResponses = {
    "hello": "Hello! I'm Knowledge, your learning companion. I'm designed to help you discover and understand new information. What would you like to learn about today?",
    "who are you": "I'm Knowledge, an intelligent assistant designed to make learning enjoyable and accessible. I can answer questions, explain concepts, and even read information aloud with a natural-sounding voice.",
    "what can you do": "I can help you learn about virtually any topic, provide explanations in a clear, conversational way, and even read my responses aloud so you can listen while multitasking. Think of me as your personal learning companion.",
    "help": "I'm here to assist with your learning journey. You can ask me questions on any topic, request explanations of complex concepts, or have me read information aloud. Just type your question, and I'll help you explore.",
    "thanks": "You're welcome! It's my pleasure to help you learn. If you have more questions or want to explore other topics, I'm here for you.",
};

// Backend API simulation
const simulateAPIResponse = async (question) => {
    // Simulate network latency (600-1400ms for more realism)
    const delay = Math.floor(Math.random() * 800) + 600;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Normalize the question by removing punctuation and converting to lowercase
    const normalizedQuestion = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Check for keywords in the question
    for (const [keyword, response] of Object.entries(demoResponses)) {
        if (normalizedQuestion.includes(keyword)) {
            return response;
        }
    }

    // Friendlier fallback responses with Apple-like tone
    const fallbackResponses = [
        "That's an excellent question. In the full version, I would connect to a knowledge database to provide you with a detailed and accurate answer.",
        "I'd love to help with that question. In this demo, I can respond to basic inquiries, but the complete version would offer an in-depth exploration of this topic.",
        "Great question! The full version of Knowledge would provide you with a comprehensive answer backed by reliable sources.",
        "I understand you're curious about this topic. While this is a demo with limited responses, the complete Knowledge experience would deliver thorough answers to questions like yours.",
        "Thanks for your question. In the full implementation, I would analyze various trusted sources to give you a well-rounded answer on this subject."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a typing indicator with animated dots
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

// Apple-style notification function with smooth animations
const showNotification = (message, duration = 2500) => {
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

    // Show notification with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after duration with animation
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
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

    // Animate out welcome container if visible
    if (!welcomeContainer.classList.contains('hidden')) {
        animate(welcomeContainer, { opacity: [1, 0], y: [0, 20] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
            .then(() => {
                welcomeContainer.classList.add('hidden');
                conversationContainer.classList.remove('hidden');

                // Animate in conversation container
                animate(conversationContainer, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
            });
    } else {
        if (conversationContainer.classList.contains('hidden')) {
            conversationContainer.classList.remove('hidden');
            animate(conversationContainer, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
        }
    }

    // Create a new QA pair and add it to the container
    const newPair = createQAPair(question, '');
    const qaPairElement = newPair.querySelector('.qa-pair');

    // Set initial state for animation
    qaPairElement.style.opacity = '0';
    qaPairElement.style.transform = 'translateY(20px)';

    // Add the pair to the container
    qaContainer.appendChild(newPair);

    // Animate the new pair in
    animate(qaPairElement, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });

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

        // Remove typing indicator with a fade out
        animate(typingIndicator, { opacity: [1, 0] }, { duration: 0.3 })
            .then(() => {
                typingIndicator.remove();

                // Show answer with a typewriter effect
                answerText.textContent = '';
                answerText.style.display = 'block';

                // Set up typewriter effect
                const words = response.split(' ');
                let currentText = '';
                let wordIndex = 0;

                // Use a faster typing speed for demo purposes
                const typeNextWord = () => {
                    if (wordIndex < words.length) {
                        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                        answerText.textContent = currentText;
                        wordIndex++;

                        // Random delay between words for natural effect
                        setTimeout(typeNextWord, Math.random() * 30 + 20);
                    } else {
                        // Show answer actions with a fade in
                        const actionsElement = qaPairElement.querySelector('.answer-actions');
                        actionsElement.style.opacity = '0';
                        actionsElement.style.display = 'flex';
                        animate(actionsElement, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, ease: "easeOut" });

                        // Set up action buttons
                        setupActionButtons(qaPairElement, response);
                    }
                };

                // Start typing effect
                setTimeout(typeNextWord, 150);
            });

        // Scroll to the answer with smooth animation
        setTimeout(() => {
            qaPairElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } catch (error) {
        console.error('Error:', error);

        // Remove typing indicator
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

    // Add hover animations to buttons
    const buttons = qaPairElement.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            animate(button, { scale: [1, 1.05] }, { duration: 0.2, ease: "easeOut" });
        });

        button.addEventListener('mouseleave', () => {
            animate(button, { scale: [1.05, 1] }, { duration: 0.2, ease: "easeOut" });
        });
    });

    // Play audio button
    playButton.addEventListener('click', () => {
        speak(answerText);
        animate(playButton, { scale: [1, 0.95, 1] }, { duration: 0.4, ease: "easeInOut" });
    });

    // Regenerate button
    regenerateButton.addEventListener('click', async () => {
        const questionText = qaPairElement.querySelector('.question-text').textContent;
        const answerTextElement = qaPairElement.querySelector('.answer-text');
        const actionsElement = qaPairElement.querySelector('.answer-actions');

        // Hide answer and actions with animation
        await animate(actionsElement, { opacity: [1, 0], y: [0, 10] }, { duration: 0.3 }).then(() => {
            actionsElement.style.display = 'none';
        });

        await animate(answerTextElement, { opacity: [1, 0] }, { duration: 0.3 }).then(() => {
            answerTextElement.style.display = 'none';
        });

        // Create and add typing indicator
        const answerContainer = qaPairElement.querySelector('.answer-container');
        const typingIndicator = createTypingIndicator();
        typingIndicator.style.opacity = '0';
        answerContainer.insertBefore(typingIndicator, answerContainer.firstChild);

        // Fade in typing indicator
        animate(typingIndicator, { opacity: [0, 1] }, { duration: 0.3 });

        try {
            // Get a new response (with added delay for realism)
            await new Promise(resolve => setTimeout(resolve, 800));
            const newResponse = await simulateAPIResponse(questionText);

            // Remove typing indicator with animation
            await animate(typingIndicator, { opacity: [1, 0] }, { duration: 0.3 }).then(() => {
                typingIndicator.remove();
            });

            // Show answer with typewriter effect
            answerTextElement.textContent = '';
            answerTextElement.style.display = 'block';
            answerTextElement.style.opacity = '1';

            // Set up typewriter effect for regenerated response
            const words = newResponse.split(' ');
            let currentText = '';
            let wordIndex = 0;

            const typeNextWord = () => {
                if (wordIndex < words.length) {
                    currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                    answerTextElement.textContent = currentText;
                    wordIndex++;
                    setTimeout(typeNextWord, Math.random() * 30 + 20);
                } else {
                    // Show answer actions with animation
                    actionsElement.style.display = 'flex';
                    animate(actionsElement, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, ease: "easeOut" });

                    // Update the action buttons with the new response
                    playButton.onclick = () => speak(newResponse);
                    downloadButton.onclick = () => downloadAudio(newResponse);

                    showNotification('Response regenerated');
                }
            };

            // Start typing effect
            setTimeout(typeNextWord, 150);
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
        animate(downloadButton, { scale: [1, 0.95, 1] }, { duration: 0.4, ease: "easeInOut" });
    });
};

// Enhanced text-to-speech function
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

    // Select a high-quality voice
    const selectedVoice = findVoiceByName('Samantha') ||
        findVoiceByName('Daniel') ||
        findVoiceByName('Google US English') ||
        findVoiceByName('Microsoft Zira') ||
        voices.find(voice => voice.lang === 'en-US') ||
        voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.rate = 1.0;  // Speech rate
        utterance.pitch = 1.0; // Speech pitch
    }

    // Show notification with different messages
    utterance.onstart = () => {
        const speakingMessages = [
            "Playing audio response...",
            "Speaking...",
            "Now playing audio...",
            "Knowledge is speaking..."
        ];
        const randomMessage = speakingMessages[Math.floor(Math.random() * speakingMessages.length)];
        showNotification(randomMessage);
    };

    utterance.onend = () => {
        showNotification("Audio playback complete", 1500);
    };

    window.speechSynthesis.speak(utterance);
};

// Enhanced download audio function
const downloadAudio = async (text) => {
    try {
        // Create visual feedback that download would happen
        showNotification("Preparing audio download...", 1500);

        // After a delay to simulate processing
        setTimeout(() => {
            showNotification("Audio file ready for download", 2000);
        }, 1500);

        // Here's what a real implementation might do:
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
        showNotification("Could not prepare audio for download");
    }
};

// Set up voice input with Apple-style feedback
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
        showNotification("Listening to your question...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        mainQuestionInput.value = transcript;

        // Show the transcription with a visual feedback
        showNotification(`Transcribed: "${transcript.substring(0, 30)}${transcript.length > 30 ? '...' : ''}"`, 1800);

        // Focus on input to show the user what was transcribed
        mainQuestionInput.focus();
    };

    recognition.onend = () => {
        voiceInputButton.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceInputButton.classList.remove('recording');

        // Provide more helpful error messages
        if (event.error === 'no-speech') {
            showNotification("I didn't hear anything. Please try speaking again.");
        } else if (event.error === 'network') {
            showNotification("Network error. Please check your connection.");
        } else {
            showNotification("Couldn't understand speech. Please try again.");
        }
    };

    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
};

// Add subtle parallax effect to hero section
const setupHeroParallax = () => {
    if (!heroSection) return;

    const heroBackdrop = heroSection.querySelector('.hero-backdrop');
    if (!heroBackdrop) return;

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate position relative to center (values between -1 and 1)
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        // Apply subtle transform to create parallax effect
        heroBackdrop.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
    });
};

// Add scroll-triggered animations
const setupScrollAnimations = () => {
    // Define elements to observe
    const elementsToAnimate = document.querySelectorAll('.hero-title, .hero-subtitle, .main-input-container, .hero-features');

    // Setup IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine animation based on element
                if (entry.target.classList.contains('hero-title')) {
                    animate(entry.target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] });
                } else if (entry.target.classList.contains('hero-subtitle')) {
                    animate(entry.target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] });
                } else if (entry.target.classList.contains('main-input-container')) {
                    animate(entry.target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] });
                } else if (entry.target.classList.contains('hero-features')) {
                    // Stagger animation for feature items
                    const features = entry.target.querySelectorAll('.feature');
                    features.forEach((feature, i) => {
                        animate(feature, { opacity: [0, 1], y: [20, 0] }, {
                            duration: 0.5,
                            delay: 0.4 + (i * 0.1),
                            ease: [0.22, 1, 0.36, 1]
                        });
                    });
                }

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Start observing elements
    elementsToAnimate.forEach(element => {
        observer.observe(element);
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
                // Clear and re-enable input with a small delay for better UX
                setTimeout(() => {
                    mainQuestionInput.value = '';
                    mainQuestionInput.disabled = false;
                    mainSendButton.disabled = false;
                    mainSendButton.classList.remove('loading');
                    mainQuestionInput.focus();
                }, 300);
            });
    });

    // Set up new conversation button with animation
    newConversationButton.addEventListener('click', () => {
        // Animate the transition
        animate(qaContainer, { opacity: [1, 0], y: [0, 20] }, { duration: 0.4 })
            .then(() => {
                // Clear the QA container
                qaContainer.innerHTML = '';

                // Show welcome container, hide conversation container
                conversationContainer.classList.add('hidden');
                welcomeContainer.classList.remove('hidden');

                // Animate welcome container in
                animate(welcomeContainer, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });

                // Focus on input
                mainQuestionInput.focus();
            });
    });

    // Set up voice input if available
    setupVoiceInput();

    // Set up hero parallax effect
    setupHeroParallax();

    // Set up scroll animations
    setupScrollAnimations();
};

// Wait for document to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Knowledge app initialized');

    // Initialize app
    initApp();

    // Apply initial animations with a slight delay
    setTimeout(() => {
        // Animate hero elements in sequence
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const mainInputContainer = document.querySelector('.main-input-container');
        const heroFeatures = document.querySelectorAll('.feature');

        if (heroTitle) {
            animate(heroTitle, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
        }

        if (heroSubtitle) {
            animate(heroSubtitle, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] });
        }

        if (mainInputContainer) {
            animate(mainInputContainer, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] });
        }

        // Staggered animation for features
        if (heroFeatures.length > 0) {
            heroFeatures.forEach((feature, i) => {
                animate(feature, { opacity: [0, 1], y: [20, 0] }, {
                    duration: 0.5,
                    delay: 0.3 + (i * 0.1),
                    ease: [0.22, 1, 0.36, 1]
                });
            });
        }
    }, 200);

    // Listen for voices to load (needed in some browsers)
    if (window.speechSynthesis) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => console.log('Voices loaded');
        }

        // Preload voices
        window.speechSynthesis.getVoices();
    }
}); 