import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import MsgDisplay from './MsgDisplay';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { imageUpload } from '../../utils/imageUpload';
import { addMessage, getMessages, MESSAGE_TYPES } from '../../redux/actions/messageAction';
import LoadIcon from '../../images/loading.gif';
import '../../styles/nexus-message.css';

const RightSide = () => {
  const { auth, message, theme, socket } = useSelector(state => state);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [text, setText] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const refDisplay = useRef();
  const pageEnd = useRef();

    useEffect(() => {
      if (id) {
        console.log('Conversation changed to:', id);
        // Clear previous messages first
        dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: { messages: [], result: 0 } });
        // Then fetch messages for this conversation
        dispatch(getMessages({ auth, id, page: 1 }));
      }
    }, [id, auth, dispatch]);

    useEffect(() => {
      console.log('Filtering messages for conversation:', id);
      console.log('All messages in state:', message.data);
      console.log('Current user ID:', auth.user._id);
      
      const newData = message.data.filter(
        (item) => {
          // Handle both object and string sender/recipient IDs
          const senderId = typeof item.sender === 'object' ? item.sender._id : item.sender;
          const recipientId = typeof item.recipient === 'object' ? item.recipient._id : item.recipient;
          
          const isMyMessage = senderId === auth.user._id && recipientId === id;
          const isTheirMessage = senderId === id && recipientId === auth.user._id;
          
          return isMyMessage || isTheirMessage;
        }
      );
      
      // Sort messages by creation date to ensure proper order
      const sortedData = newData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      console.log('Filtered and sorted messages:', sortedData);
      setData(sortedData);
    }, [message.data, auth.user._id, id]);

    useEffect(() => {
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
    }, [message.users, id]);

    // Socket event listeners for real-time messaging
    useEffect(() => {
      if (socket) {
        // Listen for incoming messages
        const handleAddMessage = (msg) => {
          console.log('RightSide received addMessageToClient via socket:', msg);
          dispatch({
            type: MESSAGE_TYPES.ADD_MESSAGE,
            payload: {
              ...msg,
              messageStatus: 'delivered'
            }
          });
        };

        // Listen for typing indicators
        const handleTyping = (data) => {
          if (data.from === id) {
            dispatch({ type: MESSAGE_TYPES.TYPING_START, payload: data.from });
          }
        };

        const handleStopTyping = (data) => {
          if (data.from === id) {
            dispatch({ type: MESSAGE_TYPES.TYPING_STOP, payload: data.from });
          }
        };

        socket.on('addMessageToClient', handleAddMessage);
        socket.on('typing', handleTyping);
        socket.on('stopTyping', handleStopTyping);

        // Cleanup listeners
        return () => {
          socket.off('addMessageToClient', handleAddMessage);
          socket.off('typing', handleTyping);
          socket.off('stopTyping', handleStopTyping);
        };
      }
    }, [socket, id, dispatch]);

    const handleChangeMedia = (e) => {
      const files = [...e.target.files];
    let err = "";
    let newMedia = [];

    files.forEach((file) => {
      if (!file) {
        return (err = "File does not exist.");
      }
      if (file.size > 1024 * 1024 * 5) {
        return (err = "Image size must be less than 5 mb.");
      }
      return newMedia.push(file);
    });
    if (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }
    setMedia([...media, ...newMedia]);
    };

    const handleDeleteMedia = (index) => {
      const newArr = [...media];
      newArr.splice(index, 1);
      setMedia(newArr);
    };

    // typing indicator debounce
    const typingTimeout = useRef();

    const handleInputChange = (e) => {
      const value = e.target.value;
      setText(value);
      if (!id) return;
      // emit typing start
      socket.emit('typing', { from: auth.user._id, to: id });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('stopTyping', { from: auth.user._id, to: id });
      }, 1200);
    };

    const handleEmojiClick = (emoji) => {
      setText(prev => prev + emoji);
      setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };

    const handleMessageSearch = (query) => {
      setMessageSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        setCurrentSearchIndex(0);
        return;
      }

      const results = data.filter((msg, index) => 
        msg.text && msg.text.toLowerCase().includes(query.toLowerCase())
      ).map((msg, resultIndex) => {
        const originalIndex = data.findIndex(m => m._id === msg._id || 
          (m.text === msg.text && m.createdAt === msg.createdAt));
        return { ...msg, originalIndex, resultIndex };
      });

      setSearchResults(results);
      setCurrentSearchIndex(0);
      
      if (results.length > 0) {
        scrollToMessage(results[0].originalIndex);
      }
    };

    const scrollToMessage = (messageIndex) => {
      const messageElements = Array.from(document.querySelectorAll('.message-wrapper'));
      const el = messageElements[messageIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the message temporarily using the captured element reference
        el.classList.add('search-highlight');
        setTimeout(() => {
          if (el && el.classList) el.classList.remove('search-highlight');
        }, 2000);
      }
    };

    const navigateSearchResults = (direction) => {
      if (searchResults.length === 0) return;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = currentSearchIndex < searchResults.length - 1 ? currentSearchIndex + 1 : 0;
      } else {
        newIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : searchResults.length - 1;
      }
      
      setCurrentSearchIndex(newIndex);
      scrollToMessage(searchResults[newIndex].originalIndex);
    };

    const toggleMessageSearch = () => {
      setShowMessageSearch(!showMessageSearch);
      if (!showMessageSearch) {
        setMessageSearchQuery('');
        setSearchResults([]);
        setCurrentSearchIndex(0);
      }
    };

    const handleSubmit = async e => {
      e.preventDefault();
      if(!text.trim() && media.length === 0) return;
      
      const messageText = text;
      const messageMedia = [...media];
      
      setText('');
      setMedia([]);
      setLoadMedia(true);

      let newArr = [];
      if(messageMedia.length > 0) newArr = await imageUpload(messageMedia);

      const msg = {
        sender: auth.user._id,
        recipient: id,
        text: messageText,
        media: newArr,
        createdAt: new Date().toISOString()
      }
      
      console.log('RightSide handleSubmit - sending message:', msg);
      setLoadMedia(false);
      await dispatch(addMessage({msg, auth, socket}));
      // Safely scroll the messages container into view if available
      refDisplay.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    useEffect(() => {
      if (id) {
        const getMessagesData = async () => {

          dispatch({type: MESSAGE_TYPES.GET_MESSAGES, payload: { messages: [] } });
          
          setPage(1);
          await dispatch(getMessages({ auth, id }));
          // Scroll to bottom when messages are loaded, if the container exists
          refDisplay.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        };

        getMessagesData();
      }
    }, [id, dispatch, auth]);

    // load more

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((p) => p + 1);
          }
        },
        {
          threshold: 0.1,
        }
      );
      // Only observe if the sentinel element is mounted
      if (pageEnd.current) observer.observe(pageEnd.current);
    }, [setPage]);

    useEffect(() => {
      if (message.resultData >= (page - 1) * 9 && page > 1) {
        dispatch(getMessages({ auth, id, page }));
      }
    }, [message.resultData, page, id, auth, dispatch]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
      // Auto-scroll to bottom when new messages arrive (guarded)
      if (data.length > 0) {
        refDisplay.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, [data.length]);

    // Scroll to bottom when component mounts or conversation changes
    useEffect(() => {
      // When conversation changes, attempt a delayed scroll to bottom if the container exists
      setTimeout(() => {
        refDisplay.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }, [id]);

    return (
      <>
        <div className="nexus-chat-container">
        {/* Chat Header */}
        <div className="nexus-chat-header">
          {user && user._id ? (
            <>
              <div className="nexus-chat-user-info">
                <div className="nexus-chat-user-avatar">
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                  />
                  <span className="nexus-status-indicator"></span>
                </div>
                <div className="nexus-chat-user-details">
                  <h3 className="nexus-chat-user-name">{user.fullname}</h3>
                  <div className="nexus-chat-user-status">
                    {message.typingUsers.includes(id) ? (
                      <>
                        <span className="nexus-status-indicator"></span>
                        <span>typing...</span>
                      </>
                    ) : (
                      <>
                        <span className="nexus-status-indicator"></span>
                        <span>last seen recently</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="nexus-chat-actions">
                <button 
                  className="nexus-chat-action-btn" 
                  title="Search in conversation"
                  onClick={toggleMessageSearch}
                >
                  <i className="fas fa-search"></i>
                </button>
                <button className="nexus-chat-action-btn" title="More options">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="nexus-chat-header-loading">
              <div className="nexus-loading-skeleton"></div>
            </div>
          )}
        </div>

        {/* Message Search Bar */}
        {showMessageSearch && (
          <div className="nexus-message-search-bar">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search messages..."
                value={messageSearchQuery}
                onChange={(e) => handleMessageSearch(e.target.value)}
                className="nexus-message-search-input"
                autoFocus
              />
              <button 
                className="nexus-chat-action-btn"
                onClick={toggleMessageSearch}
                title="Close search"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {messageSearchQuery && (
              <div className="nexus-search-results-info">
                {searchResults.length > 0 ? (
                  <div className="nexus-search-navigation">
                    <span className="nexus-search-count">
                      {currentSearchIndex + 1} of {searchResults.length}
                    </span>
                    <div className="nexus-search-nav-buttons">
                      <button 
                        className="nexus-search-nav-btn"
                        onClick={() => navigateSearchResults('prev')}
                        disabled={searchResults.length <= 1}
                        title="Previous result"
                      >
                        <i className="fas fa-chevron-up"></i>
                      </button>
                      <button 
                        className="nexus-search-nav-btn"
                        onClick={() => navigateSearchResults('next')}
                        disabled={searchResults.length <= 1}
                        title="Next result"
                      >
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="nexus-no-results">
                    <i className="fas fa-search"></i>
                    <span>No results found</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="nexus-messages-container">
          <button style={{marginTop: '-25px', opacity: 0}} ref={pageEnd}>Load..</button>
          
          {data.length === 0 ? (
            <div className="nexus-chat-empty-state">
              <div className="nexus-empty-chat-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Start a conversation</h3>
              <p>Send a message to {user.fullname || 'this user'} to begin chatting</p>
            </div>
          ) : (
            <div className="nexus-messages-list" ref={refDisplay}>
              {data.map((msg, index) => {
                const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                const isSentByMe = senderId === auth.user._id;
                
                return (
                  <div key={index} className={`nexus-message ${isSentByMe ? 'sent' : 'received'}`}>
                    {!isSentByMe && (
                      <div className="nexus-message-avatar">
                        <img src={user.avatar} alt={user.username} />
                      </div>
                    )}
                    <div className="nexus-message-content">
                      <div className="nexus-message-bubble">
                        <MsgDisplay user={isSentByMe ? auth.user : user} msg={msg} theme={theme} />
                      </div>
                      <div className="nexus-message-meta">
                        <span className="nexus-message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {isSentByMe && (
                          <span className={`nexus-message-status ${msg.messageStatus === 'read' ? 'read' : ''}`}>
                            <i className={`fas fa-check${msg.messageStatus === 'read' ? '-double' : msg.messageStatus === 'delivered' ? '-double' : ''}`}></i>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {message.typingUsers.includes(id) && (
                <div className="nexus-message received">
                  <div className="nexus-message-avatar">
                    <img src={user.avatar} alt={user.username} />
                  </div>
                  <div className="nexus-typing-indicator">
                    <div className="nexus-typing-dot"></div>
                    <div className="nexus-typing-dot"></div>
                    <div className="nexus-typing-dot"></div>
                  </div>
                </div>
              )}
              {loadMedia && (
                <div className="nexus-message sent">
                  <div className="nexus-message-content">
                    <div className="nexus-message-bubble">
                      <img src={LoadIcon} alt="Sending..." style={{width: '20px', height: '20px'}} />
                      <span>Sending...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="nexus-media-preview">
            {media.map((item, index) => (
              <div key={index} className="nexus-media-preview-item">
                {item.type.match(/video/i) ? (
                  <video src={URL.createObjectURL(item)} />
                ) : (
                  <img src={URL.createObjectURL(item)} alt="Preview" />
                )}
                <button 
                  onClick={() => handleDeleteMedia(index)}
                  className="nexus-media-preview-remove"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Message Input */}
        <div className="nexus-chat-input-area">
          <form onSubmit={handleSubmit}>
            <div className="nexus-chat-input-container">
              <button 
                type="button" 
                className="nexus-chat-input-btn" 
                onClick={toggleEmojiPicker}
                title="Emoji"
              >
                <i className="far fa-smile"></i>
              </button>
              {showEmojiPicker && (
                <div className="nexus-emoji-picker">
                  <div className="nexus-emoji-grid">
                    {['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😢', '😭', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉', '😴', '🤗', '🙄', '😬', '🤐', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😇', '🤓'].map(emoji => (
                      <button 
                        key={emoji} 
                        type="button"
                        className="nexus-emoji-item" 
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <textarea
                value={text}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="nexus-chat-input"
                rows="1"
              />

              <div className="nexus-chat-input-actions">
                <label className="nexus-chat-input-btn" htmlFor="file" title="Attach file">
                  <i className="fas fa-paperclip"></i>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleChangeMedia}
                    style={{ display: 'none' }}
                  />
                </label>
                
                {text.trim() || media.length > 0 ? (
                  <button type="submit" className="nexus-chat-send-btn" disabled={loadMedia}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                ) : (
                  <button type="button" className="nexus-chat-input-btn" title="Voice message">
                    <i className="fas fa-microphone"></i>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      </>
    );
}

export default RightSide
