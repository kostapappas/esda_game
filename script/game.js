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
            // Embedded questions data (Solution 2: Standalone)
            this.questions = [
                {
                    "id": 1,
                    "scene_title": "Βιβλιοθήκη Γνώσης",
                    "scene_description": "Βρίσκεσαι σε μια μεγάλη βιβλιοθήκη με έναν σοφό γέροντα που σε εισάγει στις βασικές αρχές ασφάλειας.",
                    "image_prompt": "8-bit pixel art, grand library interior filled with towering bookshelves, ένας σοφός γέροντας σοφός NPC κρατά ένα μεγάλο ανοικτό βιβλίο γνώσης ασφαλείας (το σύμβολο των Top 10 ευπαθειών), ο ήρωας στέκεται απέναντί του και ακούει προσεκτικά, ατμόσφαιρα σοβαρή και μυστηριώδης, στυλ κλασικού retro adventure παιχνιδιού.",
                    "question": "Τι είναι το OWASP Top 10;",
                    "options": [
                        "Μια λίστα με τα 10 καλύτερα εργαλεία ασφάλειας",
                        "Μια λίστα με τις 10 πιο κρίσιμες ευπάθειες ασφάλειας σε web εφαρμογές",
                        "Μια λίστα με τους 10 καλύτερους προγραμματιστές ασφάλειας",
                        "Μια λίστα με τα 10 πιο ασφαλή λειτουργικά συστήματα"
                    ],
                    "correct_answer": 1,
                    "explanation": "Το OWASP Top 10 είναι μια λίστα με τις 10 πιο κρίσιμες ευπάθειες ασφάλειας σε web εφαρμογές, που ενημερώνεται τακτικά από την κοινότητα OWASP."
                },
                {
                    "id": 2,
                    "scene_title": "Κάστρο - Ελαττωματικός Έλεγχος Πρόσβασης",
                    "scene_description": "Βρίσκεσαι μπροστά σε ένα κάστρο όπου ένας φρουρός φυλάει την κύρια είσοδο, αλλά κάποιος εισβάλλει από πλαϊνή πόρτα.",
                    "image_prompt": "8-bit pixel art, μπροστά από πύλη κάστρου με φρουρό NPC που φυλάει την κλειδωμένη είσοδο, ένας πονηρός rogue NPC γλιστρά από μια πλαϊνή ξεκλείδωτη πόρτα πίσω από τον φρουρό (συμβολίζοντας παραβίαση πρόσβασης), ο ήρωας το παρατηρεί έκπληκτος, μεσαιωνικό σκηνικό περιπέτειας σε ρετρό στυλ.",
                    "question": "Τι είναι η ευπάθεια \"Broken Access Control\";",
                    "options": [
                        "Όταν οι κωδικοί πρόσβασης είναι αδύναμοι",
                        "Όταν οι χρήστες μπορούν να αποκτήσουν πρόσβαση σε πόρους χωρίς σωστή εξουσιοδότηση",
                        "Όταν η βάση δεδομένων είναι εκτεθειμένη",
                        "Όταν η κρυπτογράφηση δεδομένων είναι ασθενής"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η ευπάθεια Broken Access Control συμβαίνει όταν οι έλεγχοι πρόσβασης δεν λειτουργούν σωστά, επιτρέποντας στους χρήστες να αποκτήσουν πρόσβαση σε πόρους ή λειτουργίες χωρίς κατάλληλη εξουσιοδότηση."
                },
                {
                    "id": 3,
                    "scene_title": "Θησαυροφυλάκιο - Κρυπτογραφικές Αποτυχίες",
                    "scene_description": "Βρίσκεσαι σε ένα θησαυροφυλάκιο όπου μια σπασμένη χρηματοκιβώτιο αφήνει τα δεδομένα εκτεθειμένα.",
                    "image_prompt": "8-bit pixel art, εσωτερικό θησαυροφυλακίου με μια μεγάλη ανοιχτή χρηματοκιβώτιο, η κλειδαριά του είναι σπασμένη και δεδομένα (χρυσά νομίσματα ή έγγραφα) ξεχειλίζουν προς τα έξω, ένας ανήσυχος NPC κρυπτογράφος στέκεται δίπλα δείχνοντας την αποτυχία (ασθενή κρυπτογράφηση), ο ήρωας κοιτάζει προβληματισμένος, retro adventure στυλ σκηνικού.",
                    "question": "Ποια από τις παρακάτω αποτελεί κρυπτογραφική αποτυχία;",
                    "options": [
                        "Χρήση AES-256 κρυπτογράφησης",
                        "Αποθήκευση κωδικών με bcrypt",
                        "Αποθήκευση ευαίσθητων δεδομένων χωρίς κρυπτογράφηση",
                        "Χρήση HTTPS για όλες τις συνδέσεις"
                    ],
                    "correct_answer": 2,
                    "explanation": "Η αποθήκευση ευαίσθητων δεδομένων χωρίς κρυπτογράφηση αποτελεί κρυπτογραφική αποτυχία, καθώς τα δεδομένα μπορούν να εκτεθούν εύκολα σε περίπτωση παραβίασης."
                },
                {
                    "id": 4,
                    "scene_title": "Πύλη Εισόδου - Αυθεντικοποίηση vs Εξουσιοδότηση",
                    "scene_description": "Στην αυλή του κάστρου, ένας φρουρός ελέγχει την ταυτότητά σου, ενώ μια δεύτερη πύλη απαιτεί ειδικά δικαιώματα.",
                    "image_prompt": "8-bit pixel art, αυλή κάστρου με κεντρική πύλη, ένας φρουρός NPC ελέγχει ένα πάπυρο-ταυτότητα του ήρωα στην είσοδο (αυθεντικοποίηση), πίσω του υπάρχει δεύτερη θύρα με πινακίδα \"Μόνο Εξουσιοδοτημένοι\" που οδηγεί σε θησαυροφυλάκιο (εξουσιοδότηση), δείχνοντας τη διαφορά μεταξύ ελέγχου ταυτότητας και δικαιωμάτων πρόσβασης, ρετρό στυλ περιπέτειας.",
                    "question": "Ποια είναι η διαφορά μεταξύ αυθεντικοποίησης και εξουσιοδότησης;",
                    "options": [
                        "Δεν υπάρχει διαφορά - είναι το ίδιο",
                        "Αυθεντικοποίηση = \"Ποιος είσαι;\", Εξουσιοδότηση = \"Τι επιτρέπεται να κάνεις;\"",
                        "Αυθεντικοποίηση είναι για admin, εξουσιοδότηση για χρήστες",
                        "Εξουσιοδότηση ελέγχει ταυτότητα, αυθεντικοποίηση ελέγχει δικαιώματα"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η αυθεντικοποίηση επαληθεύει ποιος είσαι (ταυτότητα), ενώ η εξουσιοδότηση καθορίζει τι επιτρέπεται να κάνεις (δικαιώματα πρόσβασης)."
                },
                {
                    "id": 5,
                    "scene_title": "Θησαυροφυλάκιο με Διπλή Κλειδαριά",
                    "scene_description": "Μια μαγική πόρτα με δύο κλειδαριές - μια παραδοσιακή και μια με σαρωτή αποτυπώματος.",
                    "image_prompt": "8-bit pixel art, μια μαγική πόρτα θησαυροφυλακίου με δύο κλειδαριές, η μία είναι παραδοσιακή κλειδαριά για κλειδί και η άλλη είναι ένας σαρωτής αποτυπώματος χεριού, ένας σοφός μέντορας NPC εξηγεί στον ήρωα ότι χρειάζονται και τα δύο για να ανοίξει (δύο παράγοντες αυθεντικοποίησης), τονίζοντας την πολυπαραγοντική ασφάλεια, retro adventure αισθητική.",
                    "question": "Τι είναι η πολυπαραγοντική αυθεντικοποίηση (MFA);",
                    "options": [
                        "Η χρήση πολλών κωδικών πρόσβασης",
                        "Η χρήση τουλάχιστον δύο διαφορετικών μεθόδων επαλήθευσης ταυτότητας",
                        "Η χρήση μόνο βιομετρικών δεδομένων",
                        "Η χρήση μόνο SMS κωδικών"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η πολυπαραγοντική αυθεντικοποίηση (MFA) απαιτεί τη χρήση τουλάχιστον δύο διαφορετικών μεθόδων επαλήθευσης, όπως κωδικός + SMS ή κωδικός + βιομετρικό."
                },
                {
                    "id": 6,
                    "scene_title": "Νυχτερινή Πόλη - Ασφαλής Σύνδεση",
                    "scene_description": "Σε μια νυχτερινή πόλη, βλέπεις δύο γραμμές δεδομένων - μια ασφαλή και μια εκτεθειμένη σε hackers.",
                    "image_prompt": "8-bit pixel art, νυχτερινό αστικό τοπίο με γραμμές δεδομένων να συνδέουν τον υπολογιστή του ήρωα με έναν απομακρυσμένο server-κτίριο, η μία γραμμή είναι χωρίς κρυπτογράφηση (κόκκινη, με ένα κακόβουλο hacker NPC να υποκλέπτει στη μέση), μια δεύτερη παράλληλη γραμμή είναι ασφαλής (μπλε με εικονίδιο κλειδαριάς, ο hacker μένει απ' έξω θυμωμένος), ένας φρουρός κυβερνοασφάλειας NPC δείχνει στον ήρωα το ασφαλές μονοπάτι \"HTTPS\", σκηνικό cyberpunk retro ύφους.",
                    "question": "Γιατί είναι σημαντικό να χρησιμοποιείται HTTPS αντί για HTTP;",
                    "options": [
                        "Το HTTPS είναι πιο γρήγορο από το HTTP",
                        "Το HTTPS κρυπτογραφεί τα δεδομένα κατά τη μεταφορά",
                        "Το HTTPS χρησιμοποιεί λιγότερο bandwidth",
                        "Το HTTPS είναι πιο εύκολο στην υλοποίηση"
                    ],
                    "correct_answer": 1,
                    "explanation": "Το HTTPS κρυπτογραφεί τα δεδομένα κατά τη μεταφορά μεταξύ του client και του server, προστατεύοντας από υποκλοπές και man-in-the-middle επιθέσεις."
                },
                {
                    "id": 7,
                    "scene_title": "Δικαστική Αίθουσα - Αρχές GDPR",
                    "scene_description": "Σε μια επίσημη δικαστική αίθουσα, ένας δικαστής εξηγεί τις αρχές προστασίας δεδομένων.",
                    "image_prompt": "8-bit pixel art, εσωτερικό δικαστικής αίθουσας ή συμβουλίου, ένας δικαστής NPC με τηβέννο στέκεται έδρα κρατώντας έναν μεγάλο πάπυρο με κανόνες (αρχές προστασίας δεδομένων του GDPR), δείχνει αυστηρά προς τον ήρωα που στέκεται μπροστά και ακούει με σεβασμό, ατμόσφαιρα σοβαρή που υποδηλώνει τη σημασία των νόμων, retro adventure στυλ.",
                    "question": "Ποια είναι μια από τις βασικές αρχές του GDPR;",
                    "options": [
                        "Συλλογή όσο το δυνατόν περισσότερων δεδομένων",
                        "Ελαχιστοποίηση δεδομένων - συλλογή μόνο απαραίτητων δεδομένων",
                        "Μόνιμη αποθήκευση όλων των δεδομένων",
                        "Κοινοποίηση δεδομένων σε τρίτους χωρίς συγκατάθεση"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η ελαχιστοποίηση δεδομένων είναι βασική αρχή του GDPR - πρέπει να συλλέγονται και να επεξεργάζονται μόνο τα δεδομένα που είναι απαραίτητα για τον συγκεκριμένο σκοπό."
                },
                {
                    "id": 8,
                    "scene_title": "Σχεδιαστικό Γραφείο - Privacy by Design",
                    "scene_description": "Σε ένα εργαστήριο αρχιτεκτονικής, ένας σχεδιαστής ενσωματώνει την ασφάλεια από την αρχή του έργου.",
                    "image_prompt": "8-bit pixel art, εργαστήριο αρχιτεκτονικής με σχέδια και γρανάζια διάσπαρτα, ένας αρχιτέκτονας NPC σχεδιάζει πάνω σε έναν μπλε εκτυπωμένο χάρτη μια εφαρμογή όπου εμφανίζεται ένα έμβλημα ασπίδας στο κέντρο (προστασία δεδομένων από τον σχεδιασμό), ο ήρωας παρακολουθεί συλλογισμένος, ρετρό στυλ περιπέτειας.",
                    "question": "Τι σημαίνει \"Privacy by Design\";",
                    "options": [
                        "Η προστασία δεδομένων προστίθεται στο τέλος της ανάπτυξης",
                        "Η προστασία δεδομένων ενσωματώνεται από την αρχή του σχεδιασμού",
                        "Η προστασία δεδομένων είναι προαιρετική",
                        "Η προστασία δεδομένων αφορά μόνο τη βάση δεδομένων"
                    ],
                    "correct_answer": 1,
                    "explanation": "Το Privacy by Design σημαίνει ότι η προστασία δεδομένων και η ιδιωτικότητα ενσωματώνονται στο σχεδιασμό και την ανάπτυξη του συστήματος από την αρχή, όχι ως μεταγενέστερη προσθήκη."
                },
                {
                    "id": 9,
                    "scene_title": "Δικαστήριο - Συνέπειες Μη Συμμόρφωσης",
                    "scene_description": "Σε μια δικαστική αίθουσα, ένας δικαστής κρατά ένα τεράστιο πρόστιμο για μη συμμόρφωση με το GDPR.",
                    "image_prompt": "8-bit pixel art, σκηνή σε δικαστική αίθουσα ή γραφείο ρυθμιστικής αρχής, ένας αυστηρός δικαστής ή αξιωματούχος NPC κρατά ένα τεράστιο έγγραφο προστίμου (συμβολίζει πολλά εκατομμύρια €) και δείχνει επιτιμητικά, ο ήρωας στέκεται μπροστά τρομαγμένος, υπογραμμίζοντας τις βαριές κυρώσεις για μη συμμόρφωση και την υποχρέωση αναφοράς παραβίασης, retro adventure ύφος.",
                    "question": "Ποιο είναι το μέγιστο πρόστιμο για παραβίαση GDPR;",
                    "options": [
                        "€10,000",
                        "€100,000",
                        "€1,000,000",
                        "€20,000,000 ή 4% του παγκόσμιου κύκλου εργασιών"
                    ],
                    "correct_answer": 3,
                    "explanation": "Το μέγιστο πρόστιμο για παραβίαση GDPR μπορεί να φτάσει τα €20,000,000 ή το 4% του παγκόσμιου ετήσιου κύκλου εργασιών της εταιρείας, όποιο από τα δύο είναι μεγαλύτερο."
                },
                {
                    "id": 10,
                    "scene_title": "Εργαστήριο Ελέγχων Ασφάλειας",
                    "scene_description": "Σε ένα high-tech εργαστήριο, τρεις ειδικοί δείχνουν διαφορετικές μεθόδους ελέγχου ασφάλειας.",
                    "image_prompt": "8-bit pixel art, high-tech εργαστήριο δοκιμών ασφάλειας. Τρεις διαφορετικοί NPC δοκιμαστές επιδεικνύουν μεθόδους: ένας διαβάζει προσεκτικά κώδικα σε πάπυρους (στατική ανάλυση κώδικα – SAST), άλλος δοκιμάζει ενεργά μια τερματική/υπολογιστή με εργαλεία (δυναμικός έλεγχος – DAST), και ένας φιγουρίνιος ηθικός hacker NPC προσπαθεί να διαρρήξει έναν server με εργαλεία (penetration test). Ο ήρωας στέκει στο κέντρο παρατηρώντας όλα τα είδη ελέγχων, σκηνικό ρετρό περιπέτειας.",
                    "question": "Ποια είναι η διαφορά μεταξύ SAST και DAST;",
                    "options": [
                        "SAST ελέγχει το hardware, DAST το software",
                        "SAST ελέγχει τον κώδικα στατικά, DAST ελέγχει την εφαρμογή δυναμικά",
                        "SAST είναι για mobile apps, DAST για web apps",
                        "Δεν υπάρχει διαφορά"
                    ],
                    "correct_answer": 1,
                    "explanation": "Το SAST (Static Application Security Testing) ελέγχει τον κώδικα στατικά χωρίς εκτέλεση, ενώ το DAST (Dynamic Application Security Testing) ελέγχει την εφαρμογή δυναμικά κατά την εκτέλεση."
                },
                {
                    "id": 11,
                    "scene_title": "Αίθουσα Στρατηγικής - Εκτίμηση Κινδύνων",
                    "scene_description": "Σε μια αίθουσα στρατηγικής, ένας αναλυτής δείχνει χάρτες κινδύνων και πώς να τους αξιολογήσεις.",
                    "image_prompt": "8-bit pixel art, δωμάτιο στρατηγικής με χάρτες και διαγράμματα κινδύνων στους τοίχους. Ένας αναλυτής κινδύνων NPC δείχνει σε έναν χάρτη που μαρκάρει σημαντικά assets και εικονίδια απειλών, συζητά την πιθανότητα και την επίπτωση με τον ήρωα πάνω από ένα τραπέζι γεμάτο έγγραφα. Η προτεραιοποίηση των κινδύνων φαίνεται από τις σημειώσεις. Retro στυλ σκηνικού περιπέτειας.",
                    "question": "Πώς υπολογίζεται ο κίνδυνος (risk) σε μια εκτίμηση κινδύνων;",
                    "options": [
                        "Κίνδυνος = Απειλή + Ευπάθεια",
                        "Κίνδυνος = Πιθανότητα × Επίπτωση",
                        "Κίνδυνος = Κόστος - Όφελος",
                        "Κίνδυνος = Χρόνος × Πολυπλοκότητα"
                    ],
                    "correct_answer": 1,
                    "explanation": "Ο κίνδυνος υπολογίζεται ως το γινόμενο της πιθανότητας να συμβεί ένα γεγονός επί την επίπτωση (impact) που θα έχει αυτό το γεγονός."
                },
                {
                    "id": 12,
                    "scene_title": "Μάχη στο Κάστρο - Εστίαση σε Μεγάλους Κινδύνους",
                    "scene_description": "Σε μια επική μάχη, ένας δράκος απειλεί το κάστρο ενώ μικρά goblins τριγυρνούν. Που πρέπει να εστιάσεις;",
                    "image_prompt": "8-bit pixel art, επικά τείχη κάστρου δέχονται επίθεση. Ένας τεράστιος δράκος (μεγάλη απειλή) πλησιάζει επιθετικά τα τείχη ενώ λίγα μικρά goblins (μικρότερα ζητήματα) τριγυρνούν κάτω. Ένας αρχηγός φρουράς (captain) NPC φωνάζει και δείχνει στον ήρωα να επικεντρωθεί πρώτα στον δράκο (υψηλού κινδύνου ευπάθεια) αφήνοντας τα goblins για μετά. Επικό φανταστικό σκηνικό σε ρετρό pixel art στυλ.",
                    "question": "Ποια είναι η σωστή προσέγγιση στη διαχείριση κινδύνων;",
                    "options": [
                        "Αντιμετώπιση όλων των κινδύνων ταυτόχρονα",
                        "Εστίαση στους χαμηλούς κινδύνους πρώτα",
                        "Προτεραιοποίηση και αντιμετώπιση των υψηλών κινδύνων πρώτα",
                        "Αγνόηση των μικρών κινδύνων"
                    ],
                    "correct_answer": 2,
                    "explanation": "Η σωστή προσέγγιση είναι η προτεραιοποίηση των κινδύνων με βάση τη βαθμολογία τους και η αντιμετώπιση των υψηλών κινδύνων πρώτα, καθώς έχουν τη μεγαλύτερη επίπτωση."
                },
                {
                    "id": 13,
                    "scene_title": "Αιωρούμενα Νησιά - Επιλογές Φιλοξενίας",
                    "scene_description": "Σε έναν ουρανό με αιωρούμενα νησιά, βλέπεις τρεις επιλογές hosting για την εφαρμογή σου.",
                    "image_prompt": "8-bit pixel art, σκηνικό ουρανού με τρία αιωρούμενα νησιά που αντιπροσωπεύουν επιλογές hosting. Το ένα νησί έχει ένα οχυρό-κάστρο (ιδιόκτητο data center on-premises), το δεύτερο έχει ένα κυβερνητικό κτίριο πάνω σε σύννεφο (κυβερνητικό cloud), και το τρίτο ένα μοντέρνο τεχνολογικό πόλη-νησί στα σύννεφα (πιστοποιημένο δημόσιο cloud). Ένας οδηγός/σύμβουλος NPC στέκεται δίπλα στον ήρωα σε μια ιπτάμενη πλατφόρμα, δείχνοντας προς κάθε επιλογή και εξηγώντας, retro φανταστικό στυλ.",
                    "question": "Ποιο είναι πλεονέκτημα του cloud hosting έναντι του on-premises;",
                    "options": [
                        "Πάντα φθηνότερο",
                        "Καλύτερη ασφάλεια πάντα",
                        "Μεγαλύτερη ελαστικότητα και δυνατότητα κλιμάκωσης",
                        "Δεν υπάρχουν πλεονεκτήματα"
                    ],
                    "correct_answer": 2,
                    "explanation": "Το cloud hosting προσφέρει μεγαλύτερη ελαστικότητα και δυνατότητα κλιμάκωσης, επιτρέποντας την εύκολη αύξηση ή μείωση πόρων ανάλογα με τις ανάγκες."
                },
                {
                    "id": 14,
                    "scene_title": "Εργοστάσιο Λογισμικού - Αυτοματισμοί CI/CD",
                    "scene_description": "Σε ένα αυτοματοποιημένο εργοστάσιο, βλέπεις πώς ο κώδικας μεταφέρεται αυτόματα μέσω σταθμών δοκιμής.",
                    "image_prompt": "8-bit pixel art, εσωτερικό ενός αυτοματοποιημένου εργοστασίου λογισμικού. Ένας κινούμενος μεταφορικός ιμάντας μεταφέρει κουτιά κώδικα μέσα από σταθμούς δοκιμής και ανάπτυξης με ρομποτικούς βραχίονες να δουλεύουν πάνω τους. Ένας μηχανικός NPC παρακολουθεί τις διαδικασίες και εξηγεί στον ήρωα πώς λειτουργεί η γραμμή CI/CD που μειώνει τα ανθρώπινα λάθη. Όλα λειτουργούν ρολόι σε ρετρό βιομηχανικό pixel art περιβάλλον.",
                    "question": "Τι σημαίνει CI/CD;",
                    "options": [
                        "Computer Intelligence / Computer Development",
                        "Continuous Integration / Continuous Deployment",
                        "Code Inspection / Code Distribution",
                        "Central Intelligence / Central Database"
                    ],
                    "correct_answer": 1,
                    "explanation": "CI/CD σημαίνει Continuous Integration (Συνεχής Ενσωμάτωση) και Continuous Deployment (Συνεχής Ανάπτυξη), διαδικασίες που αυτοματοποιούν την ενσωμάτωση και ανάπτυξη κώδικα."
                },
                {
                    "id": 15,
                    "scene_title": "Αγώνας Ταχύτητας - Βελτιστοποίηση Επιδόσεων",
                    "scene_description": "Σε μια ψηφιακή πίστα, ένας γρήγορος server συναγωνίζεται με έναν αργό υπολογιστή.",
                    "image_prompt": "8-bit pixel art, ψηφιακή πίστα αγώνων ταχύτητας. Στη μία λωρίδα τρέχει ένας κομψός server-χαρακτήρας με ταχύτητα (βελτιστοποιημένη εφαρμογή), στην άλλη λωρίδα ένας αργός παλιός υπολογιστής-χαρακτήρας μένει πίσω με ιδρώτα. Θεατές NPC (πολίτες) ζητωκραυγάζουν τον γρήγορο και δυσανασχετούν με τον αργό. Ένας προπονητής NPC στέκεται με τον ήρωα στην άκρη της πίστας εξηγώντας πόσο σημαντική είναι η ταχύτητα για την επιτυχία. Retro arcade στυλ σκηνικού.",
                    "question": "Ποιο από τα παρακάτω βελτιώνει την επίδοση μιας web εφαρμογής;",
                    "options": [
                        "Αύξηση του μεγέθους των εικόνων",
                        "Προσθήκη περισσότερων JavaScript libraries",
                        "Χρήση caching και βελτιστοποίηση βάσης δεδομένων",
                        "Αύξηση του αριθμού των HTTP requests"
                    ],
                    "correct_answer": 2,
                    "explanation": "Η χρήση caching και η βελτιστοποίηση της βάσης δεδομένων μειώνουν τον χρόνο απόκρισης και βελτιώνουν σημαντικά την επίδοση της εφαρμογής."
                },
                {
                    "id": 16,
                    "scene_title": "Βιβλιοθήκη Αρχείων - Τεκμηρίωση",
                    "scene_description": "Σε μια παλιά βιβλιοθήκη, ένας αρχειοφύλακας δείχνει τη σημασία της καλής τεκμηρίωσης.",
                    "image_prompt": "8-bit pixel art, σκονισμένο αρχείο/βιβλιοθήκη με ράφια γεμάτα φακέλους και εγχειρίδια. Ένας σοφός αρχειοφύλακας NPC δείχνει στον ήρωα ένα καλά οργανωμένο ράφι με την ένδειξη \"Τεκμηρίωση Συστήματος\". Σε μια γωνία φαίνεται μια παλιά υπολογιστική μηχανή που ακόμα λειτουργεί χάρη στα διατηρημένα εγχειρίδια. Η σκηνή τονίζει τη συνέχεια και ασφάλεια που παρέχει η πλήρης τεκμηρίωση, σε ρετρό pixel art ύφος.",
                    "question": "Γιατί είναι σημαντική η τεκμηρίωση στην ανάπτυξη λογισμικού;",
                    "options": [
                        "Μόνο για νομικούς λόγους",
                        "Για συντήρηση, κατανόηση και συνέχεια του έργου",
                        "Για να φαίνεται πιο επαγγελματικό",
                        "Δεν είναι σημαντική"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η τεκμηρίωση είναι κρίσιμη για τη συντήρηση, κατανόηση και συνέχεια του έργου, ειδικά όταν αλλάζουν οι developers ή όταν χρειάζεται να γίνουν αλλαγές στο μέλλον."
                },
                {
                    "id": 17,
                    "scene_title": "Εργαστήριο Συντήρησης - Προγραμματισμός",
                    "scene_description": "Σε ένα συνεργείο, ένας μηχανικός εξηγεί τη σημασία της προγραμματισμένης συντήρησης.",
                    "image_prompt": "8-bit pixel art, συνεργείο συντήρησης με μηχανήματα. Ένας μηχανικός NPC στέκει δίπλα σε μια μηχανή (που συμβολίζει την εφαρμογή) και σε έναν πίνακα ανακοινώσεων/ημερολόγιο με σημειωμένες προγραμματισμένες ημερομηνίες συντήρησης. Κοντά υπάρχει ένα αναμμένο κόκκινο λαμπάκι ή σπασμένο γρανάζι που υποδηλώνει έκτακτη βλάβη. Ο ήρωας στέκεται δίπλα του παρακολουθώντας, κατανοώντας τη σημασία του τακτικού προγραμματισμού αλλά και της ετοιμότητας για απρόβλεπτες επισκευές. Retro στυλ σκηνικού.",
                    "question": "Γιατί είναι σημαντική η προγραμματισμένη συντήρηση συστημάτων;",
                    "options": [
                        "Για να αυξήσει το κόστος λειτουργίας",
                        "Για πρόληψη προβλημάτων και διατήρηση της ασφάλειας",
                        "Για να κάνει τα συστήματα πιο αργά",
                        "Δεν είναι σημαντική"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η προγραμματισμένη συντήρηση είναι κρίσιμη για την πρόληψη προβλημάτων, τη διατήρηση της ασφάλειας, την εφαρμογή ενημερώσεων και τη βελτιστοποίηση της απόδοσης."
                },
                {
                    "id": 18,
                    "scene_title": "Κέντρο Ελέγχου - Διαχείριση Αλλαγών",
                    "scene_description": "Σε μια αίθουσα ελέγχου, ένας μηχανικός δοκιμάζει αλλαγές σε test περιβάλλον πριν το production.",
                    "image_prompt": "8-bit pixel art, αίθουσα ελέγχου τεχνολογίας. Ένας μηχανικός NPC σε κονσόλα είναι έτοιμος να εφαρμόσει μια αλλαγή λογισμικού, πρώτα όμως τη δοκιμάζει σε έναν ξεχωριστό δοκιμαστικό server που είναι πιστό αντίγραφο του παραγωγικού (υπάρχει πινακίδα \"Test Environment\"), ενώ μια ασφαλισμένη πόρτα με την ένδειξη \"Production\" βρίσκεται πιο πέρα. Δίπλα, ένας άλλος NPC καταγράφει αλλαγές σε ένα μεγάλο βιβλίο (αρχείο αλλαγών). Ο ήρωας παρατηρεί προσεκτικά αυτήν τη μεθοδική διαδικασία, που υπογραμμίζει την ασφαλή διαχείριση αλλαγών, σε ρετρό στυλ.",
                    "question": "Ποια είναι η σωστή διαδικασία για αλλαγές σε production περιβάλλον;",
                    "options": [
                        "Άμεση εφαρμογή αλλαγών στο production",
                        "Δοκιμή σε test περιβάλλον, έγκριση και καταγραφή πριν το production",
                        "Εφαρμογή αλλαγών τα Σαββατοκύριακα χωρίς δοκιμή",
                        "Δοκιμή μόνο στο production"
                    ],
                    "correct_answer": 1,
                    "explanation": "Η σωστή διαδικασία περιλαμβάνει δοκιμή σε test περιβάλλον, έγκριση από τους υπευθύνους, καταγραφή της αλλαγής και μετά εφαρμογή στο production."
                },
                {
                    "id": 19,
                    "scene_title": "Αίθουσα Συσκέψεων - Προϋποθέσεις Έργου",
                    "scene_description": "Σε μια αίθουσα συσκέψεων, διάφοροι stakeholders συζητούν τις απαιτήσεις ασφάλειας του έργου.",
                    "image_prompt": "8-bit pixel art, αίθουσα συσκέψεων με ένα μεγάλο στρογγυλό τραπέζι. Ένας διευθυντής έργου NPC στέκεται όρθιος με μια λίστα που τιτλοφορείται \"Απαιτήσεις Ασφαλείας\" πάνω στο τραπέζι. Γύρω κάθονται διάφοροι συμμετέχοντες NPC – ένας προγραμματιστής, ένας υπεύθυνος ασφαλείας, ένας εκπρόσωπος δημοσίου φορέα, ακόμα και ένας πολίτης-χρήστης – όλοι συμμετέχουν στη συζήτηση. Ο ήρωας (ως αναλυτής ασφαλείας) βρίσκεται κι αυτός στο τραπέζι, διασφαλίζοντας ότι οι απαιτήσεις είναι σαφείς και όλοι οι ενδιαφερόμενοι συνεργάζονται. Σκηνικό ρετρό adventure ύφους που δείχνει ομαδική εργασία.",
                    "question": "Πότε πρέπει να καθοριστούν οι απαιτήσεις ασφαλείας ενός έργου;",
                    "options": [
                        "Στο τέλος της ανάπτυξης",
                        "Κατά τη διάρκεια των tests",
                        "Στην αρχή του έργου, κατά τη φάση σχεδιασμού",
                        "Μετά την παράδοση"
                    ],
                    "correct_answer": 2,
                    "explanation": "Οι απαιτήσεις ασφαλείας πρέπει να καθοριστούν στην αρχή του έργου, κατά τη φάση σχεδιασμού, ώστε να ενσωματωθούν σωστά στην αρχιτεκτονική και την ανάπτυξη."
                },
                {
                    "id": 20,
                    "scene_title": "Ασφαλής Πόλη - Εμπιστοσύνη Πολιτών",
                    "scene_description": "Στη φωτεινή πόλη του μέλλοντος, οι πολίτες χρησιμοποιούν με εμπιστοσύνη τις ασφαλείς ψηφιακές υπηρεσίες.",
                    "image_prompt": "8-bit pixel art, μια φωτεινή ψηφιακή πόλη του μέλλοντος. Ένας διάφανος θόλος-ασπίδα με εικονίδιο κλειδαριάς προστατεύει την πόλη, συμβολίζοντας την ασφάλεια. Πολίτες-χαρούμενοι NPCs κινούνται στην πόλη χρησιμοποιώντας υπολογιστές και ψηφιακές υπηρεσίες με χαμόγελο εμπιστοσύνης. Ο ήρωας στέκεται δίπλα σε έναν επίσημο εκπρόσωπο NPC της κυβέρνησης στην άκρη, και κοιτάζουν περήφανοι το αποτέλεσμα – αξιόπιστες, ασφαλείς ψηφιακές υπηρεσίες που εμπνέουν εμπιστοσύνη στους πολίτες. Τελική σκηνή με θριαμβευτικό, ρετρό pixel art ύφος.",
                    "question": "Ποιο είναι το τελικό αποτέλεσμα της εφαρμογής καλών πρακτικών ασφάλειας;",
                    "options": [
                        "Αύξηση του κόστους ανάπτυξης",
                        "Μείωση της λειτουργικότητας",
                        "Οικοδόμηση εμπιστοσύνης και ασφαλών ψηφιακών υπηρεσιών",
                        "Πολυπλοκότητα στη χρήση"
                    ],
                    "correct_answer": 2,
                    "explanation": "Η εφαρμογή καλών πρακτικών ασφάλειας οδηγεί στην οικοδόμηση εμπιστοσύνης από τους χρήστες και στη δημιουργία ασφαλών, αξιόπιστων ψηφιακών υπηρεσιών που εξυπηρετούν την κοινωνία."
                }
            ];
            
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
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        // Show selected screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        } else {
            console.error('Screen not found:', screenName);
        }
        
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
        
        // Set scene image based on question ID
        const imageFilename = `scene_${question.id.toString().padStart(2, '0')}.png`;
        this.sceneImage.src = `images/${imageFilename}`;
        this.sceneImage.alt = question.scene_title;
        
        // Display question
        this.questionText.textContent = question.question;
        
        // Display options
        this.displayOptions(question.options);
        
        // Reset UI state
        this.selectedAnswer = null;
        this.submitButton.disabled = true;
        this.submitButton.style.display = 'block';
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
        if (this.finalScore) this.finalScore.textContent = this.score;
        if (this.finalTotal) this.finalTotal.textContent = this.questions.length;
        if (this.scorePercentage) this.scorePercentage.textContent = `${percentage}%`;
        
        // Update level and icon
        if (this.scoreLevel) this.scoreLevel.textContent = level.title;
        if (this.scoreIcon) this.scoreIcon.textContent = level.icon;
        
        // Update encouragement message
        if (this.encouragementMessage) this.encouragementMessage.textContent = this.getEncouragementMessage(percentage);
        
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