import React, { useEffect, useState } from 'react';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from '../dashboard/bot-list/recent-workspace';
import './botlist.scss';

const DashboardBotList = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadStrategies = async () => {
            setIsLoading(true);
            const strategies = await getSavedWorkspaces();
            load_modal.setDashboardStrategies(strategies);
            setTimeout(() => setIsLoading(false), 800); // Simulate loading with animation
        };
        loadStrategies();
    }, []);

    const filteredBots = load_modal.dashboard_strategies?.filter(bot =>
        bot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dbot-bot-army">
            {/* Animated background elements */}
            <div className="dbot-bot-army__particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="dbot-bot-army__particle" style={{
                        ['--size' as string]: `${Math.random() * 5 + 2}px`,
                        ['--x' as string]: `${Math.random() * 100}%`,
                        ['--y' as string]: `${Math.random() * 100}%`,
                        ['--delay' as string]: `${Math.random() * 5}s`,
                        ['--duration' as string]: `${Math.random() * 10 + 10}s`
                    } as React.CSSProperties} />
                ))}
            </div>

            <div className="dbot-bot-army__container">
                <div className="dbot-bot-army__header">
                    <div className="dbot-bot-army__title-container">
                        <h1 className="dbot-bot-army__title">
                            <span className="dbot-bot-army__title-text">
                                <Localize i18n_default_text="Your Bot Army" />
                            </span>
                            <span className="dbot-bot-army__emoji">🤖</span>
                        </h1>
                        <p className="dbot-bot-army__subtitle">
                            <Localize i18n_default_text="Command your automated trading forces" />
                        </p>
                    </div>

                    <div className="dbot-bot-army__search">
                        <Icon icon="IcSearch" className="dbot-bot-army__search-icon" />
                        <input
                            type="text"
                            placeholder="Search bots..."
                            className="dbot-bot-army__search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="dbot-bot-army__content">
                    {isLoading ? (
                        <div className="dbot-bot-army__loader">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="dbot-bot-army__skeleton-card">
                                    <div className="dbot-bot-army__skeleton-image" />
                                    <div className="dbot-bot-army__skeleton-text" />
                                    <div className="dbot-bot-army__skeleton-text-sm" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredBots?.length > 0 ? (
                                <div className="dbot-bot-army__grid">
                                    {filteredBots.map((workspace, index) => (
                                        <RecentWorkspace
                                            key={workspace.id}
                                            workspace={workspace}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="dbot-bot-army__empty">
                                    <div className="dbot-bot-army__empty-icon">
                                        <Icon icon="IcBox" size={64} />
                                    </div>
                                    <Text as="h3" weight="bold" align="center">
                                        <Localize i18n_default_text="No bots found" />
                                    </Text>
                                    <Text as="p" size="xs" align="center" color="less-prominent">
                                        {searchTerm ? (
                                            <Localize i18n_default_text="Try a different search term" />
                                        ) : (
                                            <Localize i18n_default_text="Create your first bot to get started" />
                                        )}
                                    </Text>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default DashboardBotList;