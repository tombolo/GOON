import React from 'react';
import { observer } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendDashboardClickEvent } from '../../../analytics/rudderstack-dashboard';
import { TRecentStrategy } from './types';
import './recent-workspace.scss';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const RecentWorkspace = observer(({ workspace }: { workspace: TRecentStrategy }) => {
    const { dashboard, load_modal } = useDBotStore();
    const { setActiveTab } = dashboard;
    const { loadFileFromRecent } = load_modal;

    const handleOpen = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
        rudderStackSendDashboardClickEvent({ dashboard_click_name: 'open', subpage_name: 'bot_builder' });
    };

    return (
        <div className="recent-workspace" onClick={handleOpen} tabIndex={0}>
            <div className="recent-workspace__content">
                <div className="recent-workspace__text">
                    <Text as="p" size="xs" weight="bold" className="recent-workspace__name">
                        {workspace.name || localize('Untitled Bot')}
                    </Text>
                </div>
                <button className="recent-workspace__load-btn">
                    <span>Load</span>
                    <div className="recent-workspace__load-btn-arrow"></div>
                </button>
            </div>
        </div>
    );
});

export default RecentWorkspace;