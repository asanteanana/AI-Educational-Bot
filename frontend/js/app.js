// Import Framer Motion for enhanced animations
import { animate, motion, spring, inView } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const mainForm = document.getElementById('main-form');
const mainQuestionInput = document.getElementById('main-question-input');
const mainSendButton = document.getElementById('main-send-button');
const voiceInputButton = document.getElementById('voice-input-button');
const lightModeButton = document.getElementById('light-mode-button');
const darkModeButton = document.getElementById('dark-mode-button');
const conversation = document.getElementById('conversation');
const welcomeContainer = document.querySelector('.welcome-container');
const conversationHeader = document.querySelector('.conversation-header');
const appContainer = document.querySelector('.app-container');

// Learning-focused responses with audio accessibility emphasis
const demoResponses = {
    "hello": "Hello! Welcome to your audio learning companion. I'm designed to make learning more accessible through spoken information. My responses are crafted to be clear and engaging when listened to. What topic would you like to explore today?",

    "who are you": "I'm your audio-first educational assistant, designed to make knowledge accessible through spoken content. I use natural-sounding text-to-speech technology to help diverse learners access information in a way that works for them. My approach is inspired by the universal accessibility principles championed by resources like Wikipedia, where knowledge should be available to everyone regardless of how they prefer or need to consume information.",

    "what can you do": "I can transform complex information into clear, spoken explanations that are easy to listen to and understand. This is particularly helpful for auditory learners, people with reading difficulties, those who are multitasking, or anyone who prefers listening over reading. You can ask me about virtually any topic, and I'll provide an explanation optimized for listening. You can also save these audio explanations for later or request simplified versions if needed.",

    "how does this work": "When you ask a question, I generate a response that's specifically formatted to sound natural when spoken aloud. My text-to-speech engine converts this text to high-quality audio that mimics natural human speech patterns, including appropriate pacing, emphasis, and intonation. This makes complex information more accessible to everyone, including people with reading difficulties, visual impairments, or those who simply prefer auditory learning. You can listen immediately or save the audio for later reference.",

    "accessibility": "Audio learning addresses several accessibility needs. For people with visual impairments, dyslexia, or other reading difficulties, spoken content provides access to information that might otherwise be challenging to consume. For those with attention difficulties, audio can sometimes be easier to focus on than text. And for people who are busy or multitasking, audio allows learning to happen alongside other activities. This approach to knowledge sharing follows the principles of universal design for learning, which aims to make education accessible to everyone.",

    "help": "I'd be happy to assist with your audio learning needs! You can ask me about any topic, and I'll provide information designed to be heard rather than read. When I respond, you'll see audio controls to listen to the explanation, request a simpler version, or save the audio for later. This service is particularly valuable if you're an auditory learner, have difficulty reading text, or simply prefer to consume information while multitasking. What would you like to learn about today?",

    "thanks": "You're very welcome! I'm glad I could help make information more accessible through audio. Learning should adapt to different needs and preferences, not the other way around. If you have more questions or topics to explore, feel free to ask anytime. I'm here to make knowledge accessible to everyone through the power of speech.",
};

