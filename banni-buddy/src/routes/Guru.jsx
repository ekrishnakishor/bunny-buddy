import { useState, useRef } from 'react';
import { Mic, MicOff, Languages, Info, Volume2, ArrowRightLeft } from 'lucide-react';
import styles from './Guru.module.css';

// A starter dictionary for Bengaluru survival phrases (Kanglish)
const KANGLISH_DICTIONARY = {
  "how much": "Yestu?",
  "where is the bus stop": "Bus stop elli ide?",
  "go straight": "Nera hogi",
  "take left": "Left tegolli",
  "take right": "Right tegolli",
  "i don't know kannada": "Nanage Kannada gottilla",
  "do you know english": "Nimage English gottidya?",
  "come here": "Illi banni",
  "what is your name": "Nimma hesaru enu?",
  "had food": "Oota aaytha?",
  "stop here": "Illi nillisi",
  "brother": "Anna",
  "sister": "Akka",
  "very good": "Sakkath",
  "how are you": "Hegiddira?"
};

const Guru = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const recognitionRef = useRef(null);

  // Fallback translation logic
  const handleTranslate = (textToTranslate) => {
    const lowerText = textToTranslate.toLowerCase().trim();
    
    // Check if we have an exact match in our dictionary
    let result = KANGLISH_DICTIONARY[lowerText];

    // If no exact match, try to find partial matches
    if (!result) {
      const match = Object.keys(KANGLISH_DICTIONARY).find(key => lowerText.includes(key));
      if (match) result = `${KANGLISH_DICTIONARY[match]} (Partial match)`;
    }

    if (result) {
      setTranslatedText(result);
      setFeedback('');
    } else {
      setTranslatedText('');
      setFeedback("Guru is still learning! Try simple phrases like 'how much', 'go straight', or 'had food'.");
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text.length === 0) {
      setTranslatedText('');
      setFeedback('');
    } else {
      handleTranslate(text);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Your browser doesn't support the microphone for this app. Try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN'; // Indian English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setInputText('');
      setTranslatedText('Listening...');
      setFeedback('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Microphone error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className={styles.page}>
      
      {/* Top Disclaimer Banner */}
      <div className={styles.banner}>
        <Info size={16} />
        <span>Regional languages (Malayalam, Tamil, Telugu, Hindi) will be added shortly.</span>
      </div>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Languages size={28} color="var(--color-primary)" />
          <h1 className={styles.title}>Guru</h1>
        </div>
        <p className={styles.subtitle}>Your local Kannada translation buddy</p>
      </header>

      <div className={styles.translatorContainer}>
        
        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={styles.sectionLabel}>English</div>
          <textarea
            className={styles.textArea}
            placeholder="Type in English (e.g., 'how much' or 'take left')..."
            value={inputText}
            onChange={handleInputChange}
          />
          
          <div className={styles.controls}>
            <button 
              className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
              onClick={toggleListening}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              {isListening ? 'Stop' : 'Tap to Speak'}
            </button>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.divider}>
          <ArrowRightLeft size={20} color="var(--color-text-muted)" />
        </div>

        {/* Output Section */}
        <div className={styles.outputSection}>
          <div className={styles.sectionLabel}>Kannada (How to say it)</div>
          
          <div className={styles.resultBox}>
            {translatedText ? (
              <h2 className={styles.translatedText}>{translatedText}</h2>
            ) : (
              <span className={styles.placeholderText}>Translation will appear here...</span>
            )}
          </div>

          {feedback && <p className={styles.feedbackText}>{feedback}</p>}
        </div>

      </div>

      {/* Quick Suggestions */}
      <div className={styles.suggestionsContainer}>
        <h3 className={styles.suggestionsTitle}>Try asking Guru:</h3>
        <div className={styles.chips}>
          {["How much", "Take left", "Had food", "Brother"].map((phrase) => (
            <button 
              key={phrase} 
              className={styles.chip}
              onClick={() => {
                setInputText(phrase);
                handleTranslate(phrase);
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Guru;