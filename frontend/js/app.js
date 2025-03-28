// Import Framer Motion for enhanced animations
import { animate, motion, spring, inView } from 'https://cdn.skypack.dev/framer-motion@4.1.17/dist/es/index.mjs';

// DOM Elements
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const voiceInput = document.getElementById('voice-input');
const lightModeButton = document.getElementById('light-mode-button');
const darkModeButton = document.getElementById('dark-mode-button');
const conversation = document.getElementById('conversation');
const welcomeContainer = document.getElementById('welcome-container');
const appContainer = document.querySelector('.app-container');
const charCount = document.getElementById('char-count');
const userMessageTemplate = document.getElementById('user-message-template');
const assistantMessageTemplate = document.getElementById('assistant-message-template');

// Initialize message counter and storage
let messageCount = 0;
let isProcessing = false;

// Handle user question submission
function handleQuestionSubmit(event) {
    if (event) {
        event.preventDefault();
    }

    const question = questionInput.value.trim();
    if (!question || isProcessing) return;

    isProcessing = true;

    // Hide welcome message if visible
    if (welcomeContainer.style.display !== 'none') {
        welcomeContainer.style.display = 'none';
    }

    // Add user message
    const userMessageElement = addUserMessage(question);

    // Show typing indicator (simplified)
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span>Learning Companion is thinking...</span>';
    conversation.appendChild(typingIndicator);

    // Reset input
    questionInput.value = '';
    charCount.textContent = '0';

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();

        // Add AI response
        const response = generateSampleResponse(question);
        addAssistantMessage(response);

        // Update query count
        messageCount++;

        isProcessing = false;
    }, 1500);
}

// Add user message to conversation
function addUserMessage(text) {
    const clone = document.importNode(userMessageTemplate.content, true);
    const messageText = clone.querySelector('.message-text');
    messageText.textContent = text;

    conversation.appendChild(clone);
    return conversation.lastElementChild;
}

// Add assistant message to conversation
function addAssistantMessage(text) {
    const clone = document.importNode(assistantMessageTemplate.content, true);
    const messageText = clone.querySelector('.message-text');
    messageText.innerHTML = text;

    conversation.appendChild(clone);
    return conversation.lastElementChild;
}

// Generate sample response based on question
function generateSampleResponse(question) {
    // This would be replaced with actual AI response
    const responses = [
        `<p>That's a great question about <strong>${question.split(' ').slice(0, 5).join(' ')}...</strong></p>
        <p>The concept involves several key principles:</p>
        <ul>
            <li>First, we need to understand the fundamental theory</li>
            <li>Second, practical applications show us how it works in real-world scenarios</li>
            <li>Finally, recent research has expanded our understanding significantly</li>
        </ul>
        <p>Would you like me to elaborate on any specific aspect of this topic?</p>`,

        `<p>Exploring <strong>${question.split(' ').slice(0, 3).join(' ')}...</strong> is fascinating!</p>
        <p>From an educational perspective, this topic encompasses:</p>
        <ol>
            <li>Historical development and key contributors</li>
            <li>Core theoretical framework and principles</li>
            <li>Modern applications and future directions</li>
        </ol>
        <p>I can provide more specific information on any of these areas if you're interested.</p>`,

        `<p>When examining <strong>${question.split(' ').slice(0, 4).join(' ')}...</strong>, it's important to consider multiple perspectives.</p>
        <p>Current educational research suggests three main approaches:</p>
        <p>The first approach focuses on theoretical foundations, while the second examines practical implementations. The third, which has gained popularity recently, integrates both perspectives with technological innovations.</p>
        <p>Would you like to hear more about these approaches?</p>`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(-10px) translateX(-50%)';
    }, 10);

    // Fade out after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px) translateX(-50%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Setup theme toggle
function setupThemeToggle() {
    // Set up event listeners
    lightModeButton.addEventListener('click', () => {
        applyDarkMode(false);
    });

    darkModeButton.addEventListener('click', () => {
        applyDarkMode(true);
    });

    // Initialize theme based on user preference or system
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyDarkMode(true);
    } else if (savedTheme === 'light') {
        applyDarkMode(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyDarkMode(true);
    } else {
        applyDarkMode(false);
    }

    // Listen for system theme changes if no preference set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyDarkMode(e.matches);
        }
    });
}

// Apply dark mode or light mode
function applyDarkMode(isDark) {
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Apply to body
    if (isDark) {
        document.body.classList.add('dark-mode');
        lightModeButton.classList.remove('active');
        darkModeButton.classList.add('active');
    } else {
        document.body.classList.remove('dark-mode');
        lightModeButton.classList.add('active');
        darkModeButton.classList.remove('active');
    }

    // Force browser to re-compute all CSS
    document.body.offsetHeight;

    // Flash effect for visual feedback
    animate(appContainer,
        { opacity: [0.9, 1] },
        { duration: 0.3, ease: "easeOut" }
    );
}

// Footer tab functionality
function initFooterTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // In a real app, you would show the corresponding content
            // For now, just show a notification
            showNotification(`Switched to ${tab.textContent} view`);
        });
    });
}

// Initialize query input
function initQueryInput() {
    // Character count update
    questionInput.addEventListener('input', () => {
        const length = questionInput.value.length;
        charCount.textContent = length;

        // Visual feedback when approaching limit
        if (length > 400) {
            charCount.style.color = 'var(--color-warning)';
        } else if (length > 450) {
            charCount.style.color = 'var(--color-error)';
        } else {
            charCount.style.color = '';
        }

        // Auto-resize textarea
        questionInput.style.height = 'auto';
        questionInput.style.height = questionInput.scrollHeight + 'px';
    });

    // Send button click handling
    sendButton.addEventListener('click', handleQuestionSubmit);

    // Enter key handling
    questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleQuestionSubmit();
        }
    });

    // Voice input (simplified)
    voiceInput.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showNotification('Speech recognition not supported in this browser', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;

        // Add recording indicator
        voiceInput.classList.add('recording');
        showNotification('Listening for voice input...');

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            questionInput.value = transcript;
            questionInput.dispatchEvent(new Event('input'));
        };

        recognition.onend = () => {
            voiceInput.classList.remove('recording');
            showNotification('Voice input captured');
        };

        recognition.onerror = (event) => {
            voiceInput.classList.remove('recording');
            showNotification(`Error in voice recognition: ${event.error}`, 'error');
        };

        recognition.start();
    });
}

// Initialize app
function initApp() {
    // Initialize base components
    setupThemeToggle();
    initFooterTabs();
    initQueryInput();

    // Add loading animation
    document.body.classList.add('app-loaded');

    console.log('Learning Companion initialized');
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 