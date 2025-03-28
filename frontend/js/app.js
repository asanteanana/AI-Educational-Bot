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
const charCount = document.getElementById('char-count');
const charMax = document.getElementById('char-max');
const userMessageTemplate = document.getElementById('user-message-template');
const assistantMessageTemplate = document.getElementById('assistant-message-template');
const typingIndicatorTemplate = document.getElementById('typing-indicator-template');
const audioControls = document.getElementById('audio-controls');
const queryCount = document.getElementById('query-count');
const clearSession = document.getElementById('clear-session');

// Theme and accessibility controls
const highContrastButton = document.getElementById('high-contrast-button');
const textIncreaseButton = document.getElementById('text-increase-button');
const textDecreaseButton = document.getElementById('text-decrease-button');

// View controls
const textViewButton = document.getElementById('text-view-button');
const audioViewButton = document.getElementById('audio-view-button');

// TTS Model Selector
const ttsModelSelect = document.getElementById('tts-model');
const modelPerformance = document.getElementById('model-performance');
const previewVoiceButton = document.getElementById('preview-voice');

// Audio playback controls
const playPauseButton = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const speedToggle = document.getElementById('speed-toggle');
const speedOptions = document.getElementById('speed-options');
const volumeButton = document.getElementById('volume-button');
const volumeSlider = document.getElementById('volume-slider');
const downloadAudioButton = document.getElementById('download-audio');

