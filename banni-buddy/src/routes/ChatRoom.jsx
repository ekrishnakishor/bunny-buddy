import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useChatMessages, useSendMessage } from '../features/chat/hooks/useChat.js';
import { useAuthStore } from '../store/useAuthStore.js';
import styles from './ChatRoom.module.css';

const ChatRoom = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { data: messages, isLoading } = useChatMessages(conversationId);
  const { mutateAsync: sendMessage, isPending } = useSendMessage();

  // Auto-scroll to the bottom when messages load or a new one arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({ conversationId, content: newMessage.trim() });
      setNewMessage(''); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Private Chat</h1>
        <div className={styles.placeholder}></div>
      </header>

      <div className={styles.chatContainer}>
        {isLoading ? (
          <div className={styles.status}>Loading messages...</div>
        ) : messages?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Say Namaskara! 👋</p>
            <span>This is the start of your conversation.</span>
          </div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`${styles.messageWrapper} ${isMine ? styles.mine : styles.theirs}`}>
                  {!isMine && <span className={styles.senderName}>{msg.profiles.username}</span>}
                  <div className={styles.bubble}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
          disabled={isPending}
        />
        <button type="submit" disabled={!newMessage.trim() || isPending} className={styles.sendButton}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;