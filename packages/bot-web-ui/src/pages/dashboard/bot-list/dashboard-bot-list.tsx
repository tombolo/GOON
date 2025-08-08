import React from 'react';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import DeleteDialog from './delete-dialog';
import RecentWorkspace from './recent-workspace';
import './dashboard-bot-list.scss';

const DashboardBotList = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { setDashboardStrategies, dashboard_strategies } = load_modal;
    const { setStrategySaveType, strategy_save_type } = dashboard;
    const { ui } = useStore();
    const { is_desktop } = ui;

    React.useEffect(() => {
        setStrategySaveType('');
        const getStrategies = async () => {
            const recent_strategies = await getSavedWorkspaces();
            setDashboardStrategies(recent_strategies);
        };
        getStrategies();
    }, [strategy_save_type, setDashboardStrategies, setStrategySaveType]);

    if (!dashboard_strategies?.length) {
        return (
            <div className="dashboard-bot-list__empty">
                <Text size={is_desktop ? 's' : 'xs'} color="less-prominent">
                    <Localize i18n_default_text="No recent bots found" />
                </Text>
            </div>
        );
    }

    return (
        <div className="dashboard-bot-list">
            <div className="dashboard-bot-list__header">
                <Text size={is_desktop ? 's' : 'xs'} weight="bold" color="prominent">
                    <Localize i18n_default_text="Your Recent Bots" />
                </Text>
            </div>

            <div className="dashboard-bot-list__content">
                {dashboard_strategies.map(workspace => (
                    <RecentWorkspace key={workspace.id} workspace={workspace} />
                ))}
            </div>

            <DeleteDialog />
        </div>
    );
});

export default DashboardBotList;