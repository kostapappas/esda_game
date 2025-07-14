// Retro Security Quest - Audio System
// Creates 8-bit style beeper sounds using Web Audio API

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        this.isMuted = false;
        this.backgroundMusic = null;
        this.masterVolume = 0.3;
        
        // Retro sound frequencies (in Hz)
        this.frequencies = {
            low: 220,      // A3
            medium: 440,   // A4
            high: 880,     // A5
            veryHigh: 1760 // A6
        };
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            this.isInitialized = true;
            
            // Create background music
            this.createBackgroundMusic();
            
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }
    
    // Resume audio context if suspended (required for Chrome)
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    // Create a beeper tone with specified frequency and duration
    createBeepTone(frequency, duration, volume = 0.5, waveType = 'square') {
        if (!this.isInitialized || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return oscillator;
    }
    
    // Create a melody with multiple tones
    createMelody(notes, noteDuration = 0.2, gap = 0.05) {
        if (!this.isInitialized || this.isMuted) return;
        
        let currentTime = this.audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.value = note.frequency;
            
            gainNode.gain.value = 0;
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(note.volume || 0.3, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + noteDuration - 0.01);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + noteDuration);
            
            currentTime += noteDuration + gap;
        });
    }
    
    // Background music - retro adventure theme
    createBackgroundMusic() {
        if (!this.isInitialized) return;
        
        const melody = [
            { frequency: this.frequencies.medium, volume: 0.15 },
            { frequency: this.frequencies.high, volume: 0.15 },
            { frequency: this.frequencies.medium, volume: 0.15 },
            { frequency: this.frequencies.low, volume: 0.15 },
            { frequency: this.frequencies.medium, volume: 0.15 },
            { frequency: this.frequencies.high, volume: 0.15 },
            { frequency: this.frequencies.veryHigh, volume: 0.15 },
            { frequency: this.frequencies.high, volume: 0.15 }
        ];
        
        this.backgroundMusic = () => {
            this.createMelody(melody, 0.5, 0.1);
        };
    }
    
    // Start background music loop
    startBackgroundMusic() {
        if (!this.isInitialized || this.isMuted || !this.backgroundMusic) return;
        
        this.resumeAudioContext();
        
        const playLoop = () => {
            this.backgroundMusic();
            this.backgroundMusicInterval = setTimeout(playLoop, 4000); // 4 second loop
        };
        
        playLoop();
    }
    
    // Stop background music
    stopBackgroundMusic() {
        if (this.backgroundMusicInterval) {
            clearTimeout(this.backgroundMusicInterval);
            this.backgroundMusicInterval = null;
        }
    }
    
    // Sound effects
    playCorrectSound() {
        this.resumeAudioContext();
        
        // Success melody - ascending notes
        const melody = [
            { frequency: this.frequencies.medium, volume: 0.4 },
            { frequency: this.frequencies.high, volume: 0.4 },
            { frequency: this.frequencies.veryHigh, volume: 0.4 }
        ];
        
        this.createMelody(melody, 0.2, 0.05);
    }
    
    playIncorrectSound() {
        this.resumeAudioContext();
        
        // Error melody - descending notes
        const melody = [
            { frequency: this.frequencies.high, volume: 0.4 },
            { frequency: this.frequencies.medium, volume: 0.4 },
            { frequency: this.frequencies.low, volume: 0.4 }
        ];
        
        this.createMelody(melody, 0.3, 0.05);
    }
    
    playSelectSound() {
        this.resumeAudioContext();
        
        // Short beep for selection
        this.createBeepTone(this.frequencies.medium, 0.1, 0.3);
    }
    
    playQuestionSound() {
        this.resumeAudioContext();
        
        // Question intro - two quick beeps
        this.createBeepTone(this.frequencies.high, 0.1, 0.3);
        setTimeout(() => {
            this.createBeepTone(this.frequencies.veryHigh, 0.1, 0.3);
        }, 150);
    }
    
    playTransition() {
        this.resumeAudioContext();
        
        // Transition whoosh effect
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(this.frequencies.high, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(this.frequencies.low, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playEndSound() {
        this.resumeAudioContext();
        
        // Victory fanfare
        const melody = [
            { frequency: this.frequencies.low, volume: 0.4 },
            { frequency: this.frequencies.medium, volume: 0.4 },
            { frequency: this.frequencies.high, volume: 0.4 },
            { frequency: this.frequencies.veryHigh, volume: 0.4 },
            { frequency: this.frequencies.high, volume: 0.4 },
            { frequency: this.frequencies.veryHigh, volume: 0.4 }
        ];
        
        this.createMelody(melody, 0.3, 0.1);
    }
    
    playClickSound() {
        this.resumeAudioContext();
        
        // Button click sound
        this.createBeepTone(this.frequencies.high, 0.05, 0.2);
    }
    
    playStartSound() {
        this.resumeAudioContext();
        
        // Game start fanfare
        const melody = [
            { frequency: this.frequencies.medium, volume: 0.4 },
            { frequency: this.frequencies.high, volume: 0.4 },
            { frequency: this.frequencies.medium, volume: 0.4 },
            { frequency: this.frequencies.veryHigh, volume: 0.4 }
        ];
        
        this.createMelody(melody, 0.25, 0.1);
    }
    
    // Volume control
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    // Mute/unmute
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBackgroundMusic();
        }
        return this.isMuted;
    }
    
    // Create noise effect for retro feel
    createNoise(duration = 0.1, volume = 0.1) {
        if (!this.isInitialized || this.isMuted) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * volume;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        noise.connect(filter);
        filter.connect(this.masterGain);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + duration);
    }
    
    // Create retro coin sound
    playCoinSound() {
        this.resumeAudioContext();
        
        // Coin pickup sound
        const melody = [
            { frequency: this.frequencies.medium, volume: 0.3 },
            { frequency: this.frequencies.high, volume: 0.3 },
            { frequency: this.frequencies.veryHigh, volume: 0.3 },
            { frequency: this.frequencies.high * 1.5, volume: 0.3 }
        ];
        
        this.createMelody(melody, 0.1, 0.02);
    }
    
    // Create power-up sound
    playPowerUpSound() {
        this.resumeAudioContext();
        
        // Power-up ascending scale
        const frequencies = [
            this.frequencies.low,
            this.frequencies.low * 1.2,
            this.frequencies.medium,
            this.frequencies.medium * 1.2,
            this.frequencies.high,
            this.frequencies.high * 1.2,
            this.frequencies.veryHigh
        ];
        
        const melody = frequencies.map(freq => ({
            frequency: freq,
            volume: 0.3
        }));
        
        this.createMelody(melody, 0.08, 0.02);
    }
    
    // Create retro explosion sound
    playExplosionSound() {
        this.resumeAudioContext();
        
        // Explosion effect with noise
        this.createNoise(0.3, 0.3);
        
        // Add low frequency rumble
        setTimeout(() => {
            this.createBeepTone(this.frequencies.low * 0.5, 0.5, 0.4, 'sawtooth');
        }, 50);
    }
}