// Simulate retrieval of information with a learning focus
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

    // Audio-learning focused fallback responses
    const fallbackResponses = [
        "That's an interesting topic to explore through audio learning. While I don't have complete information right now, I can create a spoken explanation about related concepts if you'd like. Audio formats make complex topics more accessible to many learners who process information better through listening.",

        "This would make for a fascinating audio lesson. In a complete system, I'd provide a spoken explanation with proper pacing and emphasis to make this information easy to absorb through listening. Would you like to explore a related topic that I can explain through audio?",

        "I appreciate your interest in learning about this through audio. While I don't have comprehensive information on this specific topic at the moment, audio learning has been shown to be particularly effective for complex subjects like this one. It allows learners to process information at their own pace and often improves retention.",

        "That's exactly the kind of thoughtful question that benefits from an audio explanation. While I don't have the full details right now, spoken explanations like those found in educational podcasts and audiobooks have revolutionized how we learn complex topics. They're especially helpful for auditory learners and those with reading difficulties.",

        "What a great topic to explore through listening! Audio learning, like what Wikipedia's spoken articles provide, makes knowledge more universally accessible. While I don't have the complete information on this yet, I'd be happy to provide audio explanations on related subjects that might interest you."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// Create a visually engaging typing indicator
const createTypingIndicator = () => {
    const template = document.getElementById('typing-indicator-template');
    return template.content.cloneNode(true);
};

// Enhanced notification with motion effects
const showNotification = (message, duration = 3000) => {
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
            y: [20, 0],
            scale: [0.95, 1]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]  // Spring-like curve for better feedback
        });
    }, 10);

    // Subtle hover animation
    notification.addEventListener('mouseenter', () => {
        animate(notification, {
            scale: 1.03,
            y: -3
        }, { duration: 0.2 });
    });

    notification.addEventListener('mouseleave', () => {
        animate(notification, {
            scale: 1,
            y: 0
        }, { duration: 0.2 });
    });

    // Remove after duration with smooth exit
    setTimeout(() => {
        animate(notification, {
            opacity: [1, 0],
            y: [0, 10],
            scale: [1, 0.95]
        }, {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => notification.remove());
    }, duration);
};

// Create a user message with motion
const createUserMessage = (question) => {
    const template = document.getElementById('user-message-template');
    const message = template.content.cloneNode(true);

    message.querySelector('.message-text').textContent = question;

    return message;
};

// Create an assistant message with motion
const createAssistantMessage = (answer) => {
    const template = document.getElementById('assistant-message-template');
    const message = template.content.cloneNode(true);

    message.querySelector('.message-text').textContent = answer;

    return message;
};

// Handle the submission of a question with enhanced animations
const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Add a subtle pulse animation to the app container to acknowledge submission
    animate(appContainer, {
        scale: [1, 1.005, 1],
        boxShadow: ['var(--shadow-md)', 'var(--shadow-lg)', 'var(--shadow-md)']
    }, {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
    });

    // Hide welcome message and show header if this is the first message
    if (welcomeContainer && welcomeContainer.style.display !== 'none') {
        animate(welcomeContainer, {
            opacity: [1, 0],
            height: [welcomeContainer.offsetHeight, 0],
            scale: [1, 0.95]
        }, {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            welcomeContainer.style.display = 'none';

            // Show the conversation header with a fade-in and slide animation
            if (conversationHeader) {
                conversationHeader.style.display = 'flex';
                conversationHeader.style.opacity = '0';
                conversationHeader.style.transform = 'translateY(-10px)';

                animate(conversationHeader, {
                    opacity: [0, 1],
                    y: [-10, 0]
                }, {
                    duration: 0.5,
                    delay: 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            }
        });
    }

    // Add user message with animation
    const userMessage = createUserMessage(question);
    conversation.appendChild(userMessage);

    // Get the actual DOM element to animate
    const userMessageElement = userMessage.querySelector('.message');
    userMessageElement.style.opacity = '0';
    userMessageElement.style.transform = 'translateY(10px)';

    // Animate message appearance
    animate(userMessageElement, {
        opacity: [0, 1],
        y: [10, 0]
    }, {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
    });

    // Add typing indicator with a staggered animation
    const typingIndicator = createTypingIndicator();
    conversation.appendChild(typingIndicator);

    // Get the actual typing indicator DOM element
    const typingElement = typingIndicator.querySelector('.message');
    typingElement.style.opacity = '0';
    typingElement.style.transform = 'translateY(10px)';

    // Animate typing indicator appearance
    animate(typingElement, {
        opacity: [0, 1],
        y: [10, 0]
    }, {
        duration: 0.4,
        delay: 0.2,
        ease: [0.34, 1.56, 0.64, 1]
    });

    // Scroll to bottom with smooth animation
    animate(conversation, {
        scrollTop: conversation.scrollHeight
    }, {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
    });

    try {
        // Simulate information retrieval
        const response = await simulateAPIResponse(question);

        // Remove typing indicator with a fade-out animation
        animate(typingElement, {
            opacity: [1, 0],
            y: [0, -10],
            scale: [1, 0.96]
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            const typingElement = conversation.querySelector('.status-warning').closest('.message');
            conversation.removeChild(typingElement);

            // Add assistant message
            const assistantMessage = createAssistantMessage(response);
            conversation.appendChild(assistantMessage);

            // Animate the new message with a more dramatic entrance
            const messageElement = assistantMessage.querySelector('.message');
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(20px) scale(0.98)';

            animate(messageElement, {
                opacity: [0, 1],
                y: [20, 0],
                scale: [0.98, 1]
            }, {
                duration: 0.6,
                delay: 0.1,
                ease: [0.34, 1.56, 0.64, 1]
            });

            // Add a subtle highlight effect to emphasize new content
            setTimeout(() => {
                animate(messageElement.querySelector('.message-content'), {
                    backgroundColor: ['var(--color-accent-light)', 'var(--color-bg-secondary)']
                }, {
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1]
                });
            }, 600);

            // Setup action buttons with staggered appearance
            setupActionButtons(messageElement.querySelector('.message-content'), response);

            // Stagger animate action buttons
            const actionButtons = messageElement.querySelectorAll('.action-button');
            actionButtons.forEach((button, index) => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(10px)';

                animate(button, {
                    opacity: [0, 1],
                    y: [10, 0]
                }, {
                    duration: 0.4,
                    delay: 0.2 + (index * 0.1),
                    ease: [0.34, 1.56, 0.64, 1]
                });
            });

            // Scroll to bottom with smooth animation
            animate(conversation, {
                scrollTop: conversation.scrollHeight
            }, {
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
            });
        });

    } catch (error) {
        // Handle errors gracefully
        animate(typingElement, {
            opacity: [1, 0],
            y: [0, -10]
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            const typingElement = conversation.querySelector('.status-warning').closest('.message');
            conversation.removeChild(typingElement);

            showNotification("Something went wrong with your learning journey. Let's try again.");
        });
    }
};

