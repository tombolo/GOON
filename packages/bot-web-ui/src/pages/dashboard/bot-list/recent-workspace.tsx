import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TRecentStrategy } from './types';
import './recent-workspace.scss';

const BOT_EMOJIS = ['🤖', '👾', '🦾', '🧠', '⚡', '💻', '🔮', '🎮'];

const RecentWorkspace = observer(({ workspace, index }: { workspace: TRecentStrategy, index: number }) => {
    const { dashboard, load_modal } = useDBotStore();

    const handleClick = async () => {
        await load_modal.loadFileFromRecent();
        dashboard.setActiveTab(1); // BOT_BUILDER
    };

    const randomEmoji = BOT_EMOJIS[index % BOT_EMOJIS.length];

    return (
        <div className="dbot-workspace-card" onClick={handleClick} data-index={index}>
            <div className="dbot-workspace-card__border-light"></div>
            <div className="dbot-workspace-card__emoji">{randomEmoji}</div>
            <div className="dbot-workspace-card__content">
                <div className="dbot-workspace-card__name">
                    {workspace.name || 'Untitled Bot'}
                </div>
                <button className="dbot-workspace-card__action">
                    <span>Load</span>
                    <div className="dbot-workspace-card__arrow">→</div>
                </button>
            </div>
            <div className="dbot-workspace-card__shine"></div>
        </div>
    );
});

export default RecentWorkspace;