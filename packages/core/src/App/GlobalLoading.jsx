import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './GlobalLoading.scss';
import LOGO from './Logo/LOGO10.png';

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    const [showElements, setShowElements] = useState(false);
    const [marketData, setMarketData] = useState({
        eurusd: `1.08${Math.floor(Math.random() * 9)}`,
        btcusd: `6${Math.floor(Math.random() * 9000) + 1000}`,
        volatility: `75.${Math.floor(Math.random() * 9)}%`,
    });

    useEffect(() => {
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

        // Animated entrance
        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(marketInterval);
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
            {/* Geometric background elements */}
            <div className='geometric-layer'>
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`shape shape-${i % 3}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0, 0.1, 0],
                            scale: [0.8, 1, 0.8],
                            rotate: [0, 180],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: 'linear',
                        }}
                    />
                ))}
            </div>

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
                <img src={LOGO} alt='Logo' className='logo' />
                <motion.div
                    className='logo-underline'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                />
            </motion.div>

            {showElements && (
                <div className='content-wrapper'>
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
                                        <stop offset='0%' stopColor='#4A6CF7' />
                                        <stop offset='100%' stopColor='#8A63F2' />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    d={chartPath}
                                    stroke='url(#chartGradient)'
                                    strokeWidth='2'
                                    fill='none'
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
                            <div className='progress-labels'>
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
        </div>
    );
};

export default GlobalLoading;
