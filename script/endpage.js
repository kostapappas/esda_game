// script/endpage.js

document.addEventListener('DOMContentLoaded', () => {
    const totalQuestions = 20; // The total number of questions in the game

    // DOM elements
    const scoreIcon = document.getElementById('scoreIcon');
    const scoreLevel = document.getElementById('scoreLevel');
    const finalScoreEl = document.getElementById('finalScore');
    const finalTotalEl = document.getElementById('finalTotal');
    const scorePercentageEl = document.getElementById('scorePercentage');
    const encouragementMessageEl = document.getElementById('encouragementMessage');
    const achievementsGrid = document.getElementById('achievementsGrid');
    const shareScoreButton = document.getElementById('shareScoreButton');

    // Get score from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const score = parseInt(urlParams.get('score') || '0');

    const displayFinalResults = () => {
        const percentage = Math.round((score / totalQuestions) * 100);
        const level = getScoreLevel(percentage);

        // Update score display
        finalScoreEl.textContent = score;
        finalTotalEl.textContent = totalQuestions;
        scorePercentageEl.textContent = `${percentage}%`;
        
        // Update level and icon
        scoreLevel.textContent = level.title;
        scoreIcon.textContent = level.icon;
        
        // Update encouragement message
        encouragementMessageEl.textContent = getEncouragementMessage(percentage);
        
        // Generate achievements
        generateAchievements(percentage, score);
    };

    const getScoreLevel = (percentage) => {
        if (percentage >= 90) return { title: "Security Master", icon: "🏆" };
        if (percentage >= 80) return { title: "Cyber Knight", icon: "⚔️" };
        if (percentage >= 70) return { title: "Digital Guardian", icon: "🛡️" };
        if (percentage >= 60) return { title: "Security Apprentice", icon: "🎓" };
        return { title: "Novice Defender", icon: "🔰" };
    };

    const getEncouragementMessage = (percentage) => {
        if (percentage >= 90) return "Εξαιρετικά! Είσαι πραγματικός ειδικός κυβερνοασφάλειας! 🏆";
        if (percentage >= 80) return "Πολύ καλή δουλειά! Έχεις ισχυρές γνώσεις ασφάλειας! ⚔️";
        if (percentage >= 70) return "Καλή δουλειά! Είσαι στο σωστό δρόμο για τη μαεστρία! 🛡️";
        if (percentage >= 60) return "Όχι άσχημα! Συνέχισε να μαθαίνεις για να βελτιώσεις! 📚";
        return "Συνέχισε να εξασκείσαι! Κάθε ειδικός ήταν κάποτε αρχάριος! 💪";
    };
    
    const generateAchievements = (percentage, score) => {
        const achievements = [];
        if (percentage >= 80) achievements.push({ icon: "🎓", name: "OWASP Expert" });
        if (percentage >= 70) achievements.push({ icon: "🔒", name: "Privacy Champion" });
        if (score >= 15) achievements.push({ icon: "⚡", name: "Speed Runner" });
        if (percentage === 100) achievements.push({ icon: "💎", name: "Perfect Score" });
        if (achievements.length === 0) achievements.push({ icon: "🌟", name: "Participant" });

        achievementsGrid.innerHTML = '';
        achievements.forEach(ach => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `<div class="achievement-icon">${ach.icon}</div><div class="achievement-name">${ach.name}</div>`;
            achievementsGrid.appendChild(badge);
        });
    };

    const shareScore = () => {
        const percentage = Math.round((score / totalQuestions) * 100);
        const level = getScoreLevel(percentage);
        const shareText = `Μόλις ολοκλήρωσα το Retro Security Quest! 🎮\n\nΣκορ: ${score}/${totalQuestions} (${percentage}%)\nΕπίπεδο: ${level.title} ${level.icon}\n\nΠαίξε και εσύ: ${window.location.origin}`;

        if (navigator.share) {
            navigator.share({ title: 'Retro Security Quest', text: shareText, url: window.location.origin });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Το σκορ αντιγράφηκε στο clipboard!');
            });
        }
    };

    // Event Listeners
    shareScoreButton.addEventListener('click', shareScore);

    // Initial call to display results
    displayFinalResults();
}); 