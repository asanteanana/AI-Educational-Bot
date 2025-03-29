class TTSEngine {
    constructor() {
        // Initialize AWS Polly
        AWS.config.region = 'us-east-1'; // Replace with your region
        this.polly = new AWS.Polly();

        // Audio elements
        this.audioPlayer = new Audio();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();

        // UI elements
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speedControl = document.getElementById('speedControl');
        this.speedValue = document.getElementById('speedValue');
        this.playButton = document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.stopButton = document.getElementById('stopButton');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = this.progressBar.querySelector('.progress-fill');
        this.timeDisplay = document.getElementById('timeDisplay');

        // State
        this.currentText = '';
        this.isPlaying = false;
        this.currentPosition = 0;

        this.initializeControls();
        this.loadVoices();
    }

    async loadVoices() {
        try {
            const voices = await this.polly.describeVoices().promise();
            voices.Voices.forEach(voice => {
                if (voice.LanguageCode.startsWith('en')) {
                    const option = document.createElement('option');
                    option.value = voice.Id;
                    option.textContent = `${voice.Name} (${voice.Gender})`;
                    this.voiceSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error loading voices:', error);
        }
    }

    initializeControls() {
        // Speed control
        this.speedControl.addEventListener('input', () => {
            const speed = this.speedControl.value;
            this.speedValue.textContent = `${speed}x`;
            this.audioPlayer.playbackRate = speed;
        });

        // Playback controls
        this.playButton.addEventListener('click', () => this.play());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.stopButton.addEventListener('click', () => this.stop());

        // Progress bar
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            this.seekTo(position);
        });

        // Audio player events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('ended', () => this.onPlaybackEnded());

        // Listen for PDF load
        document.addEventListener('pdfLoaded', (e) => {
            this.currentText = e.detail.text;
            this.prepareAudio();
        });
    }

    async prepareAudio() {
        try {
            const params = {
                OutputFormat: 'mp3',
                Text: this.currentText,
                VoiceId: this.voiceSelect.value,
                Engine: 'neural',
                TextType: 'text'
            };

            const data = await this.polly.synthesizeSpeech(params).promise();
            const audioBlob = new Blob([data.AudioStream], { type: 'audio/mpeg' });
            this.audioPlayer.src = URL.createObjectURL(audioBlob);
            this.playButton.disabled = false;
        } catch (error) {
            console.error('Error preparing audio:', error);
            alert('Error preparing audio. Please try again.');
        }
    }

    play() {
        if (!this.isPlaying) {
            this.audioPlayer.play();
            this.isPlaying = true;
            this.playButton.style.display = 'none';
            this.pauseButton.style.display = 'inline-block';
        }
    }

    pause() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.playButton.style.display = 'inline-block';
            this.pauseButton.style.display = 'none';
        }
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        this.playButton.style.display = 'inline-block';
        this.pauseButton.style.display = 'none';
        this.updateProgress();
    }

    seekTo(position) {
        const time = position * this.audioPlayer.duration;
        this.audioPlayer.currentTime = time;
        this.updateProgress();
    }

    updateProgress() {
        if (!this.audioPlayer.duration) return;

        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressFill.style.width = `${progress}%`;

        // Update time display
        const currentTime = this.formatTime(this.audioPlayer.currentTime);
        const duration = this.formatTime(this.audioPlayer.duration);
        this.timeDisplay.textContent = `${currentTime} / ${duration}`;

        // Update text highlighting
        const textPosition = Math.floor((this.audioPlayer.currentTime / this.audioPlayer.duration) * this.currentText.length);
        if (window.pdfHandler) {
            window.pdfHandler.highlightText(textPosition);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    onPlaybackEnded() {
        this.isPlaying = false;
        this.playButton.style.display = 'inline-block';
        this.pauseButton.style.display = 'none';
    }
}

// Initialize TTS engine
const ttsEngine = new TTSEngine(); 