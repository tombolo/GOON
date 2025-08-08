type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    CHART: 2,
    MYBOTS: 3,
    ANALYSIS_TOOL: 4,
    COPY_TRADING: 5,
    RISK_MANAGEMENT: 6,
    STRATEGY: 7,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = ['id-dbot-dashboard', 'id-bot-builder', 'id-charts', 'id-mybots', 'id-analysis-tool', 'id-copy-trading', 'id-risk-management', 'id-strategy'];

export const DEBOUNCE_INTERVAL_TIME = 500;
