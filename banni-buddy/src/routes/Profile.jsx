import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuthStore } from '../store/useAuthStore.js';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.avatar}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.title}>Welcome back!</h2>
          <p className={styles.subtitle}>{user.email}</p>
          <button onClick={handleSignOut} className={styles.outlineButton}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Join the Community</h1>
        <p className={styles.subtitle}>Sign in to ask for help or assist newcomers.</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'Sending...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <p className={styles.helpText}>We sent a 6-digit code to {email}</p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className={styles.textButton}
            >
              Use a different email
            </button>
          </form>
        )}

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className={styles.googleIcon} 
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Profile;