// Setup action buttons with enhanced animations
const setupActionButtons = (messageContent, answerText) => {
    const playAudioButton = messageContent.querySelector('.play-audio-button');
    const regenerateButton = messageContent.querySelector('.regenerate-button');
    const downloadAudioButton = messageContent.querySelector('.download-audio-button');

    // Set up audio playback
    let isSpeaking = false;

    playAudioButton.addEventListener('click', async () => {
        // Button click animation
        animate(playAudioButton, {
            scale: [1, 0.92, 1],
        }, {
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1]
        });

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            playAudioButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            Listen`;
            return;
        }

        // Change status pill to show playing with animation
        const statusPill = messageContent.querySelector('.status-pill');

        // Animate the status change
        animate(statusPill, {
            scale: [1, 1.1, 1],
            backgroundColor: ['var(--color-success-bg)', 'var(--color-info-bg)']
        }, {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1]
        });

        statusPill.className = 'status-pill status-info';
        statusPill.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        Playing lesson`;

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

                // Animate button change
                animate(playAudioButton, {
                    scale: [1, 0.95, 1.05, 1],
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });

                playAudioButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
                Listen`;

                // Reset status pill with animation
                animate(statusPill, {
                    scale: [1, 0.95, 1.05, 1],
                    backgroundColor: ['var(--color-info-bg)', 'var(--color-success-bg)']
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });

                statusPill.className = 'status-pill status-success';
                statusPill.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Discovered`;
            }, { once: true });

        } catch (error) {
            // Reset status pill
            animate(statusPill, {
                backgroundColor: ['var(--color-info-bg)', 'var(--color-success-bg)']
            }, {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            });

            statusPill.className = 'status-pill status-success';
            statusPill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Discovered`;

            showNotification('Could not play audio lesson. Please try again.');
        }
    });

    // Set up regenerate button
    regenerateButton.addEventListener('click', async () => {
        // Button click animation
        animate(regenerateButton, {
            scale: [1, 0.92, 1],
        }, {
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1]
        });

        // Change status pill to show regenerating with animation
        const statusPill = messageContent.querySelector('.status-pill');

        animate(statusPill, {
            scale: [1, 1.1, 1],
            backgroundColor: ['var(--color-success-bg)', 'var(--color-warning-bg)']
        }, {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1]
        });

        statusPill.className = 'status-pill status-warning';
        statusPill.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Finding new approach...`;

        try {
            // Get the question (first element before this one)
            const questionElement = messageContent.closest('.message').previousElementSibling;
            const question = questionElement.querySelector('.message-text').textContent;

            // Get new response
            const newResponse = await simulateAPIResponse(question);

            // Animate answer text change
            const messageTextElement = messageContent.querySelector('.message-text');

            animate(messageTextElement, {
                opacity: [1, 0.5, 1],
                y: [0, -5, 0]
            }, {
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1]
            });

            // Update answer text
            messageTextElement.textContent = newResponse;

            // Show notification
            showNotification('Found a different perspective for you!');

            // Reset status pill with animation
            animate(statusPill, {
                scale: [1, 0.95, 1.05, 1],
                backgroundColor: ['var(--color-warning-bg)', 'var(--color-success-bg)']
            }, {
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
            });

            statusPill.className = 'status-pill status-success';
            statusPill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Discovered`;

        } catch (error) {
            // Reset status pill
            animate(statusPill, {
                backgroundColor: ['var(--color-warning-bg)', 'var(--color-success-bg)']
            }, {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            });

            statusPill.className = 'status-pill status-success';
            statusPill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Discovered`;

            showNotification('Could not find a different approach. Please try again.');
        }
    });

    // Set up download audio button
    downloadAudioButton.addEventListener('click', async () => {
        // Button click animation
        animate(downloadAudioButton, {
            scale: [1, 0.92, 1],
        }, {
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1]
        });

        // Change status pill to show downloading with animation
        const statusPill = messageContent.querySelector('.status-pill');

        animate(statusPill, {
            scale: [1, 1.1, 1],
            backgroundColor: ['var(--color-success-bg)', 'var(--color-neutral-bg)']
        }, {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1]
        });

        statusPill.className = 'status-pill status-neutral';
        statusPill.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Saving lesson...`;

        try {
            await downloadAudio(answerText);

            // Show notification
            showNotification('Lesson saved for later study!');

            // Reset status pill with animation
            animate(statusPill, {
                scale: [1, 0.95, 1.05, 1],
                backgroundColor: ['var(--color-neutral-bg)', 'var(--color-success-bg)']
            }, {
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
            });

            statusPill.className = 'status-pill status-success';
            statusPill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Discovered`;

        } catch (error) {
            // Reset status pill
            animate(statusPill, {
                backgroundColor: ['var(--color-neutral-bg)', 'var(--color-success-bg)']
            }, {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            });

            statusPill.className = 'status-pill status-success';
            statusPill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Discovered`;

            showNotification('Could not save lesson. Please try again.');
        }
    });
};

// Text-to-speech functionality with enhanced voice
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
        utterance.rate = 0.95; // Slightly slower rate for better comprehension
        utterance.pitch = 1;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

        window.speechSynthesis.speak(utterance);
    });
};

// Enhanced download audio file with animation
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
                a.download = `learning-material-${Date.now()}.txt`;
                document.body.appendChild(a);

                // Add a visual indicator for download
                const downloadIcon = document.createElement('div');
                downloadIcon.style.position = 'fixed';
                downloadIcon.style.top = '50%';
                downloadIcon.style.left = '50%';
                downloadIcon.style.transform = 'translate(-50%, -50%)';
                downloadIcon.style.backgroundColor = 'var(--color-accent)';
                downloadIcon.style.borderRadius = '50%';
                downloadIcon.style.width = '60px';
                downloadIcon.style.height = '60px';
                downloadIcon.style.display = 'flex';
                downloadIcon.style.alignItems = 'center';
                downloadIcon.style.justifyContent = 'center';
                downloadIcon.style.color = 'white';
                downloadIcon.style.zIndex = '9999';
                downloadIcon.style.boxShadow = '0 0 20px var(--color-accent-glow)';
                downloadIcon.style.opacity = '0';
                downloadIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>`;
                document.body.appendChild(downloadIcon);

                animate(downloadIcon, {
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.2, 1, 0.8],
                    y: [0, -20, -20, 20]
                }, {
                    duration: 1.2,
                    ease: [0.34, 1.56, 0.64, 1]
                }).then(() => {
                    document.body.removeChild(downloadIcon);
                });

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

