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
    MYBOTS: 0,
    DASHBOARD: 1,
    BOT_BUILDER: 2,
    CHART: 3,
    TUTORIAL: 4,
    ANALYSIS_TOOL: 5,
    COPY_TRADING: 6,
    RISK_MANAGEMENT: 7,
    STRATEGY: 8,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = ['id-mybots', 'id-dbot-dashboard', 'id-bot-builder', 'id-charts', 'id-tutorials', 'id-analysis-tool', 'id-copy-trading', 'id-risk-management', 'id-strategy'];

export const DEBOUNCE_INTERVAL_TIME = 500;
