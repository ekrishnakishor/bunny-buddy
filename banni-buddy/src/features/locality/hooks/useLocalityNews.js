import { useState, useEffect } from 'react';

export const useLocalityNews = (localityName) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localityName) return;

    const fetchNews = async () => {
      setLoading(true);
      
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

      if (apiKey) {
        try {
          const query = encodeURIComponent(`Bengaluru ${localityName}`);
          // CHANGED: Fetch up to 3 articles instead of 1
          const res = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=3&apikey=${apiKey}`);
          const data = await res.json();
          
          if (data.articles && data.articles.length > 0) {
            setNewsList(data.articles.map(article => ({
              title: article.title,
              description: article.description
            })));
          }
        } catch (error) {
          console.error("News fetch failed", error);
        }
      } else {
        // SMART FALLBACK: Now returns an array of 3 local updates
        const fallbackUpdates = [
          {
            title: "Water Supply Notice",
            description: `BWSSB pipeline maintenance scheduled near ${localityName} main roads tomorrow. Slight water pressure drops expected.`
          },
          {
            title: "Community Initiative",
            description: `New BBMP waste segregation drive starting in ${localityName}. Volunteers needed for the weekend awareness camp.`
          },
          {
            title: "Traffic Advisory",
            description: `Traffic Police have announced new one-way routing around the primary junctions in ${localityName} to ease evening congestion.`
          }
        ];
        
        setNewsList(fallbackUpdates);
      }
      setLoading(false);
    };

    fetchNews();
  }, [localityName]);

  return { newsList, loading };
};