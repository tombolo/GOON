import React, { useEffect, useRef, useState } from 'react';
import styles from './CopyTradingPage.module.scss';

const AiPage: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState('600px'); // Default height

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.iframeHeight) {
                setIframeHeight(`${event.data.iframeHeight}px`);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className={styles.container}>
            <iframe
                ref={iframeRef}
                src="/sbs/copytrading.html"
                title="Copytrade"
                className={styles.iframe}
                style={{ height: iframeHeight }}
            />
        </div>
    );
};

export default AiPage;