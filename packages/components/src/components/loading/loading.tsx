import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Text from '../text/text';
import LoadingDTraderV2 from './loading-dtrader-v2';
import { AnimatePresence, motion } from 'framer-motion';

export type TLoadingProps = React.HTMLProps<HTMLDivElement> & {
    is_fullscreen: boolean;
    is_slow_loading: boolean;
    status?: string[]; // Make status explicitly optional
    theme: string;
};

const Loading = ({ className, id, is_fullscreen = true, is_slow_loading, status, theme }: Partial<TLoadingProps>) => {
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const theme_class = theme ? `barspinner-${theme}` : 'barspinner-light';

    useEffect(() => {
        if (status && status.length > 1) { // Add null check
            const interval = setInterval(() => {
                setCurrentStatusIndex(prev => (prev + 1) % status.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-testid='dt_initial_loader'
            className={classNames(
                'initial-loader',
                {
                    'initial-loader--fullscreen': is_fullscreen,
                },
                className
            )}
        >
            <div className="loading-content">
                <div id={id} className={classNames('initial-loader__barspinner', 'barspinner', theme_class)}>
                    {Array.from(new Array(5)).map((_, inx) => (
                        <motion.div
                            key={inx}
                            className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${inx + 1
                                } rect${inx + 1}`}
                            animate={{
                                scaleY: [1, 2, 1],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.2,
                                delay: inx * 0.1,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {is_slow_loading && status && (
                    <AnimatePresence>
                        <motion.div
                            key={currentStatusIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="status-message"
                        >
                            <Text as='h3' color='prominent' size='xs' align='center'>
                                {status[currentStatusIndex]}
                            </Text>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
};

Loading.DTraderV2 = LoadingDTraderV2;

export default Loading;