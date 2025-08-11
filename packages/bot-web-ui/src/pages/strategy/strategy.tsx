import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './strategy.module.scss';

// Strategy component types
type TickData = {
    value: number;
    isEven: boolean;
    isOver: boolean;
    timestamp: number;
};

type StrategyCardProps = {
    tickData?: TickData[];
};

// Main Strategy Component
const Strategy = () => {
    const [activeTab, setActiveTab] = useState('over-under');
    const [tickData, setTickData] = useState<TickData[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Simulate live tick data
    useEffect(() => {
        const generateTickData = () => {
            const data: TickData[] = [];
            for (let i = 0; i < 20; i++) {
                data.push({
                    value: Math.floor(Math.random() * 100),
                    isEven: i % 2 === 0,
                    isOver: Math.random() > 0.5,
                    timestamp: Date.now() - i * 1000
                });
            }
            setTickData(data);
        };

        generateTickData();
        const interval = setInterval(() => {
            generateTickData();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleTabChange = (tab: string) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveTab(tab);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <div className="container">
            <div className="backgroundAnimation"></div>

            <div className="contentWrapper">
                <motion.h1
                    className="title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="titleGradient">Quantum Trading Strategies</span>
                    <div className="titleUnderline"></div>
                </motion.h1>

                <div className="tabContainer">
                    <button
                        className={`tabButton ${activeTab === 'over-under' ? 'active' : ''}`}
                        onClick={() => handleTabChange('over-under')}
                    >
                        <span className="tabIcon">📈</span> Over/Under
                    </button>
                    <button
                        className={`tabButton ${activeTab === 'even-odd' ? 'active' : ''}`}
                        onClick={() => handleTabChange('even-odd')}
                    >
                        <span className="tabIcon">🔢</span> Even/Odd
                    </button>
                    <button
                        className={`tabButton ${activeTab === 'trends' ? 'active' : ''}`}
                        onClick={() => handleTabChange('trends')}
                    >
                        <span className="tabIcon">📊</span> Trend Analysis
                    </button>
                </div>

                <AnimatePresence>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="strategyContent"
                    >
                        {activeTab === 'over-under' && (
                            <OverUnderStrategy tickData={tickData} />
                        )}
                        {activeTab === 'even-odd' && (
                            <EvenOddStrategy tickData={tickData} />
                        )}
                        {activeTab === 'trends' && (
                            <TrendAnalysisStrategy />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Strategy Components
const OverUnderStrategy: React.FC<StrategyCardProps> = ({ tickData = [] }) => {
    return (
        <div className="strategySection">
            <div className="liveDataVisualization">
                <h3 className="visualizationTitle">Live Tick Movement</h3>
                <div className="tickChart">
                    {tickData.map((tick, index) => (
                        <motion.div
                            key={index}
                            className={`tickBar ${tick.isOver ? 'overBar' : 'underBar'}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${tick.value}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div className="tickValue">{tick.value}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="strategyGrid">
                <motion.div
                    className="strategyCard overCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">🟢</div>
                        <h3 className="cardTitle">Quantum Over Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Green momentum</span> must be above prediction threshold
                            <div className="probabilityIndicator" data-probability="85%"></div>
                        </li>
                        <li>
                            <span className="highlight">Red resistance</span> must show downward trend
                            <div className="probabilityIndicator" data-probability="78%"></div>
                        </li>
                        <li>
                            <span className="highlight">Entry point:</span> Optimal when volatility index &lt; 30
                            <div className="probabilityIndicator" data-probability="92%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Quantum Pattern Detected:</div>
                        <p>When predicting 75, enter at 70 with 3 consecutive green ticks above 70</p>
                    </div>
                    <div className="successRate">
                        <div className="rateMeter">
                            <div className="rateFill" style={{ width: '87%' }}></div>
                        </div>
                        <span>87% Success Rate</span>
                    </div>
                </motion.div>

                <motion.div
                    className="strategyCard underCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(239, 68, 68, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">🔴</div>
                        <h3 className="cardTitle">Neural Under Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Red pressure</span> must maintain below prediction
                            <div className="probabilityIndicator" data-probability="82%"></div>
                        </li>
                        <li>
                            <span className="highlight">Green pullback</span> should not exceed 15% threshold
                            <div className="probabilityIndicator" data-probability="75%"></div>
                        </li>
                        <li>
                            <span className="highlight">Entry point:</span> When RSI shows oversold conditions
                            <div className="probabilityIndicator" data-probability="89%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Neural Pattern Example:</div>
                        <p>If predicting 25, enter at 30 with MACD showing downward crossover</p>
                    </div>
                    <div className="successRate">
                        <div className="rateMeter">
                            <div className="rateFill" style={{ width: '83%' }}></div>
                        </div>
                        <span>83% Success Rate</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const EvenOddStrategy: React.FC<StrategyCardProps> = ({ tickData = [] }) => {
    return (
        <div className="strategySection">
            <div className="parityVisualization">
                <h3 className="visualizationTitle">Parity Distribution</h3>
                <div className="parityChart">
                    {tickData.map((tick, index) => (
                        <motion.div
                            key={index}
                            className={`parityDot ${tick.isEven ? 'evenDot' : 'oddDot'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 100,
                                damping: 10,
                                delay: index * 0.1
                            }}
                        >
                            {tick.isEven ? 'E' : 'O'}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="strategyGrid">
                <motion.div
                    className="strategyCard evenCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(59, 130, 246, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">🔵</div>
                        <h3 className="cardTitle">Fractal Even Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Both bars</span> must show even Fibonacci levels
                            <div className="probabilityIndicator" data-probability="88%"></div>
                        </li>
                        <li>
                            <span className="highlight">Cluster confirmation:</span> 3+ even numbers &lt;15%
                            <div className="probabilityIndicator" data-probability="81%"></div>
                        </li>
                        <li>
                            <span className="highlight">Volume spike</span> on even numbers confirms signal
                            <div className="probabilityIndicator" data-probability="90%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Fractal Example:</div>
                        <p>Bars at 22 (even) and 36 (even) with volume spike on 24, 28, 32</p>
                    </div>
                    <div className="successRate">
                        <div className="rateMeter">
                            <div className="rateFill" style={{ width: '85%' }}></div>
                        </div>
                        <span>85% Success Rate</span>
                    </div>
                </motion.div>

                <motion.div
                    className="strategyCard oddCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(139, 92, 246, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">🟣</div>
                        <h3 className="cardTitle">Harmonic Odd Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Both bars</span> must align with odd harmonics
                            <div className="probabilityIndicator" data-probability="86%"></div>
                        </li>
                        <li>
                            <span className="highlight">Price rejection</span> at odd pivot points
                            <div className="probabilityIndicator" data-probability="79%"></div>
                        </li>
                        <li>
                            <span className="highlight">Time frames</span> must sync with odd intervals
                            <div className="probabilityIndicator" data-probability="91%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Harmonic Example:</div>
                        <p>Bars at 35 (odd) and 47 (odd) with rejection at 37, 41, 43</p>
                    </div>
                    <div className="successRate">
                        <div className="rateMeter">
                            <div className="rateFill" style={{ width: '84%' }}></div>
                        </div>
                        <span>84% Success Rate</span>
                    </div>
                </motion.div>
            </div>

            <div className="importantNote">
                <div className="warningIcon">⚠️</div>
                <div>
                    <strong>QUANTUM RULE:</strong> Only trade when parity divergence exceeds 25% and time-alignment confirms
                </div>
            </div>
        </div>
    );
};

const TrendAnalysisStrategy: React.FC = () => {
    return (
        <div className="strategySection">
            <div className="trendVisualization">
                <h3 className="visualizationTitle">3D Trend Matrix</h3>
                <div className="trendCube">
                    {[1, 2, 3, 4, 5, 6].map((side) => (
                        <div key={side} className="cubeSide" data-side={side}>
                            <div className="trendLine"></div>
                            <div className="trendLine"></div>
                            <div className="trendLine"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="strategyGrid">
                <motion.div
                    className="strategyCard trendUpCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">🚀</div>
                        <h3 className="cardTitle">Momentum Surge Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Volume acceleration</span> with price breakout
                            <div className="probabilityIndicator" data-probability="89%"></div>
                        </li>
                        <li>
                            <span className="highlight">3 consecutive</span> higher highs confirmation
                            <div className="probabilityIndicator" data-probability="84%"></div>
                        </li>
                        <li>
                            <span className="highlight">EMA cross</span> on 5/15 minute timeframe
                            <div className="probabilityIndicator" data-probability="92%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Surge Pattern:</div>
                        <p>Breakout above 75 with volume 2x average and RSI &lt; 60</p>
                    </div>
                </motion.div>

                <motion.div
                    className="strategyCard trendDownCard"
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(239, 68, 68, 0.2)' }}
                >
                    <div className="cardHeader">
                        <div className="cardIcon">📉</div>
                        <h3 className="cardTitle">Capitation Wave Strategy</h3>
                    </div>
                    <ul className="strategyList">
                        <li>
                            <span className="highlight">Volume expansion</span> on downward moves
                            <div className="probabilityIndicator" data-probability="87%"></div>
                        </li>
                        <li>
                            <span className="highlight">Lower lows</span> with increasing spread
                            <div className="probabilityIndicator" data-probability="82%"></div>
                        </li>
                        <li>
                            <span className="highlight">Bollinger band</span> exit signal confirmation
                            <div className="probabilityIndicator" data-probability="90%"></div>
                        </li>
                    </ul>
                    <div className="example">
                        <div className="exampleLabel">Wave Example:</div>
                        <p>Breakdown below 25 with volume spike and BB %B &lt; 0.2</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Strategy;