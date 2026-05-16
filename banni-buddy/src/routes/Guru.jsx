import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Languages, Info, ArrowRightLeft } from 'lucide-react';
import styles from './Guru.module.css';

// HYBRID DICTIONARY: English to Kanglish (Readable Kannada)
const KANGLISH_DICTIONARY = {
  // Greetings & Basics
  "hello": "Namaskara",
  "hey": "Namaskara",
  "hi": "Namaskara",
  "how are you": "Hegiddira?",
  "how are you?": "Hegiddira?",
  "i am fine": "Naanu chennagiddini",
  "what is your name": "Nimma hesaru enu?",
  "what is your name?": "Nimma hesaru enu?",
  "my name is": "Nanna hesaru...",
  "yes": "Houdhu",
  "no": "Illa",
  "okay": "Sari",
  "thank you": "Dhanyavadagalu",
  "sorry": "Kshamisi",
  "very good": "Sakkath",
  "super": "Sakkath / Bomp",

  // Navigation & Travel
  "where is the bus stop": "Bus stop elli ide?",
  "go straight": "Nera hogi",
  "take left": "Left tegolli",
  "take right": "Right tegolli",
  "stop here": "Illi nillisi",
  "come here": "Illi banni",
  "how much": "Yestu?",
  "how much?": "Yestu?",
  "what is the price": "Bele yestu?",
  "too much": "Jasti aaytu",
  "reduce price": "Kammi madi",

  // Food & Needs
  "had food": "Oota aaytha?",
  "had food?": "Oota aaytha?",
  "i want water": "Nanage neeru beku",
  "i want food": "Nanage oota beku",
  "is it spicy": "Khara idya?",
  "bill please": "Bill kodi",

  // People
  "brother": "Anna",
  "sister": "Akka",
  "uncle": "Uncle / Maava",
  "friend": "Geleya / Gelathi",

  // Language survival
  "i don't know kannada": "Nanage Kannada gottilla",
  "do you know english": "Nimage English gottidya?",
  "speak slowly": "Nidhanavagi mathadi"
};

const Guru = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Track translation direction (EN_TO_KN or KN_TO_EN)
  const [direction, setDirection] = useState('EN_TO_KN'); 

  const recognitionRef = useRef(null);
  const isEnglishToKannada = direction === 'EN_TO_KN';

  // Live typing/translation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const text = inputText.trim().toLowerCase();
      
      if (text.length === 0) {
        setTranslatedText('');
        setFeedback('');
        return;
      }

      if (isEnglishToKannada) {
        // Mode 1: English to Kanglish (Local Dictionary)
        handleKanglishTranslation(text);
      } else {
        // Mode 2: Kannada to English (Live API)
        translateWithAPI(inputText, 'kn|en');
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [inputText, direction, isEnglishToKannada]);


  // Logic for Kanglish
  const handleKanglishTranslation = (text) => {
    // 1. Check for exact match
    if (KANGLISH_DICTIONARY[text]) {
      setTranslatedText(KANGLISH_DICTIONARY[text]);
      setFeedback('');
      return;
    }

    // 2. Check for partial match if exact fails
    const partialMatch = Object.keys(KANGLISH_DICTIONARY).find(key => text.includes(key));
    if (partialMatch) {
      setTranslatedText(KANGLISH_DICTIONARY[partialMatch]);
      setFeedback(`Found close match for: "${partialMatch}"`);
      return;
    }

    // 3. Not found
    setTranslatedText('');
    setFeedback("Guru is still learning this phrase! Try basics like 'how much', 'go straight', or 'had food'.");
  };


  // Logic for API (Used only when speaking Kannada to get English meaning)
  const translateWithAPI = async (text, langpair) => {
    try {
      setFeedback('Translating meaning to English...');
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`);
      const data = await res.json();
      
      if (data && data.responseData) {
        setTranslatedText(data.responseData.translatedText);
        setFeedback('');
      }
    } catch (err) {
      setFeedback('Network error. Trying to reconnect...');
    }
  };


  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };


  const toggleDirection = () => {
    setDirection(prev => prev === 'EN_TO_KN' ? 'KN_TO_EN' : 'EN_TO_KN');
    setInputText('');
    setTranslatedText('');
    setFeedback('');
  };


  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Your browser doesn't support the microphone. Try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Set mic to listen for English OR Kannada based on the toggle!
    recognition.lang = isEnglishToKannada ? 'en-IN' : 'kn-IN'; 
    recognition.continuous = true;
    recognition.interimResults = true; 

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setFeedback('Listening... speak now.');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInputText(currentTranscript);
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
      
      <div className={styles.banner}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>Regional languages (Malayalam, Tamil, Telugu, Hindi) will be added shortly.</span>
      </div>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Languages size={28} color="var(--color-primary)" />
          <h1 className={styles.title}>Guru</h1>
        </div>
        <p className={styles.subtitle}>Your local translation buddy</p>
      </header>

      <div className={styles.translatorContainer}>
        
        {/* INPUT SECTION */}
        <div className={styles.inputSection}>
          <div className={styles.sectionLabel}>
            {isEnglishToKannada ? 'English' : 'Kannada (Speak into Mic)'}
          </div>
          <textarea
            className={styles.textArea}
            placeholder={isEnglishToKannada ? "Type or speak in English (e.g. 'how much')..." : "Tap the mic and speak Kannada..."}
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

        {/* SWAP BUTTON */}
        <div className={styles.divider}>
          <button className={styles.swapButton} onClick={toggleDirection} title="Swap Languages">
            <ArrowRightLeft size={18} color="var(--color-primary)" />
          </button>
        </div>

        {/* OUTPUT SECTION */}
        <div className={styles.outputSection}>
          <div className={styles.sectionLabel}>
            {isEnglishToKannada ? 'Kanglish (How to say it)' : 'English Translation'}
          </div>
          
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

      {/* QUICK SUGGESTIONS */}
      <div className={styles.suggestionsContainer}>
        <h3 className={styles.suggestionsTitle}>Try asking Guru:</h3>
        <div className={styles.chips}>
          {(isEnglishToKannada 
            ? ["How much", "Where is the bus stop", "Had food", "Brother"] 
            : ["ಎಷ್ಟು", "ಎಲ್ಲಿ", "ಊಟ ಆಯ್ತಾ"]
          ).map((phrase) => (
            <button 
              key={phrase} 
              className={styles.chip}
              onClick={() => {
                setInputText(phrase);
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