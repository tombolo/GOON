import React, { useEffect } from 'react';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from './recent-workspace';
import './dashboard-bot-list.scss';

const DashboardBotList = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;

    useEffect(() => {
        const loadStrategies = async () => {
            const strategies = await getSavedWorkspaces();
            load_modal.setDashboardStrategies(strategies);
        };
        loadStrategies();
    }, []);

    return (
        <div className="dbot-recent-bots">
            <div className="dbot-recent-bots__header">
                <Text size={is_mobile ? 'xs' : 's'} weight="bold" color="prominent">
                    <Localize i18n_default_text="🤖 Your Bot Army" />
                </Text>
                <div className="dbot-recent-bots__header-emoji">✨</div>
            </div>

            <div className="dbot-recent-bots__scroll-container">
                <div className="dbot-recent-bots__grid-container">
                    <div className="dbot-recent-bots__grid">
                        {load_modal.dashboard_strategies?.map((workspace, index) => (
                            <RecentWorkspace
                                key={workspace.id}
                                workspace={workspace}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DashboardBotList;