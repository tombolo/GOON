import React, { useState, useEffect, useRef } from 'react';
import styles from './CopyTradingPage.module.scss';

interface TradeData {
    contract_id: number;
    buy_price: number;
    currency: string;
    symbol: string;
    contract_type: string;
    duration: number;
    duration_unit: string;
    amount: number;
}

const CopyTradingDashboard: React.FC = () => {
    const [isDemoToReal, setIsDemoToReal] = useState(false);
    const [isCopyTrading, setIsCopyTrading] = useState(false);
    const [tokens, setTokens] = useState<string[]>([]);
    const [loginId, setLoginId] = useState('---');
    const [balance, setBalance] = useState('0.00 USD');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessage2, setStatusMessage2] = useState('');
    const [statusColor, setStatusColor] = useState('#4CAF50');
    const [statusColor2, setStatusColor2] = useState('#4CAF50');
    const [tokenInput, setTokenInput] = useState('');
    const [masterToken, setMasterToken] = useState('');
    const [isMasterConnected, setIsMasterConnected] = useState(false);
    const [copiedTrades, setCopiedTrades] = useState<TradeData[]>([]);

    const masterWsRef = useRef<WebSocket | null>(null);
    const followerWsRefs = useRef<{ [key: string]: WebSocket }>({});

    useEffect(() => {
        const storedTokens = JSON.parse(localStorage.getItem('copyTokensArray') || '[]');
        setTokens(storedTokens);

        const demoToReal = localStorage.getItem('demo_to_real') === 'true';
        setIsDemoToReal(demoToReal);

        const copyTrading = localStorage.getItem('iscopyTrading') === 'true';
        setIsCopyTrading(copyTrading);

        const storedMaster = localStorage.getItem('masterToken') || '';
        setMasterToken(storedMaster);

        if (copyTrading && storedMaster) {
            initializeMasterConnection(storedMaster);
        }

        return () => {
            // Clean up WebSocket connections on unmount
            if (masterWsRef.current) {
                masterWsRef.current.close();
            }
            Object.values(followerWsRefs.current).forEach(ws => ws.close());
        };
    }, []);

    const initializeMasterConnection = (token: string) => {
        const APP_ID = localStorage.getItem('APP_ID');
        masterWsRef.current = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${APP_ID}`);

        masterWsRef.current.addEventListener("open", () => {
            authorize(masterWsRef.current!, token, true);
        });

        masterWsRef.current.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.error) {
                console.error("Master connection error:", data.error);
                setIsMasterConnected(false);
                return;
            }

            if (data.authorize) {
                setIsMasterConnected(true);
                subscribeToPortfolio();
                getBalance(masterWsRef.current!, data.authorize.loginid);
            }

            if (data.portfolio) {
                handleNewTrades(data.portfolio);
            }

            if (data.balance) {
                setBalance(`${data.balance.balance} ${data.balance.currency}`);
            }
        });

        masterWsRef.current.addEventListener("close", () => {
            setIsMasterConnected(false);
        });
    };

    const initializeFollowerConnections = () => {
        tokens.forEach(token => {
            if (!followerWsRefs.current[token]) {
                const APP_ID = localStorage.getItem('APP_ID');
                const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${APP_ID}`);

                ws.addEventListener("open", () => {
                    authorize(ws, token, false);
                });

                ws.addEventListener("message", (event) => {
                    const data = JSON.parse(event.data);
                    if (data.error) {
                        console.error(`Follower ${token} error:`, data.error);
                    }
                });

                followerWsRefs.current[token] = ws;
            }
        });
    };

    const authorize = (ws: WebSocket, token: string, isMaster: boolean) => {
        const msg = JSON.stringify({
            authorize: token,
            req_id: isMaster ? 1001 : 2000 + Math.floor(Math.random() * 1000)
        });
        ws.send(msg);
    };

    const subscribeToPortfolio = () => {
        if (masterWsRef.current) {
            const msg = JSON.stringify({
                "portfolio": 1,
                "req_id": 3001
            });
            masterWsRef.current.send(msg);
        }
    };

    const handleNewTrades = (portfolio: any) => {
        // Filter for new open positions
        const newTrades = portfolio.filter((trade: any) =>
            trade.contract_id && !copiedTrades.some(t => t.contract_id === trade.contract_id)
        );

        if (newTrades.length > 0 && isCopyTrading) {
            setCopiedTrades([...copiedTrades, ...newTrades]);
            replicateTrades(newTrades);
        }
    };

    const replicateTrades = (trades: TradeData[]) => {
        initializeFollowerConnections();

        trades.forEach(trade => {
            tokens.forEach(token => {
                const ws = followerWsRefs.current[token];
                if (ws && ws.readyState === WebSocket.OPEN) {
                    const msg = JSON.stringify({
                        "buy": trade.contract_id,
                        "price": trade.buy_price,
                        "parameters": {
                            "amount": trade.amount,
                            "basis": "stake",
                            "contract_type": trade.contract_type,
                            "currency": trade.currency,
                            "duration": trade.duration,
                            "duration_unit": trade.duration_unit,
                            "symbol": trade.symbol
                        },
                        "req_id": 4000 + Math.floor(Math.random() * 1000)
                    });
                    ws.send(msg);
                }
            });
        });
    };

    const showMessage = (message: string, isError = false, isPrimary = true) => {
        if (isPrimary) {
            setStatusMessage(message);
            setStatusColor(isError ? '#FF444F' : '#4CAF50');
        } else {
            setStatusMessage2(message);
            setStatusColor2(isError ? '#FF444F' : '#4CAF50');
        }

        setTimeout(() => {
            if (isPrimary) {
                setStatusMessage('');
            } else {
                setStatusMessage2('');
            }
        }, 2000);
    };

    const handleDemoToReal = () => {
        const newIsDemoToReal = !isDemoToReal;
        setIsDemoToReal(newIsDemoToReal);
        localStorage.setItem('demo_to_real', String(newIsDemoToReal));

        const accountsList = JSON.parse(localStorage.getItem('accountsList') || '{}');
        const keys = Object.keys(accountsList);

        if (newIsDemoToReal) {
            if (keys.length > 0 && !keys[0].startsWith("VR")) {
                const value = accountsList[keys[0]];
                const storedArray = JSON.parse(localStorage.getItem('copyTokensArray') || '[]');
                storedArray.push(value);
                localStorage.setItem('copyTokensArray', JSON.stringify(storedArray));
                setTokens(storedArray);

                showMessage("Demo to real set successfully");
            } else {
                showMessage("No real account found!", true);
                setIsDemoToReal(false);
                localStorage.setItem('demo_to_real', 'false');
            }
        } else {
            const keys = Object.keys(accountsList);
            const key = keys[0];
            const value = accountsList[key];
            let storedArray = JSON.parse(localStorage.getItem('copyTokensArray') || '[]');
            storedArray = storedArray.filter((token: string) => token !== value);
            localStorage.setItem('copyTokensArray', JSON.stringify(storedArray));
            setTokens(storedArray);

            showMessage("Stopped successfully", true);
        }
    };

    const handleCopyTrading = () => {
        const newIsCopyTrading = !isCopyTrading;
        setIsCopyTrading(newIsCopyTrading);
        localStorage.setItem('iscopyTrading', String(newIsCopyTrading));

        if (newIsCopyTrading && masterToken) {
            initializeMasterConnection(masterToken);
            initializeFollowerConnections();
            showMessage("Copy trading started successfully", false, false);
        } else if (!newIsCopyTrading) {
            if (masterWsRef.current) {
                masterWsRef.current.close();
            }
            showMessage("Copy trading stopped successfully", true, false);
        }
    };

    const handleAddToken = () => {
        if (!tokenInput.trim()) return;

        const storedArray = JSON.parse(localStorage.getItem('copyTokensArray') || '[]');
        if (storedArray.includes(tokenInput)) {
            showMessage("Token already exists", true, false);
        } else {
            storedArray.push(tokenInput);
            localStorage.setItem('copyTokensArray', JSON.stringify(storedArray));
            setTokens(storedArray);
            setTokenInput('');
            showMessage("Token has been added", false, false);

            if (isCopyTrading) {
                initializeFollowerConnections();
            }
        }
    };

    const handleDeleteToken = (index: number) => {
        const newTokens = [...tokens];
        const removedToken = newTokens[index];
        newTokens.splice(index, 1);
        setTokens(newTokens);
        localStorage.setItem('copyTokensArray', JSON.stringify(newTokens));

        // Close connection for removed token
        if (followerWsRefs.current[removedToken]) {
            followerWsRefs.current[removedToken].close();
            delete followerWsRefs.current[removedToken];
        }

        showMessage("Token removed!", false, false);
    };

    const handleSetMasterToken = () => {
        if (!tokenInput.trim()) return;

        setMasterToken(tokenInput);
        localStorage.setItem('masterToken', tokenInput);

        if (isCopyTrading) {
            initializeMasterConnection(tokenInput);
        }

        showMessage("Master token set successfully", false, false);
        setTokenInput('');
    };

    const getBalance = (ws: WebSocket, loginid: string) => {
        const msg = JSON.stringify({
            balance: 1,
            loginid,
            req_id: 5000 + Math.floor(Math.random() * 1000)
        });
        if (ws.readyState !== WebSocket.CLOSED) {
            ws.send(msg);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.backgroundEffect}></div>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <button
                        className={`${styles.btn} ${isDemoToReal ? styles.btnRed : styles.btnGreen}`}
                        onClick={handleDemoToReal}
                    >
                        {isDemoToReal ? 'Stop Demo to Real' : 'Start Demo to Real'}
                    </button>
                    <div className={styles.connectionStatus}>
                        Master: <span style={{ color: isMasterConnected ? '#4CAF50' : '#FF444F' }}>
                            {isMasterConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div className={styles.youtubeIcon}>
                        <img src="https://img.icons8.com/ios-filled/50/fa314a/youtube-play.png" alt="Tutorial" />
                        <div>Tutorial</div>
                    </div>
                </div>

                <div className={styles.replicatorToken}>
                    <span>
                        <h5>{loginId}</h5>
                        <p
                            className={`${styles.statusMsg} ${statusMessage ? styles.show : ''}`}
                            style={{ color: statusColor }}
                        >
                            {statusMessage}
                        </p>
                    </span>
                    <span style={{ color: '#FFD700' }}>{balance}</span>
                </div>

                <h5 className={styles.sectionTitle}>Copy Trading Configuration</h5>

                <div className={styles.card}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            className={styles.formControl}
                            placeholder="Enter Master token"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                        />
                        <button
                            className={`${styles.btn} ${styles.btnCyan}`}
                            onClick={handleSetMasterToken}
                        >
                            Set Master
                        </button>
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            className={styles.formControl}
                            placeholder="Enter Client token"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                        />
                        <button
                            className={`${styles.btn} ${isCopyTrading ? styles.btnRed : styles.btnGreen}`}
                            onClick={handleCopyTrading}
                        >
                            {isCopyTrading ? 'Stop Copy Trading' : 'Start Copy Trading'}
                        </button>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={`${styles.btn} ${styles.btnCyan}`} onClick={handleAddToken}>
                            Add Follower
                        </button>
                        <button className={`${styles.btn} ${styles.btnCyan}`} onClick={() => { }}>
                            Sync &#x21bb;
                        </button>
                    </div>
                    <p
                        className={`${styles.statusMsg} ${statusMessage2 ? styles.show : ''}`}
                        style={{ color: statusColor2 }}
                    >
                        {statusMessage2}
                    </p>
                </div>

                <div className={styles.card}>
                    <h6 className={styles.sectionSubtitle}>Master Account</h6>
                    <div className={styles.masterAccount}>
                        {masterToken ? (
                            <div className={styles.tokenDisplay}>
                                <span>{masterToken}</span>
                                <span className={styles.connectionIndicator}
                                    style={{ backgroundColor: isMasterConnected ? '#4CAF50' : '#FF444F' }}>
                                </span>
                            </div>
                        ) : (
                            <small className={styles.textMuted}>No master account configured</small>
                        )}
                    </div>

                    <h6 className={styles.sectionSubtitle}>Follower Accounts: {tokens.length}</h6>
                    <small className={styles.textMuted}>
                        {tokens.length === 0 ? 'No follower accounts added yet' : ''}
                    </small>
                    <div className={styles.tableContainer}>
                        <table className={styles.tokenTable}>
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Status</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map((token, index) => (
                                    <tr key={index}>
                                        <td>{token}</td>
                                        <td>
                                            <span className={styles.connectionIndicator}
                                                style={{
                                                    backgroundColor: followerWsRefs.current[token]?.readyState === WebSocket.OPEN
                                                        ? '#4CAF50' : '#FF444F'
                                                }}>
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={styles.deleteBtn}
                                                onClick={() => handleDeleteToken(index)}
                                            >
                                                X
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {copiedTrades.length > 0 && (
                    <div className={styles.card}>
                        <h6 className={styles.sectionSubtitle}>Recent Copied Trades</h6>
                        <div className={styles.tableContainer}>
                            <table className={styles.tokenTable}>
                                <thead>
                                    <tr>
                                        <th>Contract ID</th>
                                        <th>Symbol</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {copiedTrades.slice(-5).reverse().map((trade, index) => (
                                        <tr key={index}>
                                            <td>{trade.contract_id}</td>
                                            <td>{trade.symbol}</td>
                                            <td>{trade.contract_type}</td>
                                            <td>{trade.amount}</td>
                                            <td>{trade.buy_price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CopyTradingDashboard;