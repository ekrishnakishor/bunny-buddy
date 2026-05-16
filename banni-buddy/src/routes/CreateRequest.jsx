import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreateRequest } from '../features/help-requests/hooks/useHelpRequests.js';
import { useLocalityStore } from '../store/useLocalityStore.js';
import { REQUEST_CATEGORIES, URGENCY_LEVELS } from '../constants/categories.js';
import styles from './CreateRequest.module.css';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { localityName } = useLocalityStore();
  const { mutateAsync: createRequest, isPending } = useCreateRequest();

  const [formData, setFormData] = useState({
    title: '',
    category: REQUEST_CATEGORIES[0],
    description: '',
    urgency: 'low',
    budget: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await createRequest({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      });
      navigate('/requests'); // Go back to the feed on success
    } catch (err) {
      setError(err.message || 'Failed to post request.');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Ask for Help</h1>
        <div className={styles.placeholder}></div>
      </header>

      <div className={styles.infoBanner}>
        Posting in <strong>{localityName}</strong>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>What do you need help with?</label>
          <input 
            name="title"
            type="text" 
            placeholder="E.g., Looking for an affordable PG near Eco Space" 
            value={formData.title}
            onChange={handleChange}
            required 
            minLength={10}
            maxLength={100}
          />
        </div>

        <div className={styles.field}>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {REQUEST_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Details</label>
          <textarea 
            name="description"
            placeholder="Explain what you need in detail..." 
            value={formData.description}
            onChange={handleChange}
            required
            minLength={20}
            rows={5}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Urgency</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange}>
              {URGENCY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Budget (₹) <span className={styles.optional}>(Optional)</span></label>
            <input 
              name="budget"
              type="number" 
              placeholder="0.00" 
              min="0"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? 'Posting...' : 'Post Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;