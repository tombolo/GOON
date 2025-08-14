// src/pages/copy-trading/copy-trading.tsx
import React, { useState, useEffect, useRef } from 'react';
import { getAppId } from '../../components/shared/utils/config/config';
import { observer } from 'mobx-react-lite';
import './copy-trading.scss';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Box, Button, TextField, Typography, Paper, CircularProgress, IconButton } from '@mui/material';
import { Refresh, Close } from '@mui/icons-material';

// Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getAccountTokens = async (loginId: string) => {
  const docRef = doc(db, 'authTokens', loginId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().tokens : [];
};

const saveAccountTokens = async (loginId: string, tokens: string[]) => {
  const docRef = doc(db, 'authTokens', loginId);
  await setDoc(docRef, { tokens }, { merge: true });
};

const CopyTrading2 = observer(() => {
  const [currentLoginId, setCurrentLoginId] = useState<string | null>(null);
  const [isRealTrading, setIsRealTrading] = useState(
  localStorage.getItem('tradingMode') === 'real'
);
  const [traderTokens, setTraderTokens] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState('');
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('acct1');
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  const tokenListContainerRef = useRef<HTMLDivElement>(null);

  // Load tokens from Firestore
  const loadTokens = async () => {
    if (!currentLoginId) return;
    try {
      const tokens = await getAccountTokens(currentLoginId);
      setTraderTokens(tokens);
    } catch (error) {
      console.error("Error loading tokens:", error);
    }
  };

  // Mask token for display
  const maskToken = (token: string) => {
    if (typeof token !== 'string') return 'Invalid Token';
    if (token.length <= 8) return token;
    return token.substring(0, 4) + '...' + token.substring(token.length - 4);
  };

  // Add token
  const handleAddToken = async () => {
    if (!currentLoginId) {
      alert('Please authorize your main account first');
      return;
    }

    const token = tokenInput.trim();
    if (!token) return;

    try {
      const existingTokens = await getAccountTokens(currentLoginId);
      if (existingTokens.some(t => t === token)) {
        alert('This token is already added');
        return;
      }

      const updatedTokens = [...existingTokens, token];
      await saveAccountTokens(currentLoginId, updatedTokens);
      setTraderTokens(updatedTokens);
      setTokenInput('');
    } catch (error) {
      console.error('Error adding token:', error);
      alert('Failed to add token');
    }
  };

  // Remove token
  const handleRemoveToken = async (index: number) => {
    if (!currentLoginId) return;
    
    try {
      const updatedTokens = traderTokens.filter((_, i) => i !== index);
      await saveAccountTokens(currentLoginId, updatedTokens);
      setTraderTokens(updatedTokens);
    } catch (error) {
      console.error('Error removing token:', error);
      alert('Failed to remove token');
    }
  };

  // Handle account selection change
  const handleAccountSelection = (selected: string) => {
    setSelectedAccount(selected);
    sessionStorage.setItem("selectedAccount", selected);
    
    if (websocket) {
      websocket.close();
    }
    
    const newAuthToken = selected === 'acct1' 
      ? sessionStorage.getItem("token1") || ''
      : sessionStorage.getItem("token2") || '';
    setAuthToken(newAuthToken);
    
    const appId = getAppId();
    const newWebsocket = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${appId}`);
    
    newWebsocket.addEventListener('open', (event) => {
      console.log('Websocket connection established:', event);
      setIsWebSocketConnected(true);
      
      const token = localStorage.getItem('authToken') || '';
      setAuthToken(token);

      if (!token) {
        console.error('WebSocket connection failed: No auth token');
        return;
      }

      const authPayload = JSON.stringify({
        authorize: token,
        req_id: 9999
      });
      
      newWebsocket.send(authPayload);
    });
    
    newWebsocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      if (data.msg_type === 'authorize' && data.req_id === 9999) {
        console.log('Main account authorization successful:', data);
        setIsAuthenticated(true);
        setCurrentLoginId(data.authorize.loginid);
        loadTokens();
        
        const balanceRequest = JSON.stringify({
          balance: 1,
          account: 'current',
          subscribe: 1,
          passthrough: {},
          req_id: 1
        });
        
        newWebsocket.send(balanceRequest);
        
        if (selected === 'acct1') {
          const acct1 = sessionStorage.getItem("acct1");
          setAccountValue(acct1 || "");
        } else if (selected === 'acct2') {
          const acct2 = sessionStorage.getItem("acct2");
          setAccountValue(acct2 || "");
        }
      }
      else if (data.msg_type === 'balance') {
        if (data.error) {
          console.error('Balance request error:', data.error);
          setBalance('');
          
          if (selected === 'acct1') {
            const acct1 = sessionStorage.getItem("acct1");
            const cur1 = sessionStorage.getItem("cur1");
            setAccountValue(acct1 ? `${acct1}${cur1}` : "create or/switch to demo");
          } else if (selected === 'acct2') {
            const acct2 = sessionStorage.getItem("acct2");
            const cur2 = sessionStorage.getItem("cur2");
            setAccountValue(acct2 ? `${acct2}${cur2}` : "Demo Acct - No Account");
          }
        } else {
          if (selected === 'acct1') {
            const acct1 = sessionStorage.getItem("acct1");
            const cur1 = sessionStorage.getItem("cur1");
            setAccountValue(acct1 || "");
            setBalance(`Balance: ${data.balance.balance} USD`);
          } else if (selected === 'acct2') {
            const acct2 = sessionStorage.getItem("acct2");
            const cur2 = sessionStorage.getItem("cur2");
            setAccountValue(acct2 || "");
            setBalance(`Balance: ${data.balance.balance} USD`);
          }
        }
      }
    });
    
    newWebsocket.addEventListener('close', (event) => {
      console.log('websocket connection closed: ', event);
      setIsAuthenticated(false);
      setIsWebSocketConnected(false);
    });
    
    newWebsocket.addEventListener('error', (event) => {
      console.log('an error happened in our websocket connection', event);
    });
    
    setWebsocket(newWebsocket);
  };

  // Initialize on component mount
  useEffect(() => {
    const initialize = async () => {
      const storedAccount = sessionStorage.getItem("selectedAccount") || 'acct1';
      setSelectedAccount(storedAccount);
      
      const token = localStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
        handleAccountSelection(storedAccount);
      } else {
        console.error('No auth token found');
      }
    };
  
    initialize();
  }, []);
  
  useEffect(() => {
    if (currentLoginId && isAuthenticated) {
      loadTokens();
    }
  }, [currentLoginId, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tradingMode', isRealTrading ? 'real' : 'demo');
  }, [isRealTrading]);

  return (
    <div className='copy-trading'>
      <div className='copy-trading__content'>
        <div className='top-navbar'>   
          <div className='inner-nav'>
            <div className='row'></div>
            <div className='balance'>
              <p>{accountValue}</p>
              <p>{balance}</p>
            </div>

            <div className='status'>
              <div className='status-item'>
                <span>Status</span>
                <div 
                  id="websocket-status-indicator" 
                  className={`status-indicator ${isWebSocketConnected ? 'online' : 'offline'}`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className='tab-container'>
          <div className='tab-content'>
            <div className='trading-hub'>
              <div className='hub-content'>
                <div className='cards-grid'>
                  <div className='hub-card config-card'>
                    <div className='card-shine'></div>
                    <div className='hub-card-header'>
                      <div className='card-title'>TRADING SETUP</div>
                      <div className='trading-mode-switch'>
                        <span className='mode-label'>OFF</span>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={isRealTrading}
                            onChange={() => setIsRealTrading(!isRealTrading)}
                          />
                          <span className="slider round"></span>
                        </label>
                        <span className='mode-label'>ON</span>
                      </div>
                      <div className='card-controls'>
                        <div className='control-dot'></div>
                        <div className='control-dot'></div>
                        <div className='control-dot'></div>
                      </div>
                    </div>
                    <div className='hub-card-content'>
                      <div className='trader-selection'>
                        <label className='neon-label'>MANAGE TRADER TOKENS</label>
                        <div className='token-input-group'>
                          <input 
                            type="text" 
                            className='futuristic-input' 
                            placeholder="Enter trader auth token"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                          />
                          <button 
                            className='token-action-btn'
                            onClick={handleAddToken}
                          >
                            Add
                          </button>
                          <button 
                            className='token-action-btn sync-btn'
                            onClick={() => loadTokens()}
                          >
                            Refresh <Refresh style={{ fontSize: '1.2rem' }} />
                          </button>
                        </div>
                        <div className='token-list-container' ref={tokenListContainerRef}>
                          {traderTokens.length === 0 ? (
                            <div className='empty-list-message'>No tokens added yet</div>
                          ) : (
                            traderTokens.map((token, index) => (
                              <div key={index} className='token-item'>
                                <div>
                                  <span className='token-text'>{maskToken(token)}</span>
                                </div>
                                <span 
                                  className='remove-token' 
                                  title="Remove Token"
                                  onClick={() => handleRemoveToken(index)}
                                >
                                  ×
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='status-bar'>
                  <div className='status-item'>
                    <span className='status-label'>CONNECTION:</span>
                    <span className='status-value good'>SECURE</span>
                  </div>
                  <div className='status-item'>
                    <span className='status-label'>LATENCY:</span>
                    <span className='status-value good'>23ms</span>
                  </div>
                  <div className='status-item'>
                    <span className='status-label'>LAST UPDATE:</span>
                    <span className='status-value'>JUST NOW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CopyTrading2;