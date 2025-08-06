import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    const [showElements, setShowElements] = useState(false);

    useEffect(() => {
        // 10 second loading sequence
        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= 100) clearInterval(timer);
                return newProgress;
            });
        }, 100);

        // Animated entrance
        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 500);

        return () => clearInterval(timer);
    }, []);

    // Trading chart line animation
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
        <LoadingContainer>
            <AnimatedBackground />

            <LogoContainer
                initial={{ opacity: 0, y: -20 }}
                animate={controls}
                variants={{
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                }}
            >
                <img src='/logo.svg' alt='Deriv Logo' style={{ width: 100 }} />
            </LogoContainer>

            <MainContent>
                {showElements && (
                    <>
                        <TradingChart>
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
                        </TradingChart>

                        <MarketData>
                            <DataItem>
                                <Label>EUR/USD</Label>
                                <Value
                                    animate={{ color: ['#00D2FF', '#FF444F'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    1.085{Math.floor(Math.random() * 9)}
                                </Value>
                            </DataItem>
                            <DataItem>
                                <Label>BTC/USD</Label>
                                <Value
                                    animate={{ color: ['#FF444F', '#00D2FF'] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    6{Math.floor(Math.random() * 9000) + 1000}
                                </Value>
                            </DataItem>
                            <DataItem>
                                <Label>Volatility</Label>
                                <Value>75.{Math.floor(Math.random() * 9)}%</Value>
                            </DataItem>
                        </MarketData>
                    </>
                )}
            </MainContent>

            <ProgressContainer>
                <ProgressBar
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 10, ease: 'linear' }}
                />
                <ProgressText>{progress}%</ProgressText>
            </ProgressContainer>

            <LoadingText animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                Preparing your trading experience...
            </LoadingText>

            <TradingBots>
                {Array.from({ length: 5 }).map((_, i) => (
                    <BotIcon
                        key={i}
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
                    </BotIcon>
                ))}
            </TradingBots>
        </LoadingContainer>
    );
};

// Styled components
const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: #fff;
    overflow: hidden;
    position: relative;
`;

const AnimatedBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, rgba(255, 68, 79, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(0, 210, 255, 0.1) 0%, transparent 20%);
    z-index: 0;
`;

const LogoContainer = styled(motion.div)`
    margin-bottom: 2rem;
    z-index: 1;
`;

const MainContent = styled.div`
    width: 80%;
    max-width: 800px;
    z-index: 1;
`;

const TradingChart = styled.div`
    background: rgba(15, 32, 39, 0.7);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MarketData = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
`;

const DataItem = styled.div`
    background: rgba(15, 32, 39, 0.7);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    min-width: 120px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Label = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
`;

const Value = styled(motion.div)`
    font-size: 1.2rem;
    font-weight: 600;
    font-family: 'DIN Next', sans-serif;
`;

const ProgressContainer = styled.div`
    width: 80%;
    max-width: 500px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin: 2rem 0;
    position: relative;
    overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
    height: 100%;
    background: linear-gradient(90deg, #ff444f, #00d2ff);
    border-radius: 4px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        animation: ${keyframes`
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    `} 1.5s infinite;
    }
`;

const ProgressText = styled.div`
    position: absolute;
    right: -40px;
    top: -5px;
    font-size: 0.9rem;
`;

const LoadingText = styled(motion.div)`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    text-align: center;
    background: linear-gradient(90deg, #fff, #00d2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
`;

const TradingBots = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

const BotIcon = styled(motion.div)`
    font-size: 1.5rem;
    opacity: 0;
`;

export default GlobalLoading;
