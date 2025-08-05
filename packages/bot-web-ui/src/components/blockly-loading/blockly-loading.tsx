import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useDBotStore } from 'Stores/useDBotStore';
import './BlocklyLoading.scss';

const BlocklyLoading = observer(() => {
    const { blockly_store } = useDBotStore();
    const { is_loading } = blockly_store;
    const [progress, setProgress] = useState(0);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        if (is_loading) {
            setShowLoading(true);
            setProgress(0);

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + Math.random() * 10;
                });
            }, 300);
        } else {
            setProgress(100);
            timeout = setTimeout(() => {
                setShowLoading(false);
            }, 500);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [is_loading]);

    if (!showLoading) return null;

    return (
        <div className={`bot__loading ${!is_loading ? 'fade-out' : ''}`} data-testid='blockly-loader'>
            <div className="loading-text">Loading Smart Traders...</div>
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="loading-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
            </div>
        </div>
    );
});

export default BlocklyLoading;