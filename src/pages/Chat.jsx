import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Chat.css';
import AuthModal from '../components/AuthModal.jsx';
import ApiKeyModal from '../components/ApiKeyModal.jsx';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.jsx';
import { HiOutlineDocumentText } from "react-icons/hi";
import { LuBrainCircuit } from "react-icons/lu";
import { RiVoiceAiLine } from "react-icons/ri";
import CodeBlock from '../components/CodeBlock.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isThinking, setIsThinking] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('OpenAI');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [modelsList, setModelsList] = useState([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [copiedButtonId, setCopiedButtonId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  // Helper: truncate text to single-line preview
  const truncate = (str, len = 25) => str && str.length > len ? str.slice(0, len) + '...' : str;

  const profileRef = useRef(null);
  const modelRef = useRef(null);
  const providerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setModelDropdownOpen(false);
      }
      if (providerRef.current && !providerRef.current.contains(event.target)) {
        setProviderDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef, modelRef, providerRef]);

  useEffect(() => {
    const cacheKey = `models_${selectedProvider}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setModelsList(parsed);
      if (!parsed.find(m => m.id === selectedModel) && parsed.length) {
        setSelectedModel(parsed[0].id);
      }
      return;
    }
    const fetchModels = async () => {
      try {
        const response = await fetch('https://beqb65iu09.execute-api.us-east-1.amazonaws.com/getModels/getModels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: selectedProvider })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        // parse models array whether in result.models or inside result.body string
        let modelsData;
        if (result.models) {
          modelsData = result.models;
        } else if (result.body) {
          const parsed = JSON.parse(result.body);
          modelsData = parsed.models || [];
        } else {
          modelsData = [];
        }
        const models = modelsData.map(item => ({ id: item.ModelName, name: item.ModelName }));
        setModelsList(models);
        sessionStorage.setItem(cacheKey, JSON.stringify(models));
        if (!models.find(m => m.id === selectedModel) && models.length) {
          setSelectedModel(models[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      }
    };
    fetchModels();
  }, [selectedProvider]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        'https://beqb65iu09.execute-api.us-east-1.amazonaws.com/conversationsAPI/getConversations',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserId: userEmail })
        }
      );
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      const result = await response.json();
      const data = result.body
        ? (typeof result.body === 'string' ? JSON.parse(result.body) : result.body)
        : result;
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  // Fetch full conversation messages
  const fetchConversationDetail = async (convId) => {
    try {
      const response = await fetch(
        'https://beqb65iu09.execute-api.us-east-1.amazonaws.com/conversationsAPI/getConversations',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserId: userEmail, conversationId: convId })
        }
      );
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      const result = await response.json();
      const data = result.body
        ? (typeof result.body === 'string' ? JSON.parse(result.body) : result.body)
        : result;
      if (data.error) throw new Error(data.error);
      // Transform API messages to UI format
      const uiMessages = data.messages.map((m, idx) => ({
        id: idx + 1,
        sender: m.role === 'assistant' ? 'ai' : 'user',
        text: m.content
      }));
      setMessages(uiMessages);
      setConversationId(data.ConversationId);
    } catch (err) {
      console.error('Failed to fetch conversation detail:', err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchConversations();
    } else {
      setConversations([]);
    }
  }, [userEmail]);

  const handleToggleProfile = () => setProfileDropdownOpen(prev => !prev);
  const handleToggleModelDropdown = () => setModelDropdownOpen(prev => !prev);
  const handleToggleProviderDropdown = () => setProviderDropdownOpen(prev => !prev);
  const handleOpenAuthModal = () => setShowAuthModal(true);
  const handleCloseAuthModal = () => setShowAuthModal(false);
  const handleOpenApiKeyModal = () => setShowApiKeyModal(true);
  const handleCloseApiKeyModal = () => setShowApiKeyModal(false);

  const handleLogin = (email) => {
    setUserEmail(email);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!userEmail) {
      setShowAuthModal(true);
      return;
    }
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTextareaRows(1);
    setIsThinking(true);
    // get API key from sessionStorage
    const openaiKey = sessionStorage.getItem('openaiApiKey') || '';
    const xaiKey = sessionStorage.getItem('xaiApiKey') || '';
    const key = selectedProvider.toLowerCase() === 'openai' ? openaiKey : xaiKey;
    if (!key) {
      setShowApiKeyModal(true);
      setIsThinking(false);
      return;
    }
    const mode = conversationId ? 'continueConversation' : 'startConversation';
    const payload = {
      mode,
      UserId: userEmail,
      ConversationId: conversationId,
      prompt: userMsg.text,
      model: selectedModel,
      key,
      provider: selectedProvider.toLowerCase(),
    };
    try {
      const response = await fetch(
        'https://beqb65iu09.execute-api.us-east-1.amazonaws.com/conversationsAPI/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      const result = await response.json();
      // Unwrap API Gateway-style response body
      const data = result.body
        ? (typeof result.body === 'string' ? JSON.parse(result.body) : result.body)
        : result;
      if (data.error) {
        throw new Error(data.error);
      }
      // set conversationId once
      if (!conversationId && data.ConversationId) {
        setConversationId(data.ConversationId);
      }
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: data.completion || 'No response' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: `Error: ${err.message}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleToggleSidebar = () => setShowSidebar(prev => !prev);
  // Handler to start a new conversation
  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  const handleOpenDeleteModal = (conv) => {
    setConversationToDelete(conv);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setConversationToDelete(null);
  };

  const handleConfirmDelete = (conv) => {
    setConversations(prev => prev.filter(c => c.ConversationId !== conv.ConversationId));
    // If the deleted conversation is currently open, reset
    if (conversationId === conv.ConversationId) {
      setConversationId(null);
      setMessages([]);
    }
    handleCloseDeleteModal();
  };

  const providers = [
    { id: 'OpenAI', name: 'OpenAI' },
    { id: 'XAI', name: 'XAI' },
  ];

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    setModelDropdownOpen(false);
  };

  const handleSelectProvider = (providerId) => {
    setSelectedProvider(providerId);
    setProviderDropdownOpen(false);
  };

  // Textarea auto-resize function
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Calculate rows based on content (up to max of 5)
    const lineCount = e.target.value.split('\n').length;
    const newRows = Math.min(Math.max(1, lineCount), 5);
    setTextareaRows(newRows);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        showSidebar={showSidebar}
        conversations={conversations}
        fetchConversationDetail={fetchConversationDetail}
        truncate={truncate}
        handleOpenDeleteModal={handleOpenDeleteModal}
        handleNewConversation={handleNewConversation}
      />
      <div className="chat-main">
        <ChatHeader
          modelDropdownOpen={modelDropdownOpen}
          modelRef={modelRef}
          modelsList={modelsList}
          selectedModel={selectedModel}
          handleToggleSidebar={handleToggleSidebar}
          handleToggleModelDropdown={handleToggleModelDropdown}
          handleSelectModel={handleSelectModel}
          userEmail={userEmail}
          profileDropdownOpen={profileDropdownOpen}
          profileRef={profileRef}
          handleToggleProfile={handleToggleProfile}
          handleOpenApiKeyModal={handleOpenApiKeyModal}
          handleOpenAuthModal={handleOpenAuthModal}
        />
        <div className="chat-messages">
          {messages.length === 0 && userEmail ? (
            <div className="chat-welcome">
              Welcome {userEmail}, ready to chat?
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: (props) => (
                        <CodeBlock {...props} copiedButtonId={copiedButtonId} setCopiedButtonId={setCopiedButtonId} />
                      )
                    }}
                  > 
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}
              {isThinking && (
                <div key="thinking" className="chat-message ai thinking">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="chat-input-container">
          <div className="chat-input-text-tools">
            <div className="chat-input-row">
              <textarea
                className="chat-textarea"
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                rows={textareaRows}
              />
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
            <div className="chat-input-buttons">
              <button className="btn btn-secondary"><HiOutlineDocumentText size={20} /></button>
              <button className="btn btn-secondary"><LuBrainCircuit size={20}/></button>
              <button className="btn btn-secondary"><RiVoiceAiLine size={20}/></button>
            </div>
          </div>
          <div className="provider-dropdown-container" ref={providerRef}>
            <button className="btn btn-secondary provider-dropdown-button" onClick={handleToggleProviderDropdown}>
              Provider: {providers.find(p => p.id === selectedProvider)?.name || 'Select Provider'} ▼
            </button>
            {providerDropdownOpen && (
              <ul className="provider-dropdown">
                {providers.map(provider => (
                  <li key={provider.id} onClick={() => handleSelectProvider(provider.id)}>
                    {provider.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={handleCloseAuthModal} onLogin={handleLogin} />}
      {showApiKeyModal && <ApiKeyModal onClose={handleCloseApiKeyModal} />}
      {/* Confirmation modal for deleting conversation */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        conversation={conversationToDelete}
      />
    </div>
  );
}