// Modal Elements
const historyButton = document.getElementById('history-button');
const bookmarkButton = document.getElementById('bookmark-button');
const settingsButton = document.getElementById('settings-button');
const historyModal = document.getElementById('history-modal');
const bookmarksModal = document.getElementById('bookmarks-modal');
const settingsModal = document.getElementById('settings-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const saveSettingsButton = document.getElementById('save-settings');
const resetSettingsButton = document.getElementById('reset-settings');

// Sample query chips
const queryChips = document.querySelectorAll('.query-chip');

// Initialize message counter and storage
let messageCount = 0;
let isProcessing = false;
let currentAudio = null;
let wavesurfer = null;
let fontSizePercent = 100;

// Initialize WaveSurfer
function initWaveSurfer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: getComputedStyle(document.documentElement).getPropertyValue('--color-waveform').trim(),
        progressColor: getComputedStyle(document.documentElement).getPropertyValue('--color-progress').trim(),
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 1,
        barRadius: 1,
        height: 80,
        responsive: true,
    });

    wavesurfer.on('ready', function() {
        const duration = wavesurfer.getDuration();
        totalTimeDisplay.textContent = formatTime(duration);
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    wavesurfer.on('play', function() {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

    wavesurfer.on('pause', function() {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    wavesurfer.on('audioprocess', function() {
        const currentTime = wavesurfer.getCurrentTime();
        currentTimeDisplay.textContent = formatTime(currentTime);
    });
}

// Format time for audio display (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds) % 60;
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
}

// Handle user question submission
function handleQuestionSubmit(event) {
    if (event) {
        event.preventDefault();
    }

    const question = mainQuestionInput.value.trim();
    if (!question || isProcessing) return;

    isProcessing = true;
    
    // Hide welcome message and show conversation header
    if (welcomeContainer.style.display !== 'none') {
        welcomeContainer.style.display = 'none';
        conversationHeader.style.opacity = '1';
        conversationHeader.style.transform = 'translateY(0)';
    }

    // Add user message
    const userMessageElement = addUserMessage(question);
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    // Reset input
    mainQuestionInput.value = '';
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
        queryCount.textContent = `${messageCount} ${messageCount === 1 ? 'query' : 'queries'}`;
        
        isProcessing = false;
    }, 2000);
}

// Add user message to conversation
function addUserMessage(text) {
    const clone = document.importNode(userMessageTemplate.content, true);
    const messageText = clone.querySelector('.message-text');
    messageText.textContent = text;
    
    // Add edit functionality to user messages
    const editButton = clone.querySelector('.edit-message');
    editButton.addEventListener('click', () => {
        mainQuestionInput.value = text;
        mainQuestionInput.focus();
        updateCharCount();
    });
    
    conversation.appendChild(clone);
    return conversation.lastElementChild;
}

// Add assistant message to conversation
function addAssistantMessage(text) {
    const clone = document.importNode(assistantMessageTemplate.content, true);
    const messageText = clone.querySelector('.message-text');
    messageText.innerHTML = text;
    
    // Add event listeners for assistant message actions
    const playAudioButton = clone.querySelector('.play-audio-button');
    playAudioButton.addEventListener('click', () => {
        playResponseAudio(text);
    });
    
    const regenerateButton = clone.querySelector('.regenerate-button');
    regenerateButton.addEventListener('click', () => {
        showNotification('Generating simpler explanation...');
        setTimeout(() => {
            messageText.innerHTML = generateSimplifiedResponse(text);
        }, 1000);
    });
    
    const bookmarkButton = clone.querySelector('.bookmark-response');
    bookmarkButton.addEventListener('click', () => {
        toggleBookmark(text);
    });
    
    const copyButton = clone.querySelector('.copy-response');
    copyButton.addEventListener('click', () => {
        copyToClipboard(text);
    });
    
    const resourcesButton = clone.querySelector('.additional-resources');
    resourcesButton.addEventListener('click', () => {
        showNotification('Finding additional resources...');
    });
    
    conversation.appendChild(clone);
    return conversation.lastElementChild;
}

// Add typing indicator
function addTypingIndicator() {
    const clone = document.importNode(typingIndicatorTemplate.content, true);
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

// Generate simplified version of response
function generateSimplifiedResponse(originalResponse) {
    // This would be replaced with actual simplification logic or API call
    return originalResponse.replace(/<\/?ul>|<\/?ol>|<\/?strong>/g, '')
        .replace(/<li>/g, '• ')
        .replace(/<\/li>/g, '<br>')
        .replace(/<p>/g, '<p>📌 ');
}

// Play response audio
function playResponseAudio(text) {
    // Show audio controls if hidden
    audioControls.classList.add('active');
    
    // In a real app, this would call the TTS API with the selected model
    // For demo, we'll just use a sample audio
    const modelType = ttsModelSelect.value;
    showNotification(`Processing with ${modelType} voice model...`);
    
    // Simulate loading an audio file
    setTimeout(() => {
        // Create a simple audio blob for demonstration (would be replaced with actual TTS audio)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const dest = audioContext.createMediaStreamDestination();
        oscillator.connect(dest);
        
        const mediaRecorder = new MediaRecorder(dest.stream);
        const chunks = [];
        
        mediaRecorder.ondataavailable = (evt) => {
            chunks.push(evt.data);
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            
            wavesurfer.load(url);
            currentAudio = url;
            
            showNotification('Audio ready to play');
        };
        
        // Record for 5 seconds
        mediaRecorder.start();
        oscillator.start();
        
        setTimeout(() => {
            mediaRecorder.stop();
            oscillator.stop();
        }, 5000);
    }, 1000);
}

// Initialize audio controls
function initAudioControls() {
    // Play/Pause toggle
    playPauseButton.addEventListener('click', () => {
        if (!wavesurfer) return;
        wavesurfer.playPause();
    });
    
    // Speed toggle
    speedToggle.addEventListener('click', () => {
        speedOptions.classList.toggle('hidden');
    });
    
    // Speed options
    speedOptions.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const speed = parseFloat(button.getAttribute('data-speed'));
            wavesurfer.setPlaybackRate(speed);
            speedToggle.textContent = `${speed}x`;
            
            // Update active state
            speedOptions.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            speedOptions.classList.add('hidden');
        });
    });
    
    // Volume control
    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value / 100;
        if (wavesurfer) {
            wavesurfer.setVolume(volume);
        }
    });
    
    // Download audio
    downloadAudioButton.addEventListener('click', () => {
        if (currentAudio) {
            const a = document.createElement('a');
            a.href = currentAudio;
            a.download = 'educational_response.wav';
            a.click();
            showNotification('Audio file downloaded');
        }
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    // Strip HTML tags for plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    navigator.clipboard.writeText(plainText).then(() => {
        showNotification('Response copied to clipboard');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        showNotification('Failed to copy text', 'error');
    });
}