// Setup voice input with enhanced visual feedback
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
        // Button animation
        animate(voiceInputButton, {
            scale: [1, 0.9, 1.1, 1],
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
        });

        if (isListening) {
            recognition.stop();
            return;
        }

        // Clear input with animation
        animate(mainQuestionInput, {
            borderColor: ['transparent', 'var(--color-accent)'],
            scale: [1, 0.99, 1]
        }, {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1]
        });

        mainQuestionInput.value = '';
        mainQuestionInput.placeholder = 'Listening to your question...';

        // Show recording state with animation
        voiceInputButton.classList.add('recording');

        // Animate the recording glow
        animate(voiceInputButton, {
            boxShadow: ['0 0 0 0 rgba(255, 59, 48, 0)', '0 0 0 8px rgba(255, 59, 48, 0.4)', '0 0 0 0 rgba(255, 59, 48, 0)']
        }, {
            duration: 2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1]
        });

        recognition.start();
        isListening = true;

        showNotification('Listening... Speak clearly to explore your topic');
    });

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');

        // Animate text appearance in input field
        if (mainQuestionInput.value === '') {
            animate(mainQuestionInput, {
                scale: [0.99, 1.01, 1]
            }, {
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
            });
        }

        mainQuestionInput.value = transcript;
    };

    recognition.onend = () => {
        isListening = false;
        voiceInputButton.classList.remove('recording');

        // Stop the glow animation
        animate(voiceInputButton, {
            boxShadow: ['0 0 0 8px rgba(255, 59, 48, 0.4)', '0 0 0 0 rgba(255, 59, 48, 0)']
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        });

        mainQuestionInput.placeholder = 'What are you curious about?';

        if (mainQuestionInput.value.trim()) {
            // If we captured something, submit after a short delay
            setTimeout(() => {
                // Animate the input field to acknowledge submission
                animate(mainQuestionInput, {
                    scale: [1, 0.98, 1]
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });

                mainForm.dispatchEvent(new Event('submit'));
            }, 300);
        } else {
            showNotification('No question detected. What would you like to learn about?');
        }
    };

    recognition.onerror = () => {
        isListening = false;
        voiceInputButton.classList.remove('recording');
        mainQuestionInput.placeholder = 'What are you curious about?';

        // Stop the glow animation
        animate(voiceInputButton, {
            boxShadow: ['0 0 0 8px rgba(255, 59, 48, 0.4)', '0 0 0 0 rgba(255, 59, 48, 0)']
        }, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        });

        showNotification('Voice recognition error. Please try typing your question instead.');
    };
};