// Initialize audio manager
window.AudioManager = new AudioManager();

// Add click sounds to buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click sound to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            if (window.AudioManager) {
                window.AudioManager.playClickSound();
            }
        });
    });
    
    // Add volume control
    const volumeControl = document.createElement('div');
    volumeControl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card);
        border: 2px solid var(--border);
        border-radius: 10px;
        padding: 10px;
        z-index: 1000;
        font-family: 'Press Start 2P', monospace;
        font-size: 12px;
        color: var(--foreground);
    `;
    
    volumeControl.innerHTML = `
        <div style="margin-bottom: 5px;">🔊 Volume</div>
        <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.3" 
               style="width: 100px; height: 20px;">
        <br>
        <button id="muteButton" style="margin-top: 5px; padding: 5px 10px; font-size: 10px;">
            🔇 Mute
        </button>
    `;
    
    document.body.appendChild(volumeControl);
    
    // Volume slider functionality
    const volumeSlider = document.getElementById('volumeSlider');
    const muteButton = document.getElementById('muteButton');
    
    volumeSlider.addEventListener('input', (e) => {
        if (window.AudioManager) {
            window.AudioManager.setMasterVolume(parseFloat(e.target.value));
        }
    });
    
    muteButton.addEventListener('click', () => {
        if (window.AudioManager) {
            const isMuted = window.AudioManager.toggleMute();
            muteButton.textContent = isMuted ? '🔊 Unmute' : '🔇 Mute';
        }
    });
}); 