// Toggle bookmarking a response
function toggleBookmark(text) {
    // In a real app, this would save to local storage or a database
    showNotification('Response bookmarked for later reference');
    
    // For demo purposes, add to bookmarks modal
    const bookmarksList = document.getElementById('bookmarked-responses');
    const emptyState = bookmarksList.querySelector('.empty-state');
    
    if (emptyState) {
        emptyState.remove();
    }
    
    const bookmarkItem = document.createElement('div');
    bookmarkItem.className = 'bookmark-item';
    
    const itemText = document.createElement('div');
    itemText.className = 'bookmark-item-text';
    // Create a summary from the first 50 chars
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    itemText.textContent = plainText.substring(0, 80) + '...';
    
    const itemDate = document.createElement('div');
    itemDate.className = 'bookmark-item-date';
    itemDate.textContent = new Date().toLocaleString();
    
    bookmarkItem.appendChild(itemText);
    bookmarkItem.appendChild(itemDate);
    bookmarksList.appendChild(bookmarkItem);
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

// Initialize theme toggle
function initThemeToggle() {
    // Check for system preference or saved preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        darkModeButton.classList.add('active');
        lightModeButton.classList.remove('active');
    } else {
        lightModeButton.classList.add('active');
        darkModeButton.classList.remove('active');
    }
    
    // Light mode toggle
    lightModeButton.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        lightModeButton.classList.add('active');
        darkModeButton.classList.remove('active');
        showNotification('Light mode activated');
        
        // Update wavesurfer colors if initialized
        if (wavesurfer) {
            wavesurfer.setWaveColor(getComputedStyle(document.documentElement).getPropertyValue('--color-waveform').trim());
            wavesurfer.setProgressColor(getComputedStyle(document.documentElement).getPropertyValue('--color-progress').trim());
        }
    });
    
    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        darkModeButton.classList.add('active');
        lightModeButton.classList.remove('active');
        showNotification('Dark mode activated');
        
        // Update wavesurfer colors if initialized
        if (wavesurfer) {
            wavesurfer.setWaveColor(getComputedStyle(document.documentElement).getPropertyValue('--color-waveform').trim());
            wavesurfer.setProgressColor(getComputedStyle(document.documentElement).getPropertyValue('--color-progress').trim());
        }
    });
}

// Initialize accessibility controls
function initAccessibilityControls() {
    // High contrast mode
    highContrastButton.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast-mode');
        highContrastButton.classList.toggle('active');
        
        if (document.body.classList.contains('high-contrast-mode')) {
            localStorage.setItem('high-contrast', 'enabled');
            showNotification('High contrast mode enabled');
        } else {
            localStorage.setItem('high-contrast', 'disabled');
            showNotification('High contrast mode disabled');
        }
    });
    
    // Apply saved high contrast setting
    if (localStorage.getItem('high-contrast') === 'enabled') {
        document.body.classList.add('high-contrast-mode');
        highContrastButton.classList.add('active');
    }
    
    // Text size adjustments
    textIncreaseButton.addEventListener('click', () => {
        if (fontSizePercent < 150) {
            fontSizePercent += 10;
            document.documentElement.style.fontSize = `${fontSizePercent}%`;
            localStorage.setItem('fontSize', fontSizePercent);
            showNotification(`Text size increased to ${fontSizePercent}%`);
        }
    });
    
    textDecreaseButton.addEventListener('click', () => {
        if (fontSizePercent > 80) {
            fontSizePercent -= 10;
            document.documentElement.style.fontSize = `${fontSizePercent}%`;
            localStorage.setItem('fontSize', fontSizePercent);
            showNotification(`Text size decreased to ${fontSizePercent}%`);
        }
    });
    
    // Apply saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSizePercent = parseInt(savedFontSize);
        document.documentElement.style.fontSize = `${fontSizePercent}%`;
    }
}

// Initialize view controls
function initViewControls() {
    textViewButton.addEventListener('click', () => {
        textViewButton.classList.add('active');
        audioViewButton.classList.remove('active');
        audioControls.classList.remove('active');
        localStorage.setItem('viewMode', 'text');
    });
    
    audioViewButton.addEventListener('click', () => {
        audioViewButton.classList.add('active');
        textViewButton.classList.remove('active');
        audioControls.classList.add('active');
        localStorage.setItem('viewMode', 'audio');
    });
    
    // Apply saved view mode
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'audio') {
        audioViewButton.click();
    }
}

