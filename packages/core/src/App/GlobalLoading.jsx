import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './GlobalLoading.scss';
import LOGO from './Logo/LOGO10.png';

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    const [showElements, setShowElements] = useState(false);
    const [hackingText, setHackingText] = useState('');
    const [binaryRain, setBinaryRain] = useState([]);
    const [marketData, setMarketData] = useState({
        eurusd: `1.08${Math.floor(Math.random() * 9)}`,
        btcusd: `6${Math.floor(Math.random() * 9000) + 1000}`,
        volatility: `75.${Math.floor(Math.random() * 9)}%`,
    });

    // Hacking phrases for the typing effect
    const hackingPhrases = [
        'Initializing system...',
        'Bypassing security protocols...',
        'Accessing mainframe...',
        'Decrypting data streams...',
        'Establishing secure connection...',
        'Loading crypto modules...',
        'Synchronizing market data...',
        'Compiling trading algorithms...',
        'Finalizing encryption...',
        'Launching application...',
    ];

    useEffect(() => {
        // Initialize binary rain
        const initialBinary = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            value: Math.random() > 0.5 ? '1' : '0',
            x: Math.random() * 100,
            delay: Math.random() * 5,
            speed: 0.5 + Math.random() * 2,
        }));
        setBinaryRain(initialBinary);

        // Update market data every 1.5 seconds
        const marketInterval = setInterval(() => {
            setMarketData({
                eurusd: `1.08${Math.floor(Math.random() * 9)}`,
                btcusd: `6${Math.floor(Math.random() * 9000) + 1000}`,
                volatility: `75.${Math.floor(Math.random() * 9)}%`,
            });
        }, 1500);

        // 10 second progress timer
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(marketInterval);
                }
                return newProgress;
            });
        }, 100);

        // Hacking text animation
        let phraseIndex = 0;
        let charIndex = 0;
        let currentPhrase = '';
        let deleteMode = false;

        const textInterval = setInterval(() => {
            if (phraseIndex >= hackingPhrases.length) return;

            if (!deleteMode) {
                // Typing mode
                if (charIndex < hackingPhrases[phraseIndex].length) {
                    currentPhrase += hackingPhrases[phraseIndex][charIndex];
                    charIndex++;
                    setHackingText(currentPhrase);
                } else {
                    // Switch to delete mode after a pause
                    setTimeout(() => {
                        deleteMode = true;
                    }, 1000);
                }
            } else {
                // Deleting mode
                if (currentPhrase.length > 0) {
                    currentPhrase = currentPhrase.slice(0, -1);
                    setHackingText(currentPhrase);
                } else {
                    // Move to next phrase
                    deleteMode = false;
                    phraseIndex++;
                    charIndex = 0;

                    // If we've shown all phrases, keep the last one
                    if (phraseIndex >= hackingPhrases.length) {
                        setHackingText('Launch complete. Ready.');
                        clearInterval(textInterval);
                    }
                }
            }
        }, 80);

        // Animated entrance
        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(marketInterval);
            clearInterval(textInterval);
        };
    }, []);

    const chartPath = `M 0,50 
                    C 50,30 100,70 150,40 
                    S 200,60 250,30 
                    S 300,70 350,50 
                    S 400,20 450,60 
                    S 500,40 550,70 
                    S 600,30 650,50 
                    S 700,80 750,40 
                    S 800,60 850,30 
                    S 900,70 950,50 
                    L 1000,50`;

    return (
        <div className='global-loading'>
            {/* Matrix-style binary rain background */}
            <div className='binary-rain'>
                {binaryRain.map(binary => (
                    <motion.div
                        key={binary.id}
                        className='binary-digit'
                        style={{ left: `${binary.x}%` }}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                            y: '100vh',
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: binary.speed * 10,
                            repeat: Infinity,
                            delay: binary.delay,
                            ease: 'linear',
                        }}
                    >
                        {binary.value}
                    </motion.div>
                ))}
            </div>

            {/* Hacking grid overlay */}
            <div className='grid-overlay'>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className='grid-line' />
                ))}
            </div>

            {/* Scanning effect */}
            <motion.div
                className='scan-line'
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main content */}
            <motion.div
                className='logo-container'
                initial={{ opacity: 0, y: -20 }}
                animate={controls}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.6,
                            ease: [0.17, 0.67, 0.24, 0.99],
                        },
                    },
                }}
            >
                <motion.div
                    animate={{
                        filter: [
                            'drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 5px #00ff00)',
                            'drop-shadow(0 0 5px #00ff00) drop-shadow(0 0 10px #00ff00)',
                            'drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 5px #00ff00)',
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <img src={LOGO} alt='Logo' className='logo' />
                </motion.div>
                <motion.div
                    className='logo-underline'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                />
            </motion.div>

            {showElements && (
                <div className='content-wrapper'>
                    {/* Hacking terminal text */}
                    <motion.div
                        className='hacking-terminal'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className='terminal-header'>
                            <span className='prompt'>root@trading-system:~$</span>
                            <span className='typing-cursor'>_</span>
                        </div>
                        <div className='terminal-text'>{hackingText}</div>
                    </motion.div>

                    {/* Data visualization */}
                    <motion.div
                        className='data-visualization'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className='chart-container'>
                            <svg width='100%' height='120' viewBox='0 0 1000 100'>
                                <defs>
                                    <linearGradient id='chartGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                        <stop offset='0%' stopColor='#00ff00' />
                                        <stop offset='100%' stopColor='#00cc00' />
                                    </linearGradient>
                                    <filter id='glow'>
                                        <feGaussianBlur stdDeviation='3.5' result='coloredBlur' />
                                        <feMerge>
                                            <feMergeNode in='coloredBlur' />
                                            <feMergeNode in='SourceGraphic' />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <motion.path
                                    d={chartPath}
                                    stroke='url(#chartGradient)'
                                    strokeWidth='2'
                                    fill='none'
                                    filter='url(#glow)'
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                                />
                                <AnimatePresence>
                                    {progress < 100 && (
                                        <motion.circle
                                            cx='0'
                                            cy='50'
                                            r='4'
                                            fill='url(#chartGradient)'
                                            initial={{ x: 0 }}
                                            animate={{
                                                x: progress * 10,
                                                y: [
                                                    50, 30, 70, 40, 60, 30, 70, 50, 20, 60, 40, 70, 30, 50, 80, 40, 60,
                                                    30, 70, 50,
                                                ][Math.floor(progress / 5)],
                                            }}
                                            transition={{
                                                duration: 0.1,
                                                ease: 'linear',
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </svg>
                        </div>

                        {/* Data points animation */}
                        <div className='data-points'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className='data-point'
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.6 + i * 0.15,
                                        duration: 0.5,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Market data ticker */}
                    <div className='market-ticker'>
                        <div className='ticker-item'>
                            <span className='ticker-label'>EUR/USD</span>
                            <motion.span
                                className='ticker-value'
                                key={`eurusd-${marketData.eurusd}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {marketData.eurusd}
                            </motion.span>
                        </div>
                        <div className='ticker-item'>
                            <span className='ticker-label'>BTC/USD</span>
                            <motion.span
                                className='ticker-value'
                                key={`btcusd-${marketData.btcusd}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {marketData.btcusd}
                            </motion.span>
                        </div>
                        <div className='ticker-item'>
                            <span className='ticker-label'>Volatility</span>
                            <motion.span
                                className='ticker-value'
                                key={`vol-${marketData.volatility}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {marketData.volatility}
                            </motion.span>
                        </div>
                    </div>

                    {/* Progress section */}
                    <div className='progress-section'>
                        <div className='progress-container'>
                            <motion.div
                                className='progress-bar'
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 10, ease: 'linear' }}
                            />
                            <div className='progress-text-container'>
                                <span className='progress-text'>{progress}%</span>
                                <span className='progress-message'>Loading application components...</span>
                            </div>
                        </div>
                    </div>

                    {/* Loading indicators */}
                    <div className='loading-indicators'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className='indicator'
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Status message */}
            <AnimatePresence>
                <motion.div
                    className='status-message'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.6 },
                    }}
                    exit={{ opacity: 0 }}
                >
                    <motion.span
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%'],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    >
                        Preparing your experience...
                    </motion.span>
                </motion.div>
            </AnimatePresence>

            {/* Hacking particles */}
            <div className='hacking-particles'>
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='particle'
                        initial={{
                            x: Math.random() * 100 + 'vw',
                            y: Math.random() * 100 + 'vh',
                            opacity: 0,
                        }}
                        animate={{
                            x: [null, Math.random() * 100 + 'vw'],
                            y: [null, Math.random() * 100 + 'vh'],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default GlobalLoading;
