import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './GlobalLoading.scss';

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    const [showElements, setShowElements] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= 100) clearInterval(timer);
                return newProgress;
            });
        }, 100);

        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 500);

        return () => clearInterval(timer);
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
            <div className='animated-background' />

            <motion.div
                className='logo-container'
                initial={{ opacity: 0, y: -20 }}
                animate={controls}
                variants={{
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                }}
            >
                <img src='/logo.svg' alt='Deriv Logo' className='logo' />
            </motion.div>

            <div className='main-content'>
                {showElements && (
                    <>
                        <div className='trading-chart'>
                            <svg width='100%' height='120' viewBox='0 0 1000 100'>
                                <motion.path
                                    d={chartPath}
                                    stroke='#FF444F'
                                    strokeWidth='3'
                                    fill='none'
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, ease: 'easeInOut' }}
                                />
                                <AnimatePresence>
                                    {progress < 100 && (
                                        <motion.circle
                                            cx='0'
                                            cy='50'
                                            r='5'
                                            fill='#FF444F'
                                            initial={{ x: 0 }}
                                            animate={{
                                                x: progress * 10,
                                                y: [
                                                    50, 30, 70, 40, 60, 30, 70, 50, 20, 60, 40, 70, 30, 50, 80, 40, 60,
                                                    30, 70, 50,
                                                ][progress / 5],
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

                        <div className='market-data'>
                            <div className='data-item'>
                                <div className='label'>EUR/USD</div>
                                <motion.div
                                    className='value'
                                    animate={{ color: ['#00D2FF', '#FF444F'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    1.085{Math.floor(Math.random() * 9)}
                                </motion.div>
                            </div>
                            <div className='data-item'>
                                <div className='label'>BTC/USD</div>
                                <motion.div
                                    className='value'
                                    animate={{ color: ['#FF444F', '#00D2FF'] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    6{Math.floor(Math.random() * 9000) + 1000}
                                </motion.div>
                            </div>
                            <div className='data-item'>
                                <div className='label'>Volatility</div>
                                <div className='value'>75.{Math.floor(Math.random() * 9)}%</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className='progress-container'>
                <motion.div
                    className='progress-bar'
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 10, ease: 'linear' }}
                />
                <div className='progress-text'>{progress}%</div>
            </div>

            <motion.div
                className='loading-text'
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Preparing your trading experience...
            </motion.div>

            <div className='trading-bots'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='bot-icon'
                        initial={{ x: -100, opacity: 0 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            y: [0, -10, 0],
                        }}
                        transition={{
                            delay: i * 0.3,
                            duration: 1,
                            y: { duration: 2, repeat: Infinity },
                        }}
                    >
                        🤖
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GlobalLoading;