// Setup theme toggle with enhanced animations
const setupThemeToggle = () => {
    // Dark mode: Define the body class based on system preference or saved setting
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            lightModeButton.classList.remove('active');
            darkModeButton.classList.add('active');
        } else {
            document.body.classList.remove('dark-mode');
            darkModeButton.classList.remove('active');
            lightModeButton.classList.add('active');
        }
    };

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply initial theme
    applyDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDarkMode));

    // Light mode toggle
    lightModeButton.addEventListener('click', () => {
        if (lightModeButton.classList.contains('active')) return;

        // Animated transition for smoother theme change
        animate(document.body, {
            opacity: [1, 0.98, 1],
            scale: [1, 0.999, 1]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
        });

        applyDarkMode(false);
        localStorage.setItem('theme', 'light');

        // Button press feedback
        animate(lightModeButton, {
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
        });

        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.width = '100vw';
        ripple.style.height = '100vh';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '-1';
        document.body.appendChild(ripple);

        animate(ripple, {
            transform: ['scale(0)', 'scale(3)'],
            opacity: [1, 0]
        }, {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            document.body.removeChild(ripple);
        });

        showNotification('Light mode activated for better reading and visual accessibility');
    });

    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        if (darkModeButton.classList.contains('active')) return;

        // Animated transition for smoother theme change
        animate(document.body, {
            opacity: [1, 0.98, 1],
            scale: [1, 0.999, 1]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
        });

        applyDarkMode(true);
        localStorage.setItem('theme', 'dark');

        // Button press feedback
        animate(darkModeButton, {
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0]
        }, {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
        });

        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.width = '100vw';
        ripple.style.height = '100vh';
        ripple.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '-1';
        document.body.appendChild(ripple);

        animate(ripple, {
            transform: ['scale(0)', 'scale(3)'],
            opacity: [1, 0]
        }, {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            document.body.removeChild(ripple);
        });

        showNotification('Dark mode activated for reduced eye strain and nighttime listening');
    });
};

