# 🎮 Retro Security Quest

Ένα retro adventure quiz game για ασφάλεια διαδικτυακών εφαρμογών.

## 🚀 Πώς να παίξετε

### Μέθοδος 1: Με HTTP Server (Προτεινόμενη)
```bash
# Μετάβαση στον φάκελο του παιχνιδιού
cd /path/to/esdda_game

# Εκκίνηση HTTP server
python3 -m http.server 8000

# Άνοιγμα στον browser
http://127.0.0.1:8000
```

### Μέθοδος 2: Απευθείας στον Browser
Απλά ανοίξτε το αρχείο `index.html` στον browser. Το παιχνίδι θα λειτουργήσει με embedded questions data.

## 🎯 Features

- ✅ 20 ερωτήσεις ασφάλειας
- ✅ Retro 8-bit pixel art UI
- ✅ 3 screens: Start, Game, End
- ✅ Retro beeper audio
- ✅ Keyboard navigation
- ✅ Achievements system
- ✅ Share functionality

## 🎮 Controls

- **Mouse/Touch**: Κλικ για επιλογή
- **Keyboard**: 
  - `1-4`: Επιλογή απάντησης
  - `Enter`: Επιβεβαίωση
  - `Space`: Επόμενη ερώτηση

## 🔧 Αρχιτεκτονική

```
esdda_game/
├── index.html          # Κύρια σελίδα
├── style/main.css      # Retro styling
├── script/
│   ├── game.js         # Game logic
│   ├── audio.js        # Audio system
│   └── questions.json  # Questions database
└── images/
    └── treasury.png    # Scene images
```

## 🎵 Audio

Το παιχνίδι χρησιμοποιεί Web Audio API για retro beeper sounds:
- Background music loop
- Success/Error sounds
- Button clicks
- Transitions

## 🏆 Achievements

Βασισμένα στο score:
- 🏆 Security Master (90%+)
- ⚔️ Cyber Knight (80%+)
- 🛡️ Digital Guardian (70%+)
- 🎓 Security Apprentice (60%+)
- 🔰 Novice Defender (<60%)

## 📱 Responsive Design

Το παιχνίδι λειτουργεί σε:
- Desktop browsers
- Mobile devices
- Tablets

## 🔧 Troubleshooting

### CORS Errors
Αν αντιμετωπίζετε CORS errors:
1. Χρησιμοποιήστε HTTP server
2. Ή ανοίξτε απευθείας το index.html (fallback mode)

### Audio Issues
Αν δεν ακούτε ήχο:
1. Ελέγξτε το volume control (πάνω δεξιά)
2. Κάντε κλικ το mute button
3. Ανανεώστε τη σελίδα

Καλή διασκέδαση! 🎮 