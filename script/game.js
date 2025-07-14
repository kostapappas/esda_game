// Retro Security Quest - Game Logic
class SecurityQuest {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questions = [];
        this.selectedAnswer = null;
        this.gameState = 'start'; // 'start', 'playing', 'end'
        
        this.init();
    }
    
    async init() {
        try {
            // Load questions
            await this.loadQuestions();
            
            // Initialize DOM elements
            this.initializeElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize audio
            if (window.AudioManager) {
                window.AudioManager.init();
            }
            
            // Show start screen
            this.showScreen('start');
            
        } catch (error) {
            console.error('Error initializing game:', error);
            this.showError('Σφάλμα φόρτωσης παιχνιδιού');
        }
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('script/questions.json');
            const data = await response.json();
            this.questions = data.questions;
            
            // Shuffle questions for variety
            this.shuffleArray(this.questions);
            
        } catch (error) {
            console.error('Error loading questions:', error);
            throw new Error('Failed to load questions');
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    initializeElements() {
        // Screen elements
        this.screens = {
            start: document.getElementById('startScreen'),
            game: document.getElementById('gameScreen'),
            end: document.getElementById('endScreen'),
            loading: document.getElementById('loadingScreen')
        };
        
        // Start screen elements
        this.startButton = document.getElementById('startButton');
        
        // Game screen elements
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        this.currentScoreSpan = document.getElementById('currentScore');
        this.progressFill = document.getElementById('progressFill');
        this.sceneTitle = document.getElementById('sceneTitle');
        this.sceneLocation = document.getElementById('sceneLocation');
        this.sceneImage = document.getElementById('sceneImage');
        this.npcName = document.getElementById('npcName');
        this.npcDescription = document.getElementById('npcDescription');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.submitButton = document.getElementById('submitAnswer');
        this.nextButton = document.getElementById('nextQuestion');
        this.feedbackContainer = document.getElementById('feedbackContainer');
        this.feedbackResult = document.getElementById('feedbackResult');
        this.feedbackExplanation = document.getElementById('feedbackExplanation');
        
        // End screen elements
        this.scoreIcon = document.getElementById('scoreIcon');
        this.scoreLevel = document.getElementById('scoreLevel');
        this.finalScore = document.getElementById('finalScore');
        this.finalTotal = document.getElementById('finalTotal');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.encouragementMessage = document.getElementById('encouragementMessage');
        this.achievementsGrid = document.getElementById('achievementsGrid');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.shareScoreButton = document.getElementById('shareScoreButton');
        
        // Set total questions
        this.totalQuestionsSpan.textContent = this.questions.length;
    }
    
    setupEventListeners() {
        // Start button
        this.startButton.addEventListener('click', () => this.startGame());
        
        // Submit answer button
        this.submitButton.addEventListener('click', () => this.submitAnswer());
        
        // Next question button
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Play again button
        this.playAgainButton.addEventListener('click', () => this.restartGame());
        
        // Share score button
        this.shareScoreButton.addEventListener('click', () => this.shareScore());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleKeyboard(event) {
        if (this.gameState !== 'playing') return;
        
        // Number keys 1-4 for answers
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const optionButton = this.optionsContainer.children[optionIndex];
            if (optionButton) {
                this.selectOption(optionIndex);
            }
        }
        
        // Enter to submit answer
        if (event.key === 'Enter' && !this.submitButton.disabled) {
            this.submitAnswer();
        }
        
        // Space or Enter to go to next question
        if ((event.key === ' ' || event.key === 'Enter') && this.nextButton.style.display !== 'none') {
            event.preventDefault();
            this.nextQuestion();
        }
    }
    
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        this.screens[screenName].classList.add('active');
        
        // Update game state
        this.gameState = screenName === 'game' ? 'playing' : screenName;
        
        // Play screen transition sound
        if (window.AudioManager) {
            window.AudioManager.playTransition();
        }
    }
    
    startGame() {
        this.showScreen('loading');
        
        // Reset game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.selectedAnswer = null;
        
        // Start background music
        if (window.AudioManager) {
            window.AudioManager.startBackgroundMusic();
        }
        
        // Show first question after loading
        setTimeout(() => {
            this.showScreen('game');
            this.displayQuestion();
        }, 1500);
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update progress
        this.updateProgress();
        
        // Update scene information
        this.sceneTitle.textContent = question.scene_title;
        this.sceneLocation.textContent = `📍 ${question.scene_description}`;
        this.npcName.textContent = question.scene_title;
        this.npcDescription.textContent = question.scene_description;
        
        // Set scene image (placeholder for now)
        this.sceneImage.src = 'images/treasury.png';
        this.sceneImage.alt = question.scene_title;
        
        // Display question
        this.questionText.textContent = question.question;
        
        // Display options
        this.displayOptions(question.options);
        
        // Reset UI state
        this.selectedAnswer = null;
        this.submitButton.disabled = true;
        this.nextButton.style.display = 'none';
        this.feedbackContainer.style.display = 'none';
        
        // Play question sound
        if (window.AudioManager) {
            window.AudioManager.playQuestionSound();
        }
    }
    
    displayOptions(options) {
        this.optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.setAttribute('data-option', index);
            
            const letter = document.createElement('span');
            letter.className = 'option-letter';
            letter.textContent = String.fromCharCode(65 + index); // A, B, C, D
            
            const text = document.createElement('span');
            text.className = 'option-text';
            text.textContent = option;
            
            button.appendChild(letter);
            button.appendChild(text);
            
            button.addEventListener('click', () => this.selectOption(index));
            
            this.optionsContainer.appendChild(button);
        });
    }
    
    selectOption(optionIndex) {
        if (this.feedbackContainer.style.display === 'block') return;
        
        // Remove previous selection
        this.optionsContainer.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedButton = this.optionsContainer.children[optionIndex];
        selectedButton.classList.add('selected');
        
        this.selectedAnswer = optionIndex;
        this.submitButton.disabled = false;
        
        // Play selection sound
        if (window.AudioManager) {
            window.AudioManager.playSelectSound();
        }
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct_answer;
        
        // Store answer
        this.userAnswers.push(isCorrect);
        
        // Update score
        if (isCorrect) {
            this.score++;
            this.updateScore();
        }
        
        // Show feedback
        this.showFeedback(isCorrect, question);
        
        // Update UI
        this.submitButton.style.display = 'none';
        this.nextButton.style.display = 'block';
        
        // Play feedback sound
        if (window.AudioManager) {
            if (isCorrect) {
                window.AudioManager.playCorrectSound();
            } else {
                window.AudioManager.playIncorrectSound();
            }
        }
    }
    
    showFeedback(isCorrect, question) {
        // Update option buttons
        this.optionsContainer.querySelectorAll('.option-button').forEach((btn, index) => {
            btn.disabled = true;
            
            if (index === question.correct_answer) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Show feedback container
        this.feedbackContainer.style.display = 'block';
        
        // Update feedback content
        this.feedbackResult.textContent = isCorrect ? '✅ Σωστή Απάντηση!' : '❌ Λάθος Απάντηση';
        this.feedbackResult.className = `feedback-result ${isCorrect ? 'correct' : 'incorrect'}`;
        this.feedbackExplanation.textContent = question.explanation;
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.endGame();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
    }
    
    updateScore() {
        this.currentScoreSpan.textContent = this.score;
    }
    
    endGame() {
        this.showScreen('end');
        this.displayFinalResults();
        
        // Stop background music
        if (window.AudioManager) {
            window.AudioManager.stopBackgroundMusic();
            window.AudioManager.playEndSound();
        }
    }
    
    displayFinalResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const level = this.getScoreLevel(percentage);
        
        // Update score display
        this.finalScore.textContent = this.score;
        this.finalTotal.textContent = this.questions.length;
        this.scorePercentage.textContent = `${percentage}%`;
        
        // Update level and icon
        this.scoreLevel.textContent = level.title;
        this.scoreIcon.textContent = level.icon;
        
        // Update encouragement message
        this.encouragementMessage.textContent = this.getEncouragementMessage(percentage);
        
        // Generate achievements
        this.generateAchievements(percentage);
        
        // Save high score
        this.saveHighScore();
    }
    
    getScoreLevel(percentage) {
        if (percentage >= 90) return { title: "Security Master", icon: "🏆" };
        if (percentage >= 80) return { title: "Cyber Knight", icon: "⚔️" };
        if (percentage >= 70) return { title: "Digital Guardian", icon: "🛡️" };
        if (percentage >= 60) return { title: "Security Apprentice", icon: "🎓" };
        return { title: "Novice Defender", icon: "🔰" };
    }
    
    getEncouragementMessage(percentage) {
        if (percentage >= 90) return "Εξαιρετικά! Είσαι πραγματικός ειδικός κυβερνοασφάλειας! 🏆";
        if (percentage >= 80) return "Πολύ καλή δουλειά! Έχεις ισχυρές γνώσεις ασφάλειας! ⚔️";
        if (percentage >= 70) return "Καλή δουλειά! Είσαι στο σωστό δρόμο για τη μαεστρία! 🛡️";
        if (percentage >= 60) return "Όχι άσχημα! Συνέχισε να μαθαίνεις για να βελτιώσεις! 📚";
        return "Συνέχισε να εξασκείσαι! Κάθε ειδικός ήταν κάποτε αρχάριος! 💪";
    }
    
    generateAchievements(percentage) {
        const achievements = [];
        
        if (percentage >= 80) {
            achievements.push({ icon: "🎓", name: "OWASP Expert" });
        }
        
        if (percentage >= 70) {
            achievements.push({ icon: "🔒", name: "Privacy Champion" });
        }
        
        if (this.score >= 15) {
            achievements.push({ icon: "⚡", name: "Speed Runner" });
        }
        
        if (percentage === 100) {
            achievements.push({ icon: "💎", name: "Perfect Score" });
        }
        
        if (achievements.length === 0) {
            achievements.push({ icon: "🌟", name: "Participant" });
        }
        
        // Update achievements display
        this.achievementsGrid.innerHTML = '';
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            `;
            this.achievementsGrid.appendChild(badge);
        });
    }
    
    saveHighScore() {
        const highScore = localStorage.getItem('securityQuestHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('securityQuestHighScore', this.score);
        }
    }
    
    restartGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.selectedAnswer = null;
        
        // Shuffle questions again
        this.shuffleArray(this.questions);
        
        // Reset UI
        this.currentScoreSpan.textContent = '0';
        this.progressFill.style.width = '0%';
        
        // Start new game
        this.startGame();
    }
    
    shareScore() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const level = this.getScoreLevel(percentage);
        
        const shareText = `Μόλις ολοκλήρωσα το Retro Security Quest! 🎮\n\nΣκορ: ${this.score}/${this.questions.length} (${percentage}%)\nΕπίπεδο: ${level.title} ${level.icon}\n\nΠαίξε και εσύ: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Retro Security Quest',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Το σκορ αντιγράφηκε στο clipboard!');
            });
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--destructive);
            color: var(--destructive-foreground);
            padding: 20px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            z-index: 1000;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SecurityQuest();
}); 