// Animated entrance effects for UI elements
const animateUIElements = () => {
    // Get all the key UI sections
    const elements = [
        appContainer,
        document.querySelector('.app-header'),
        document.querySelector('.input-container'),
        welcomeContainer,
        document.querySelector('.theme-toggle')
    ];

    // Set initial states
    elements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        }
    });

    // Staggered animation of elements with spring physics for more natural motion
    elements.forEach((el, index) => {
        if (el) {
            setTimeout(() => {
                animate(el, {
                    opacity: [0, 1],
                    y: [20, 0],
                    scale: [0.98, 1]
                }, {
                    duration: 0.7,
                    ease: [0.34, 1.56, 0.64, 1] // Spring-like curve
                });
            }, 100 + (index * 120));
        }
    });

    // Enhanced animation for app title with character-by-character reveal
    const appTitle = document.querySelector('.app-title');
    if (appTitle) {
        const originalText = appTitle.textContent;
        const charCount = originalText.length;

        // Create wrapper for text animation
        const charWrapper = document.createElement('span');
        charWrapper.style.position = 'relative';
        charWrapper.style.display = 'inline-block';

        // Clear original content
        appTitle.textContent = '';
        appTitle.appendChild(charWrapper);

        // Create spans for each character
        for (let i = 0; i < charCount; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = originalText[i];
            charSpan.style.opacity = '0';
            charSpan.style.display = 'inline-block';
            charSpan.style.transform = 'translateY(20px)';
            charWrapper.appendChild(charSpan);

            // Animate each character with stagger
            setTimeout(() => {
                animate(charSpan, {
                    opacity: [0, 1],
                    y: [20, 0],
                    rotate: [10, 0]
                }, {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            }, 600 + (i * 30)); // Starts after initial page load
        }
    }

    // Add subtle scroll-triggered animations to the welcome container content
    if (welcomeContainer) {
        const welcomeTitle = welcomeContainer.querySelector('.welcome-title');
        const welcomeText = welcomeContainer.querySelector('.welcome-text');
        const welcomeIcon = welcomeContainer.querySelector('.welcome-icon');

        // Create and set up intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Different animation for each element
                    if (entry.target === welcomeIcon) {
                        animate(welcomeIcon, {
                            scale: [0.5, 1.2, 1],
                            rotate: [0, 15, 0]
                        }, {
                            duration: 1,
                            ease: [0.34, 1.56, 0.64, 1]
                        });
                    } else if (entry.target === welcomeTitle) {
                        animate(welcomeTitle, {
                            opacity: [0, 1],
                            y: [15, 0]
                        }, {
                            duration: 0.7,
                            delay: 0.2,
                            ease: [0.34, 1.56, 0.64, 1]
                        });
                    } else if (entry.target === welcomeText) {
                        animate(welcomeText, {
                            opacity: [0, 1],
                            y: [10, 0]
                        }, {
                            duration: 0.7,
                            delay: 0.4,
                            ease: [0.34, 1.56, 0.64, 1]
                        });
                    }

                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // Set initial states and observe elements
        if (welcomeIcon) {
            welcomeIcon.style.opacity = '1';
            welcomeIcon.style.transform = 'scale(0.5)';
            observer.observe(welcomeIcon);
        }

        if (welcomeTitle) {
            welcomeTitle.style.opacity = '0';
            welcomeTitle.style.transform = 'translateY(15px)';
            observer.observe(welcomeTitle);
        }

        if (welcomeText) {
            welcomeText.style.opacity = '0';
            welcomeText.style.transform = 'translateY(10px)';
            observer.observe(welcomeText);
        }
    }

    // Add magnetic hover effect to app logo
    const logo = document.querySelector('.app-logo');
    if (logo) {
        // Create shine element
        const shine = document.createElement('div');
        shine.style.position = 'absolute';
        shine.style.top = '0';
        shine.style.left = '-100%';
        shine.style.width = '50%';
        shine.style.height = '100%';
        shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)';
        shine.style.transform = 'skewX(-25deg)';
        shine.style.pointerEvents = 'none';

        logo.style.position = 'relative';
        logo.style.overflow = 'hidden';
        logo.appendChild(shine);

        // Add magnetic hover effect
        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 10;
            const moveY = (e.clientY - centerY) / 10;

            animate(logo, {
                x: moveX,
                y: moveY,
                rotateX: moveY / 2,
                rotateY: -moveX / 2
            }, { duration: 0.2 });
        });

        logo.addEventListener('mouseleave', () => {
            animate(logo, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0
            }, {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1]
            });
        });

        // Animate shine every few seconds
        const animateShine = () => {
            animate(shine, {
                left: ['-100%', '200%']
            }, {
                duration: 1.5,
                ease: [0.4, 0, 0.2, 1]
            });
        };

        // Initial animation and then repeat
        setTimeout(animateShine, 2000);
        setInterval(animateShine, 8000);
    }

    // Add parallax effect to the app container on mouse move
    if (appContainer) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            // Subtle movement based on mouse position
            requestAnimationFrame(() => {
                appContainer.style.transform = `translateX(${mouseX * 5}px) translateY(${mouseY * 5}px)`;
            });
        });

        // Enhanced hover effect
        appContainer.addEventListener('mouseenter', () => {
            animate(appContainer, {
                y: -5,
                boxShadow: [
                    'var(--shadow-md)',
                    '0 8px 30px rgba(0, 0, 0, 0.12)'
                ]
            }, { duration: 0.3 });
        });

        appContainer.addEventListener('mouseleave', () => {
            animate(appContainer, {
                y: 0,
                boxShadow: [
                    '0 8px 30px rgba(0, 0, 0, 0.12)',
                    'var(--shadow-md)'
                ]
            }, { duration: 0.3 });
        });
    }

    // Add animated focus effect to input field
    const inputField = document.getElementById('main-question-input');
    if (inputField) {
        inputField.addEventListener('focus', () => {
            const inputWrapper = inputField.closest('.input-wrapper');
            if (inputWrapper) {
                animate(inputWrapper, {
                    scale: [1, 1.01],
                    boxShadow: [
                        'var(--shadow-sm)',
                        '0 0 0 2px rgba(0, 113, 227, 0.2), 0 0 15px rgba(0, 113, 227, 0.15)'
                    ]
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            }
        });

        inputField.addEventListener('blur', () => {
            const inputWrapper = inputField.closest('.input-wrapper');
            if (inputWrapper) {
                animate(inputWrapper, {
                    scale: [1.01, 1],
                    boxShadow: [
                        '0 0 0 2px rgba(0, 113, 227, 0.2), 0 0 15px rgba(0, 113, 227, 0.15)',
                        'var(--shadow-sm)'
                    ]
                }, {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                });
            }
        });
    }

    // Add animated hover effects to all buttons
    document.querySelectorAll('button').forEach(button => {
        if (!button.classList.contains('theme-button') && !button.classList.contains('action-button')) {
            button.addEventListener('mouseenter', () => {
                animate(button, {
                    scale: [1, 1.05],
                    y: [0, -2]
                }, {
                    duration: 0.2,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            });

            button.addEventListener('mouseleave', () => {
                animate(button, {
                    scale: [1.05, 1],
                    y: [-2, 0]
                }, {
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                });
            });
        }
    });
};

// Initialize the application with enhanced animations
const initApp = () => {
    // Hide conversation header initially
    if (conversationHeader) {
        conversationHeader.style.display = 'none';
    }

    // Add framer-motion inspired animations to the UI
    animateUIElements();

    // Setup event listeners with enhanced feedback
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = mainQuestionInput.value.trim();
        if (question) {
            // Add button press animation
            animate(mainSendButton, {
                scale: [1, 0.85, 1],
                rotate: [0, -5, 0]
            }, {
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
            });

            handleQuestionSubmit(question);
            mainQuestionInput.value = '';
        } else {
            // Shake animation for empty input
            animate(mainQuestionInput, {
                x: [0, -5, 5, -5, 5, 0],
            }, {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1]
            });

            // Subtle highlight effect
            animate(mainQuestionInput, {
                borderColor: ['transparent', 'var(--color-error)', 'transparent']
            }, {
                duration: 1,
                ease: [0.34, 1.56, 0.64, 1]
            });

            showNotification('What would you like to learn about?');
        }
    });

    // Add subtle bounce animation to the send button when input has content
    if (mainQuestionInput && mainSendButton) {
        mainQuestionInput.addEventListener('input', () => {
            if (mainQuestionInput.value.trim().length > 0) {
                animate(mainSendButton, {
                    scale: [1, 1.1, 1],
                }, {
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                });
            }
        });
    }

    // Setup voice input
    setupVoiceInput();

    // Setup theme toggle
    setupThemeToggle();

    // Focus input after load with animation
    setTimeout(() => {
        mainQuestionInput.focus();

        // Subtle pulse animation to draw attention
        animate(mainQuestionInput, {
            boxShadow: [
                'none',
                '0 0 0 3px var(--color-accent-light), 0 0 15px var(--color-accent-glow)',
                'none'
            ]
        }, {
            duration: 1.5,
            ease: [0.34, 1.56, 0.64, 1]
        });
    }, 1000);

    // Add ripple effect to send button
    mainSendButton.addEventListener('mousedown', (e) => {
        const rect = mainSendButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.top = `${y}px`;
        ripple.style.left = `${x}px`;
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.width = '120px';
        ripple.style.height = '120px';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';

        mainSendButton.appendChild(ripple);

        animate(ripple, {
            transform: ['translate(-50%, -50%) scale(0)', 'translate(-50%, -50%) scale(1)'],
            opacity: [1, 0]
        }, {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }).then(() => {
            mainSendButton.removeChild(ripple);
        });
    });
};

// Monitor system dark mode changes
const watchSystemColorScheme = () => {
    if (window.matchMedia) {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Add change listener
        try {
            // Modern approach
            colorSchemeQuery.addEventListener('change', (e) => {
                const savedTheme = localStorage.getItem('theme');
                // Only auto switch if user hasn't explicitly set a preference
                if (!savedTheme) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        lightModeButton.classList.remove('active');
                        darkModeButton.classList.add('active');
                    } else {
                        document.body.classList.remove('dark-mode');
                        darkModeButton.classList.remove('active');
                        lightModeButton.classList.add('active');
                    }
                }
            });
        } catch (e) {
            // Fallback for older browsers
            colorSchemeQuery.addListener((e) => {
                const savedTheme = localStorage.getItem('theme');
                if (!savedTheme) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        lightModeButton.classList.remove('active');
                        darkModeButton.classList.add('active');
                    } else {
                        document.body.classList.remove('dark-mode');
                        darkModeButton.classList.remove('active');
                        lightModeButton.classList.add('active');
                    }
                }
            });
        }
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    watchSystemColorScheme();
}); 