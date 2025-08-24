import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// 🛠 Import static bots
import AutoRobot from './bots/auto_robot_by_GLE1.xml';
import Derivminer from './bots/deriv_miner_pro.xml';
import Over2Olympian from './bots/Over2OlympianBotwithSplitMartingale.xml';
import ALLANRISEBOT from './bots/ALLANRISEBOT.xml';
import Allanover2bot from './bots/Allanover2bot.xml';
import ALLANFALL from './bots/ALLANFALL.xml';
import Allanunder7 from './bots/0_Allanunder7.xml';

// ✅ Static bot configs only
const STATIC_BOTS = {
    auto_robot: {
        id: 'auto_robot_by_GLE1',
        name: 'Auto robot',
        xml: AutoRobot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    deriv_miner_pro: {
        id: 'deriv_miner_pro',
        name: 'Deriv Miner Pro',
        xml: Derivminer,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Over2Olympian: {
        id: 'Over2Olympian',
        name: 'Over 2 Olympian Bot (Split Martingale)',
        xml: Over2Olympian,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    ALLANRISEBOT: {
        id: 'ALLANRISEBOT',
        name: 'ALLAN RISE BOT',
        xml: ALLANRISEBOT,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Allanover2bot: {
        id: 'Allanover2bot',
        name: 'Allan over2 bot',
        xml: Allanover2bot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    ALLANFALL: {
        id: 'ALLANFALL',
        name: 'ALLAN FALL',
        xml: ALLANFALL,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Allanunder7: {
        id: 'Allanunder7',
        name: 'Allan under7 bot',
        xml: Allanunder7,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
};

const getStaticBots = () => Object.values(STATIC_BOTS);

/**
 * 🔒 Disable saving bots
 */
export const saveWorkspaceToRecent = async () => {
    console.warn('[INFO] Saving disabled → Using static bots only.');
    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;
    updateListStrategies(getStaticBots());
};

/**
 * ✅ Always return static bots
 */
export const getSavedWorkspaces = async () => {
    const bots = getStaticBots();
    bots.forEach(bot => console.log(`[DEBUG] Static bot available: ${bot.id}`));
    return bots;
};

/**
 * Load a bot by ID (from static list only)
 */
export const loadStrategy = async strategy_id => {
    const strategy = getStaticBots().find(bot => bot.id === strategy_id);
    if (!strategy) {
        console.error(`[ERROR] Bot with id "${strategy_id}" not found in static list.`);
        return false;
    }

    try {
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(strategy.xml, 'text/xml').documentElement;
        const convertedXml = convertStrategyToIsDbot(xmlDom);

        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;

        console.log(`[INFO] Loaded static bot: ${strategy.name}`);
        return true;
    } catch (error) {
        console.error('Error loading static bot:', error);
        return false;
    }
};

/**
 * 🔒 Disable removing bots
 */
export const removeExistingWorkspace = async () => {
    console.warn('[INFO] Remove disabled → Static bots only.');
    return false;
};

/**
 * Ensure xml has `is_dbot` flag
 */
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

// 🧹 Clear storage & recents at startup
localStorage.removeItem('saved_workspaces');
localStorage.removeItem('recent_strategies');
console.log('[INFO] Cleared saved/recent bots → Static bots only.');
