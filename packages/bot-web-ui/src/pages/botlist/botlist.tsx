import React, { useEffect, useState } from 'react';
import { Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from '../dashboard/bot-list/recent-workspace';
import styles from './botlist.module.scss';

// Import bots as raw XML strings
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

// ✅ Define static bots with required TStrategy fields
const staticBots = [
    { id: '1', name: 'Auto Robot by GLE1', xml: AutoRobot },
    { id: '2', name: 'Over Under Bot by GLE', xml: OverUnderBot },
    { id: '3', name: 'Deriv Miner Pro', xml: Derivminer },
    { id: '4', name: 'Dollar Flipper', xml: Derivflipper },
    { id: '5', name: 'King Auto Over2Under7', xml: KingAutoOver2Under7 },
    { id: '6', name: 'Over2 Olympian Bot', xml: Over2Olympian },
    { id: '7', name: 'ALLAN RISE BOT', xml: ALLANRISEBOT },
    { id: '8', name: 'Allan Over2 Bot', xml: Allanover2bot },
    { id: '9', name: 'ALLAN FALL', xml: ALLANFALL },
    { id: '10', name: 'Allan Under7', xml: Allanunder7 },
].map(bot => ({
    ...bot,
    save_type: 'local', // or "imported"
    timestamp: Date.now(), // required field
}));

const DashboardBotList = observer(() => {
    const { load_modal } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHoveringTitle, setIsHoveringTitle] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        // ✅ Use static bots instead of localStorage
        load_modal.setDashboardStrategies(staticBots);
        setTimeout(() => setIsLoading(false), 500);
    }, [load_modal]);

    const filteredBots = load_modal.dashboard_strategies?.filter(bot =>
        bot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div
                        className={styles.titleContainer}
                        onMouseEnter={() => setIsHoveringTitle(true)}
                        onMouseLeave={() => setIsHoveringTitle(false)}
                    >
                        <h1 className={styles.title}>
                            <span className={`${styles.titleText} ${isHoveringTitle ? styles.titleHover : ''}`}>
                                <Localize i18n_default_text="Bot Collection" />
                            </span>
                            <span className={`${styles.emoji} ${isHoveringTitle ? styles.emojiHover : ''}`}>
                                🤖
                            </span>
                        </h1>
                        <p className={styles.subtitle}>
                            <Localize i18n_default_text="Manage your automated trading strategies" />
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loader}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonText} />
                                    <div className={styles.skeletonTextSm} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredBots?.length > 0 ? (
                                <div className={styles.grid}>
                                    {filteredBots.map((workspace, index) => (
                                        <RecentWorkspace
                                            key={workspace.id}
                                            workspace={workspace}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>
                                        <Icon icon="IcBox" size={is_mobile ? 48 : 64} />
                                    </div>
                                    <Text as="h3" weight="bold" align="center">
                                        <Localize i18n_default_text="No bots found" />
                                    </Text>
                                    <Text as="p" size="xs" align="center" color="less-prominent">
                                        {searchTerm ? (
                                            <Localize i18n_default_text="Try a different search term" />
                                        ) : (
                                            <Localize i18n_default_text="No static bots available" />
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
