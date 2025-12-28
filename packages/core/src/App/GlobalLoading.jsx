"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GlobalLoading.module.scss';

// Import your logo - make sure the path is correct
import LOGO from './Logo/NILOTE.png';

export const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Professional color palette - sophisticated and elegant
    const colors = {
        primary: '#3B82F6',    // Professional blue
        secondary: '#8B5CF6',  // Elegant purple
        accent: '#06D6A0',     // Sophisticated teal
        gold: '#F59E0B',       // Warm gold
        silver: '#94A3B8',     // Muted silver
        dark: '#0F172A',       // Deep navy
        light: '#F8FAFC',      // Clean white
        surface: 'rgba(30, 41, 59, 0.4)', // Glass surface
        gradient1: '#6366F1',  // Indigo
        gradient2: '#EC4899',  // Pink
        gradient3: '#10B981',  // Emerald
        christmasRed: '#DC2626', // Christmas red
        christmasGreen: '#16A34A', // Christmas green
        balloonBlue: '#2563EB', // Balloon blue
        balloonRed: '#EF4444',  // Balloon red
        festiveGold: '#FBBF24', // Festive gold
        festiveSilver: '#E5E7EB' // Festive silver
    };

    // Professional loading content
    const loadingContent = {
        partnership: { text: "In partnership with", company: "DERIV", type: "partnership" },
        powered: { text: "Powered by", company: "DERIV", type: "powered" },
        journey: { text: "Simplifying your", highlight: "trading journey", type: "journey" }
    };

    // Balloon data - optimized for mobile
    const balloons = [
        // Top balloons (above content)
        { id: 1, color: colors.balloonBlue, size: 50, delay: 0, x: '10%', y: '15%', priority: 'high' },
        { id: 2, color: colors.balloonRed, size: 60, delay: 0.3, x: '90%', y: '10%', priority: 'high' },
        // Middle balloons
        { id: 3, color: colors.balloonBlue, size: 45, delay: 0.6, x: '20%', y: '25%', priority: 'medium' },
        { id: 4, color: colors.balloonRed, size: 55, delay: 0.9, x: '80%', y: '20%', priority: 'medium' },
        // Bottom balloons
        { id: 5, color: colors.balloonBlue, size: 40, delay: 1.2, x: '5%', y: '85%', priority: 'high' },
        { id: 6, color: colors.balloonRed, size: 50, delay: 1.5, x: '95%', y: '80%', priority: 'high' },
        // Extra balloons for larger screens
        { id: 7, color: colors.balloonBlue, size: 35, delay: 1.8, x: '15%', y: '40%', priority: 'low' },
        { id: 8, color: colors.balloonRed, size: 45, delay: 2.1, x: '85%', y: '35%', priority: 'low' }
    ];

    useEffect(() => {
        // Smooth progress animation with easing over 5 seconds
        const duration = 10000;
        const startTime = Date.now();
        let animationFrame;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration * 100, 100);
            
            // Custom easing function for natural feel
            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
            const easedProgress = easeOutQuart(progress / 100) * 100;
            
            setProgress(Math.min(easedProgress, 100));
            
            if (progress < 100) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Add a slight delay before completing
                setTimeout(() => setIsComplete(true), 600);
            }
        };
        
        // Start the animation
        animationFrame = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        },
        exit: { 
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const logoVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { 
            scale: 1,
            opacity: 1,
            transition: { 
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const textContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const textItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const balloonVariants = {
        float: {
            y: [0, -25, 0],
            rotate: [0, 8, -8, 0],
            transition: {
                y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                rotate: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        }
    };

    const treeVariants = {
        initial: { scale: 0, opacity: 0, x: -50 },
        animate: {
            scale: 1,
            opacity: 1,
            x: 0,
            transition: {
                duration: 1,
                ease: "backOut"
            }
        }
    };

    const ornamentVariants = {
        twinkle: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const festiveTextVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        float: {
            y: [0, -5, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const progressWidth = Math.max(5, progress);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div 
                    className={styles.globalLoading}
                    style={{
                        '--primary': colors.primary,
                        '--secondary': colors.secondary,
                        '--accent': colors.accent,
                        '--gold': colors.gold,
                        '--silver': colors.silver,
                        '--dark': colors.dark,
                        '--light': colors.light,
                        '--surface': colors.surface,
                        '--gradient1': colors.gradient1,
                        '--gradient2': colors.gradient2,
                        '--gradient3': colors.gradient3,
                        '--christmas-red': colors.christmasRed,
                        '--christmas-green': colors.christmasGreen,
                        '--balloon-blue': colors.balloonBlue,
                        '--balloon-red': colors.balloonRed,
                        '--festive-gold': colors.festiveGold,
                        '--festive-silver': colors.festiveSilver
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Professional background with subtle overlay */}
                    <div className={styles.backgroundOverlay} />
                    
                    {/* Subtle background elements */}
                    <div className={styles.backgroundElements}>
                        <div className={styles.geometricShape1} />
                        <div className={styles.geometricShape2} />
                        <div className={styles.geometricShape3} />
                    </div>

                    {/* Festive Text Overlay */}
                    <div className={styles.festiveTextContainer}>
                        <motion.div 
                            className={styles.merryChristmas}
                            variants={festiveTextVariants}
                            initial="hidden"
                            animate={["visible", "float"]}
                            style={{ transitionDelay: '0.2s' }}
                        >
                            <span className={styles.festiveText}>Merry Christmas</span>
                            <div className={styles.festiveUnderline} />
                        </motion.div>
                        
                        <motion.div 
                            className={styles.happyNewYear}
                            variants={festiveTextVariants}
                            initial="hidden"
                            animate={["visible", "float"]}
                            style={{ transitionDelay: '0.4s' }}
                        >
                            <span className={styles.festiveText}>Happy New Year</span>
                            <div className={styles.festiveUnderline} />
                        </motion.div>
                    </div>

                    {/* Christmas Tree - Better positioned for mobile */}
                    <motion.div 
                        className={styles.christmasTree}
                        variants={treeVariants}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Tree trunk */}
                        <div className={styles.treeTrunk} />
                        
                        {/* Tree layers */}
                        <div className={styles.treeLayer1} />
                        <div className={styles.treeLayer2} />
                        <div className={styles.treeLayer3} />
                        <div className={styles.treeLayer4} />
                        
                        {/* Tree ornaments */}
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament1}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                        />
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament2}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                            style={{ animationDelay: '0.5s' }}
                        />
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament3}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                            style={{ animationDelay: '1s' }}
                        />
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament4}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                            style={{ animationDelay: '1.5s' }}
                        />
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament5}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                            style={{ animationDelay: '2s' }}
                        />
                        <motion.div 
                            className={`${styles.ornament} ${styles.ornament6}`}
                            variants={ornamentVariants}
                            animate="twinkle"
                            style={{ animationDelay: '2.5s' }}
                        />
                        
                        {/* Tree star */}
                        <motion.div 
                            className={styles.treeStar}
                            animate={{
                                rotate: 360,
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                rotate: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                        />
                        
                        {/* Tree base decorations */}
                        <div className={styles.treeBase}>
                            <div className={styles.gift1} />
                            <div className={styles.gift2} />
                            <div className={styles.gift3} />
                        </div>
                    </motion.div>

                    {/* Balloons - Optimized for mobile visibility */}
                    {balloons.map((balloon) => (
                        <motion.div
                            key={balloon.id}
                            className={`${styles.balloon} ${styles[balloon.priority]}`}
                            style={{
                                left: balloon.x,
                                top: balloon.y,
                                '--balloon-size': `${balloon.size}px`,
                                '--balloon-color': balloon.color,
                                '--delay': `${balloon.delay}s`
                            }}
                            variants={balloonVariants}
                            initial={{ y: 100, opacity: 0, scale: 0.5 }}
                            animate={{
                                ...balloonVariants.float,
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: balloon.delay,
                                    duration: 1,
                                    ease: "backOut"
                                }
                            }}
                        >
                            <div className={styles.balloonBody} />
                            <div className={styles.balloonString} />
                            <div className={styles.balloonHighlight} />
                            <div className={styles.balloonReflection} />
                        </motion.div>
                    ))}

                    {/* Snowflakes for festive effect */}
                    <div className={styles.snowflakes}>
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className={styles.snowflake} style={{
                                '--snowflake-size': `${Math.random() * 5 + 2}px`,
                                '--snowflake-delay': `${Math.random() * 5}s`,
                                '--snowflake-left': `${Math.random() * 100}%`,
                                '--snowflake-opacity': `${Math.random() * 0.7 + 0.3}`
                            }} />
                        ))}
                    </div>

                    <div className={styles.loadingContainer}>
                        {/* Elegant Logo */}
                        <motion.div
                            className={styles.logoContainer}
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <img 
                                src={LOGO} 
                                alt="Logo" 
                                className={styles.logo}
                            />
                            <div className={styles.logoGlow} />
                            <div className={styles.logoFestiveRing} />
                        </motion.div>
                        
                        {/* Professional Text Content */}
                        <motion.div 
                            className={styles.textsContainer}
                            variants={textContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Partnership Section */}
                            <motion.div 
                                className={styles.textSection}
                                variants={textItemVariants}
                            >
                                <div className={styles.partnershipContent}>
                                    <span className={styles.prefix}>{loadingContent.partnership.text}</span>
                                    <motion.span 
                                        className={styles.companyName}
                                        animate={{
                                            backgroundPosition: ['0%', '100%', '0%'],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {loadingContent.partnership.company}
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* Powered By Section */}
                            <motion.div 
                                className={styles.textSection}
                                variants={textItemVariants}
                            >
                                <div className={styles.poweredContent}>
                                    <span className={styles.prefix}>{loadingContent.powered.text}</span>
                                    <motion.span 
                                        className={styles.techName}
                                        animate={{
                                            opacity: [0.8, 1, 0.8],
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {loadingContent.powered.company}
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* Journey Section */}
                            <motion.div 
                                className={styles.textSection}
                                variants={textItemVariants}
                            >
                                <div className={styles.journeyContent}>
                                    <span className={styles.journeyText}>{loadingContent.journey.text}</span>
                                    <motion.span 
                                        className={styles.highlightText}
                                        animate={{
                                            backgroundPosition: ['0%', '100%', '0%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {loadingContent.journey.highlight}
                                    </motion.span>
                                </div>
                            </motion.div>
                        </motion.div>
                        
                        {/* Sophisticated Progress Bar */}
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <motion.div 
                                    className={styles.progressFill}
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: `${progressWidth}%`,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut"
                                        }
                                    }}
                                >
                                    <div className={styles.progressGlow} />
                                    <div className={styles.progressSparkles} />
                                </motion.div>
                            </div>
                            <motion.div 
                                className={styles.progressText}
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: 1,
                                    transition: { delay: 0.2 }
                                }}
                            >
                                {Math.round(progress)}%
                            </motion.div>
                        </div>

                        {/* Minimal Loading Indicator */}
                        <motion.div 
                            className={styles.loadingIndicator}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.spinner}>
                                <div className={styles.spinnerCircle} />
                                <div className={styles.spinnerOrnament} />
                            </div>
                            <span className={styles.loadingLabel}>Loading</span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoading;