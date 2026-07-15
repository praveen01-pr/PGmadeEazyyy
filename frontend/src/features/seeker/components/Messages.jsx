import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { chatApi } from '../../../services/api';
import { ArrowLeft, Send, MessageSquare, User, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [inbox, setInbox] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const role = user?.role || 'seeker';
  const userId = user?.id;

  // Retrieve params if navigated from "Chat with Owner"
  const paramPropertyId = searchParams.get('propertyId');
  const paramPropertyName = searchParams.get('propertyName');
  const paramProviderId = searchParams.get('providerId');
  const paramProviderName = searchParams.get('providerName');

  useEffect(() => {
    if (userId) {
      fetchInboxAndHandleParams();
    }
  }, [userId]);

  useEffect(() => {
    if (!activeThread) return;
    
    // Fetch initial chat history
    fetchHistory(activeThread, true);

    // Set up polling every 5 seconds for new messages
    const interval = setInterval(() => {
      fetchHistory(activeThread, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeThread]);

  // Scroll to bottom when message list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInboxAndHandleParams = async () => {
    try {
      setLoading(true);
      const inboxData = await chatApi.getInbox(userId, role);
      setInbox(inboxData || []);

      // If we have query parameters, check if this thread is already in the inbox
      if (paramPropertyId && paramProviderId && role === 'seeker') {
        const existingThread = inboxData.find(
          thread => thread.propertyId === paramPropertyId && thread.providerId === paramProviderId
        );

        if (existingThread) {
          setActiveThread(existingThread);
        } else {
          // Create a temporary mock thread for the new conversation
          const mockThread = {
            propertyId: paramPropertyId,
            propertyName: paramPropertyName,
            seekerId: userId,
            seekerName: user.name,
            providerId: paramProviderId,
            providerName: paramProviderName,
            otherUserId: paramProviderId,
            otherUserName: paramProviderName,
            lastMessage: 'Start a new conversation...',
            timestamp: new Date().toISOString(),
            isNew: true
          };
          setInbox(prev => [mockThread, ...prev]);
          setActiveThread(mockThread);
        }
      } else if (inboxData && inboxData.length > 0) {
        // Otherwise, open the first thread in the list by default
        setActiveThread(inboxData[0]);
      }
    } catch (error) {
      console.error('Error fetching inbox:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (thread, showLoader = false) => {
    if (showLoader) setHistoryLoading(true);
    try {
      // For mock new thread, history is empty
      if (thread.isNew) {
        setMessages([]);
        return;
      }
      const history = await chatApi.getHistory(thread.seekerId, thread.providerId, thread.propertyId);
      setMessages(history || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      if (showLoader) setHistoryLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    const messageData = {
      propertyId: activeThread.propertyId,
      propertyName: activeThread.propertyName,
      seekerId: activeThread.seekerId,
      seekerName: activeThread.seekerName,
      providerId: activeThread.providerId,
      providerName: activeThread.providerName,
      senderId: userId,
      senderName: user.name,
      senderRole: role,
      message: newMessage.trim()
    };

    try {
      const savedMsg = await chatApi.sendMessage(messageData);
      setMessages(prev => [...prev, savedMsg]);
      setNewMessage('');

      // If it was a mock thread, it is no longer "new" as it's saved in the database
      if (activeThread.isNew) {
        activeThread.isNew = false;
        // Refresh inbox to display actual backend updates
        const updatedInbox = await chatApi.getInbox(userId, role);
        setInbox(updatedInbox);
        const actualThread = updatedInbox.find(
          t => t.propertyId === activeThread.propertyId && t.providerId === activeThread.providerId
        );
        if (actualThread) {
          setActiveThread(actualThread);
        }
      } else {
        // Update last message in local inbox list
        setInbox(prev =>
          prev.map(thread =>
            thread.propertyId === activeThread.propertyId &&
            thread.seekerId === activeThread.seekerId &&
            thread.providerId === activeThread.providerId
              ? { ...thread, lastMessage: savedMsg.message, timestamp: savedMsg.timestamp }
              : thread
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const getBackPath = () => {
    return role === 'provider' ? '/provider-dashboard' : '/seeker-dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-black border-b border-orange-600/40 flex items-center gap-4">
        <button
          onClick={() => navigate(getBackPath())}
          className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Messages</h1>
      </div>

      {/* Chat Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Inbox List */}
        <div className="w-full md:w-80 border-r border-orange-600/30 flex flex-col bg-black">
          {inbox.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-500 text-center">
              <MessageSquare className="w-12 h-12 mb-3 text-gray-600" />
              <p>No messages yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-orange-600/20">
              {inbox.map((thread, index) => {
                const isActive =
                  activeThread &&
                  activeThread.propertyId === thread.propertyId &&
                  activeThread.seekerId === thread.seekerId &&
                  activeThread.providerId === thread.providerId;

                return (
                  <div
                    key={index}
                    onClick={() => setActiveThread(thread)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isActive ? 'bg-orange-600/20 border-l-4 border-orange-500' : 'hover:bg-orange-600/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">
                        <User className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{thread.otherUserName}</h4>
                        <span className="text-xs text-orange-400 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{thread.propertyName}</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 truncate pl-13">{thread.lastMessage}</p>
                    <span className="text-xxs text-gray-500 block text-right mt-1">
                      {new Date(thread.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Message Thread */}
        <div className="flex-1 flex flex-col bg-black/90">
          {activeThread ? (
            <>
              {/* Active Thread Details Header */}
              <div className="p-4 border-b border-orange-600/30 flex items-center justify-between bg-black">
                <div>
                  <h3 className="font-bold text-lg text-white">{activeThread.otherUserName}</h3>
                  <p className="text-xs text-gray-400">Regarding: {activeThread.propertyName}</p>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {historyLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare className="w-10 h-10 mb-2 text-gray-600 animate-pulse" />
                    <p>Send a message to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.senderId === userId;
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                            isSelf
                              ? 'bg-orange-600 text-white rounded-tr-none border border-orange-500'
                              : 'bg-zinc-900 text-white rounded-tl-none border border-zinc-800'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span
                            className={`text-xxs mt-1 block text-right ${
                              isSelf ? 'text-orange-200' : 'text-zinc-500'
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-orange-600/30 bg-black flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-900/80 border border-orange-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="p-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold transition flex items-center justify-center disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-600" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
