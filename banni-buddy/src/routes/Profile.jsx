import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useMyRequests, useMyConversations, useResolveRequest } from '../features/profile/hooks/useProfileData.js';
import { LogOut, MessageSquare, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('requests');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: myRequests, isLoading: loadingRequests } = useMyRequests();
  const { data: myConversations, isLoading: loadingChats } = useMyConversations();
  const { mutate: resolveRequest, isPending: isResolving } = useResolveRequest();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setStep('otp');
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (error) setError(error.message);
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
      <div className={styles.dashboardPage}>
        <header className={styles.dashHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className={styles.userName}>My Profile</h1>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className={styles.logoutButton} title="Sign Out">
            <LogOut size={20} />
          </button>
        </header>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FileText size={18} /> My Requests
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'chats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare size={18} /> My Chats
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'requests' && (
            <div className={styles.list}>
              {loadingRequests ? <p className={styles.statusMsg}>Loading...</p> : 
               myRequests?.length === 0 ? <p className={styles.statusMsg}>You haven't posted any requests yet.</p> :
               myRequests.map(req => (
                 <div key={req.id} className={styles.card} onClick={() => navigate('/requests')}>
                   <div className={styles.cardHeader}>
                     <span className={styles.category}>{req.category}</span>
                     <span className={`${styles.statusBadge} ${styles[req.status]}`}>{req.status}</span>
                   </div>
                   <h3 className={styles.cardTitle}>{req.title}</h3>
                   
                   {req.status === 'open' && (
                     <button 
                       className={styles.resolveButton}
                       disabled={isResolving}
                       onClick={(e) => {
                         e.stopPropagation();
                         resolveRequest(req.id);
                       }}
                     >
                       <CheckCircle size={16} />
                       Mark as Resolved
                     </button>
                   )}
                 </div>
               ))
              }
            </div>
          )}

          {activeTab === 'chats' && (
            <div className={styles.list}>
              {loadingChats ? <p className={styles.statusMsg}>Loading...</p> : 
               myConversations?.length === 0 ? <p className={styles.statusMsg}>No active conversations.</p> :
               myConversations.map(convo => {
                 const iAmHelper = user.id === convo.helper_id;
                 const chatPartnerName = iAmHelper 
                   ? convo.help_requests.profiles.username 
                   : convo.profiles.username;
                 
                 const roleLabel = iAmHelper ? "You are helping" : "Helping you";

                 return (
                   <div key={convo.id} className={styles.chatCard} onClick={() => navigate(`/chat/${convo.id}`)}>
                     <div className={styles.chatInfo}>
                       <h3 className={styles.chatPartner}>Chat with {chatPartnerName}</h3>
                       <p className={styles.chatContext}>
                         <strong>{roleLabel}:</strong> {convo.help_requests.title}
                       </p>
                     </div>
                     <ChevronRight size={20} color="var(--color-text-muted)" />
                   </div>
                 )
               })
              }
            </div>
          )}
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
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'Sending...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <p className={styles.helpText}>We sent a 6-digit code to {email}</p>
            <input type="text" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} className={styles.input} required />
            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button type="button" onClick={() => setStep('email')} className={styles.textButton}>Use a different email</button>
          </form>
        )}
        <div className={styles.divider}><span>OR</span></div>
        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className={styles.googleIcon} />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Profile;