// Initialize TTS model selector
function initTTSModelSelector() {
    ttsModelSelect.addEventListener('change', () => {
        const selectedOption = ttsModelSelect.options[ttsModelSelect.selectedIndex];
        const performance = selectedOption.getAttribute('data-performance');
        const indicatorDot = modelPerformance.querySelector('.indicator-dot');
        const indicatorText = modelPerformance.querySelector('.indicator-text');
        
        indicatorDot.setAttribute('data-performance', performance);
        
        // Style based on performance level
        if (performance === 'fast') {
            indicatorDot.style.backgroundColor = 'var(--color-success)';
        } else if (performance === 'balanced') {
            indicatorDot.style.backgroundColor = 'var(--color-info)';
        } else if (performance === 'high-quality') {
            indicatorDot.style.backgroundColor = 'var(--color-warning)';
        }
        
        // Update text
        indicatorText.textContent = performance.replace('-', ' ');
        
        // Store preference
        localStorage.setItem('ttsModel', ttsModelSelect.value);
    });
    
    // Apply saved TTS model
    const savedTTSModel = localStorage.getItem('ttsModel');
    if (savedTTSModel) {
        ttsModelSelect.value = savedTTSModel;
        // Trigger change event to update indicator
        ttsModelSelect.dispatchEvent(new Event('change'));
    }
    
    // Preview voice button
    previewVoiceButton.addEventListener('click', () => {
        const previewText = "This is a preview of the selected voice model.";
        playResponseAudio(previewText);
    });
}

// Initialize modal controls
function initModals() {
    // Show modals
    historyButton.addEventListener('click', () => {
        historyModal.classList.add('active');
    });
    
    bookmarkButton.addEventListener('click', () => {
        bookmarksModal.classList.add('active');
    });
    
    settingsButton.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Save settings
    saveSettingsButton.addEventListener('click', () => {
        // In a real app, this would save all settings
        showNotification('Settings saved successfully');
        settingsModal.classList.remove('active');
    });
    
    // Reset settings
    resetSettingsButton.addEventListener('click', () => {
        // Clear local storage
        localStorage.clear();
        showNotification('Settings reset to defaults');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Update character count
function updateCharCount() {
    const length = mainQuestionInput.value.length;
    charCount.textContent = length;
    
    // Visual feedback when approaching limit
    if (length > 400) {
        charCount.style.color = 'var(--color-warning)';
    } else if (length > 450) {
        charCount.style.color = 'var(--color-error)';
    } else {
        charCount.style.color = '';
    }
}

// Initialize query input
function initQueryInput() {
    // Character count update
    mainQuestionInput.addEventListener('input', updateCharCount);
    
    // Auto-resize textarea
    mainQuestionInput.addEventListener('input', () => {
        mainQuestionInput.style.height = 'auto';
        mainQuestionInput.style.height = mainQuestionInput.scrollHeight + 'px';
    });
    
    // Form submission
    mainForm.addEventListener('submit', handleQuestionSubmit);
    
    // Voice input
    voiceInputButton.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showNotification('Speech recognition not supported in this browser', 'error');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        
        // Add recording indicator
        voiceInputButton.classList.add('recording');
        showNotification('Listening for voice input...');
        
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
                
            mainQuestionInput.value = transcript;
            updateCharCount();
        };
        
        recognition.onend = () => {
            voiceInputButton.classList.remove('recording');
            showNotification('Voice input captured');
        };
        
        recognition.onerror = (event) => {
            voiceInputButton.classList.remove('recording');
            showNotification(`Error in voice recognition: ${event.error}`, 'error');
        };
        
        recognition.start();
    });
    
    // Sample query clicks
    queryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            mainQuestionInput.value = chip.textContent;
            updateCharCount();
            mainQuestionInput.focus();
        });
    });
    
    // Clear session
    clearSession.addEventListener('click', () => {
        // Remove all messages except welcome
        const messages = conversation.querySelectorAll('.message');
        messages.forEach(message => message.remove());
        
        // Show welcome, hide conversation header
        welcomeContainer.style.display = 'block';
        conversationHeader.style.opacity = '0';
        conversationHeader.style.transform = 'translateY(-10px)';
        
        // Reset counter
        messageCount = 0;
        queryCount.textContent = '0 queries';
        
        showNotification('Learning session cleared');
    });
}

// Initialize app
function initApp() {
    // Initialize base components
    initWaveSurfer();
    initThemeToggle();
    initAccessibilityControls();
    initViewControls();
    initTTSModelSelector();
    initAudioControls();
    initModals();
    initQueryInput();
    
    // Initially hide conversation header until first question
    conversationHeader.style.opacity = '0';
    
    // Add loading animation
    document.body.classList.add('app-loaded');
    
    console.log('AI Educational Q&A Bot initialized');
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 