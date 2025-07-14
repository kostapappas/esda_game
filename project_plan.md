# Retro Adventure Quiz Game - Project Plan

## Στόχος
Δημιουργία ενός retro adventure quiz game για ασφάλεια διαδικτυακών εφαρμογών με 20 σκηνές/ερωτήσεις.

## Βήματα Υλοποίησης

### 1. Δημιουργία JSON Database ✅ DONE
- Δημιουργήσω αρχείο `questions.json` με όλες τις ερωτήσεις
- Κάθε ερώτηση θα έχει:
  - id
  - scene_title
  - scene_description
  - image_prompt
  - question
  - options (4 επιλογές)
  - correct_answer
  - explanation

### 2. Transfer UI από Demo ✅ DONE
- Βρέθηκε demo UI στο `/demoui/retro-security-quest/`
- Θα μεταφερθεί το UI σε static HTML/CSS/JS format:
  - StartScreen: Welcome page με hero character και εισαγωγή
  - GameScreen: Κύρια σελίδα παιχνιδιού με progress bar, ερωτήσεις, options
  - EndScreen: Results page με score και επανάληψη
- Retro 8-bit pixel art αισθητική με custom color palette
- Animations και transitions για retro feel

### 3. CSS Styling ✓
- Retro 8-bit pixel art αισθητική
- Χρώματα που θυμίζουν παλιά παιχνίδια
- Pixel fonts
- Animations για transitions
- Responsive design

### 4. JavaScript Game Logic ✓
- Game state management
- Question navigation
- Score tracking
- Answer validation
- Screen transitions
- Progress tracking

### 5. Audio System ✓
- Retro beeper-style μουσική με Web Audio API
- Sound effects για:
  - Correct answer
  - Wrong answer
  - Game start
  - Game end
  - Button clicks

### 6. Images Integration ✓
- Placeholder images για κάθε σκηνή
- Lazy loading
- Fallback images

### 7. Final Testing & Polish ✓
- Τέστ όλων των features
- Performance optimization
- Bug fixes
- Final adjustments

## Αρχιτεκτονική Αρχείων
```
/
├── index.html
├── style/
│   └── main.css
├── script/
│   ├── game.js
│   ├── audio.js
│   └── questions.json
└── images/
    ├── treasury.png
    └── [scene images]
```

## Τεχνικές Προδιαγραφές
- Vanilla JavaScript (no frameworks)
- CSS Grid/Flexbox για layout
- Web Audio API για ήχο
- Local Storage για high scores
- Responsive design
- Progressive Web App features (optional)

## Status Tracking
- [ ] JSON Database
- [ ] HTML Structure
- [ ] CSS Styling
- [ ] JavaScript Logic
- [ ] Audio System
- [ ] Images Integration
- [ ] Testing & Polish 