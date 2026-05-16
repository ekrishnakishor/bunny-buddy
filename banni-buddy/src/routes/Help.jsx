import { useNavigate } from "react-router-dom";
import { useRequests } from "../features/help-requests/hooks/useHelpRequests.js";
import { useStartConversation } from "../features/chat/hooks/useConversations.js";
import { useLocalityStore } from "../store/useLocalityStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Plus, MapPin } from "lucide-react";
import styles from "./Help.module.css";

const Help = () => {
  const navigate = useNavigate();
  const { localityName } = useLocalityStore();
  const { user } = useAuthStore();
  const { data: requests, isLoading } = useRequests();

  // Initialize our new chat mutation
  const { mutateAsync: startChat, isPending: isStartingChat } =
    useStartConversation();

  // Function to handle clicking Reply
  const handleReply = async (requestId) => {
    try {
      const conversationId = await startChat(requestId);
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      alert("Please sign in from the Profile tab to reply to requests.");
    }
  };

  if (!localityName) {
    return (
      <div className={styles.emptyState}>
        <MapPin className={styles.emptyIcon} />
        <h2>Select a Locality</h2>
        <p>
          Please select your area on the Home screen to view local help
          requests.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Local Requests</h1>
          <p className={styles.subtitle}>
            People who need help in {localityName}
          </p>
        </div>
        {user && (
          <button
            className={styles.createButton}
            onClick={() => navigate("/create-request")}
          >
            <Plus size={20} />
            <span>Ask for Help</span>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className={styles.status}>Loading requests...</div>
      ) : requests?.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>It's quiet here.</h2>
          <p>There are no active requests in {localityName} right now.</p>
        </div>
      ) : (
        <div className={styles.feed}>
          {requests.map((req) => (
            <div key={req.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{req.category}</span>
                <span className={styles.urgency} data-level={req.urgency}>
                  {req.urgency} urgency
                </span>
              </div>
              <h3 className={styles.cardTitle}>{req.title}</h3>
              <p className={styles.cardDesc}>{req.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {req.profiles.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{req.profiles.username}</span>
                </div>
                {/* Only show Reply if logged in AND they didn't create the request themselves */}
                {user?.id !== req.created_by && (
                  <button
                    className={styles.replyButton}
                    onClick={() => handleReply(req.id)}
                    disabled={isStartingChat}
                  >
                    {isStartingChat ? "Opening..." : "Reply"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Help;
