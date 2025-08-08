import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendDashboardClickEvent } from '../../../analytics/rudderstack-dashboard';
import { TRecentStrategy } from './types';
import './recent-workspace.scss';
import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';

type TRecentWorkspace = {
    workspace: TRecentStrategy;
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspace) => {
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
                <Text as="p" size="s" weight="bold" className="recent-workspace__name">
                    {workspace.name || localize('Untitled Bot')}
                </Text>
                <button className="recent-workspace__open-btn">
                    <Icon icon="IcArrowRightBold" size={16} />
                </button>
            </div>
        </div>
    );
});

export default RecentWorkspace;