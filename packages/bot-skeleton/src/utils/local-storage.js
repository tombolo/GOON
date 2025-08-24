import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';
import AutoRobot from './bots/auto_robot_by_GLE1.xml';
import OverUnderBot from './bots/over_under_bot_by_GLE.xml';
import Derivminer from './bots/deriv_miner_pro.xml';
import Derivflipper from './bots/dollar_flipper.xml';
import KingAutoOver2Under7 from './bots/KingAutoOver2Under7.xml';
import Over2Olympian from './bots/Over2OlympianBotwithSplitMartingale.xml';
import ALLANRISEBOT from './bots/ALLANRISEBOT.xml';
import Allanover2bot from './bots/Allanover2bot.xml';
import ALLANFALL from './bots/ALLANFALL.xml';
import Allanunder7 from './bots/0_Allanunder7.xml';

// ✅ Only static bot configs
const STATIC_BOTS = {
    auto_robot: {
        id: 'auto_robot_by_GLE1',
        name: 'Auto robot',
        xml: AutoRobot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    over_under: {
        id: 'over_under_bot_by_GLE',
        name: 'Over&under bot',
        xml: OverUnderBot,
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
    dollar_flipper: {
        id: 'dollar_flipper',
        name: 'Deriv Flipper',
        xml: Derivflipper,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    KingAutoOver2Under7: {
        id: 'KingAutoOver2Under7',
        name: 'King Auto Over2 & Under7',
        xml: KingAutoOver2Under7,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Over2Olympian: {
        id: 'Over2Olympian',
        name: 'Over 2 Olympian Bot with Split Martingale',
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

const getStaticBots = () => STATIC_BOTS;

/**
 * 🔒 Disabled saveWorkspaceToRecent
 * Always ignores saving and just refreshes the static bot list.
 */
export const saveWorkspaceToRecent = async () => {
    console.warn('[INFO] Saving bots is disabled. Using static bots only.');
    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;

    const bots = Object.values(getStaticBots());
    updateListStrategies(bots);
};

/**
 * ✅ Always return static bots only
 */
export const getSavedWorkspaces = async () => {
    const bots = Object.values(getStaticBots());
    bots.forEach(bot => {
        console.log(`[DEBUG] Static bot loaded: ${bot.id}`);
    });
    return bots;
};

/**
 * Load a bot by ID (from static list only)
 */
export const loadStrategy = async strategy_id => {
    const workspaces = await getSavedWorkspaces();
    const strategy = workspaces.find(workspace => workspace.id === strategy_id);

    if (!strategy) return false;

    try {
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(strategy.xml, 'text/xml').documentElement;
        const convertedXml = convertStrategyToIsDbot(xmlDom);

        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;
        return true;
    } catch (error) {
        console.error('Error loading strategy:', error);
        return false;
    }
};

/**
 * 🔒 Disabled removeExistingWorkspace
 * Static bots cannot be deleted.
 */
export const removeExistingWorkspace = async () => {
    console.warn('[INFO] Removing bots is disabled. Static bots only.');
    return false;
};

export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    if (xml_dom.hasAttribute('collection') && xml_dom.getAttribute('collection') === 'true') {
        xml_dom.setAttribute('collection', 'true');
    }
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};
