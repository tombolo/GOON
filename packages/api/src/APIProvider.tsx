import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { WebSocketUtils } from '@deriv-com/utils';
import { ObjectUtils } from '@deriv-com/utils';

type TSendFunction = <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<TSocketResponseData<T> & TSocketError<T>>;

type TSubscribeFunction = <T extends TSocketSubscribableEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<{ id: string; subscription: DerivAPIBasic['subscribe'] }>;

type TUnsubscribeFunction = (id: string) => void;

type APIContextData = {
    derivAPI: DerivAPIBasic | null;
    switchEnvironment: (loginid: string | null | undefined) => void;
    send: TSendFunction;
    subscribe: TSubscribeFunction;
    unsubscribe: TUnsubscribeFunction;
    queryClient: QueryClient;
    isConnected: boolean;
};

const APIContext = createContext<APIContextData | null>(null);

declare global {
    interface Window {
        ReactQueryClient?: QueryClient;
        DerivAPI?: Record<string, DerivAPIBasic>;
        WSConnections?: Record<string, WebSocket>;
    }
}

const getSharedQueryClientContext = (): QueryClient => {
    if (!window.ReactQueryClient) {
        window.ReactQueryClient = new QueryClient();
    }
    return window.ReactQueryClient;
};

/**
 * Retrieves the WebSocket URL based on the current environment.
 * @param {string} [loginid] - Optional login ID to determine environment
 * @returns {string} The WebSocket URL
 */
const getWebSocketURL = (loginid?: string): string => {
    const environment = loginid ? WebSocketUtils.getEnvironmentFromLoginid(loginid) : 'demo';
    const endpoint = environment === 'demo' ? 'blue.derivws.com' : 'green.derivws.com';
    const app_id = 70344;
    const language = localStorage.getItem('i18n_language') || 'en';
    const brand = 'deriv';

    return `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;
};

/**
 * Retrieves or initializes a WebSocket instance
 * @param {string} wss_url - WebSocket URL
 * @param {() => void} onWSClose - Callback when connection closes
 * @returns {WebSocket} The WebSocket instance
 */
const getWebsocketInstance = (wss_url: string, onWSClose: () => void): WebSocket => {
    if (!window.WSConnections) {
        window.WSConnections = {};
    }

    const existingInstance = window.WSConnections[wss_url];
    if (!existingInstance || existingInstance.readyState === WebSocket.CLOSED) {
        const ws = new WebSocket(wss_url);
        window.WSConnections[wss_url] = ws;

        ws.addEventListener('close', () => {
            console.log(`WebSocket connection closed: ${wss_url}`);
            onWSClose();
        });

        ws.addEventListener('open', () => {
            console.log(`WebSocket connection established: ${wss_url}`);
        });

        ws.addEventListener('error', (error) => {
            console.error(`WebSocket error: ${wss_url}`, error);
        });

        return ws;
    }

    return existingInstance;
};

export const getActiveWebsocket = (loginid?: string): WebSocket | undefined => {
    const wss_url = getWebSocketURL(loginid);
    return window?.WSConnections?.[wss_url];
};

/**
 * Initializes a DerivAPI instance
 * @param {() => void} onWSClose - Callback when connection closes
 * @param {string} [loginid] - Login ID to determine environment
 * @returns {DerivAPIBasic} The initialized DerivAPI instance
 */
const initializeDerivAPI = (onWSClose: () => void, loginid?: string): DerivAPIBasic => {
    if (!window.DerivAPI) {
        window.DerivAPI = {};
    }

    const wss_url = getWebSocketURL(loginid);
    const websocketConnection = getWebsocketInstance(wss_url, onWSClose);

    if (!window.DerivAPI[wss_url] || window.DerivAPI[wss_url].isConnectionClosed()) {
        window.DerivAPI[wss_url] = new DerivAPIBasic({
            connection: websocketConnection
        });
    }

    return window.DerivAPI[wss_url];
};

const queryClient = getSharedQueryClientContext();

type TAPIProviderProps = {
    standalone?: boolean;
};

const APIProvider = ({ children, standalone = false }: PropsWithChildren<TAPIProviderProps>) => {
    const WS = useWS();
    const [reconnect, setReconnect] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Track loginid and environment in state
    const [activeLoginid, setActiveLoginid] = useState(
        window.sessionStorage.getItem('active_loginid') ||
        window.localStorage.getItem('active_loginid')
    );
    const [environment, setEnvironment] = useState(() =>
        WebSocketUtils.getEnvironmentFromLoginid(activeLoginid || null)
    );
    const standaloneDerivAPI = useRef<DerivAPIBasic | null>(
        standalone ? initializeDerivAPI(() => setReconnect(true), activeLoginid || undefined) : null
    );
    const subscriptions = useRef<Record<string, DerivAPIBasic['subscribe']>>({});

    // Listen for loginid changes (e.g. when switching accounts)
    useEffect(() => {
        const checkLoginid = () => {
            const newLoginid = window.sessionStorage.getItem('active_loginid') ||
                window.localStorage.getItem('active_loginid');
            if (newLoginid !== activeLoginid) {
                setActiveLoginid(newLoginid);
                setEnvironment(WebSocketUtils.getEnvironmentFromLoginid(newLoginid || null));
            }
        };
        const interval = setInterval(checkLoginid, 1000);
        return () => clearInterval(interval);
    }, [activeLoginid]);

    // Update connection status when API changes
    useEffect(() => {
        if (!standaloneDerivAPI.current) return;

        const checkConnection = () => {
            setIsConnected(
                standaloneDerivAPI.current?.connection.readyState === WebSocket.OPEN &&
                !standaloneDerivAPI.current?.isConnectionClosed()
            );
        };

        checkConnection();
        const interval = setInterval(checkConnection, 5000);
        return () => clearInterval(interval);
    }, [standaloneDerivAPI.current]);

    const send: TSendFunction = useCallback((name, payload) => {
        if (!standaloneDerivAPI.current) {
            throw new Error('API not initialized');
        }
        return standaloneDerivAPI.current.send({ [name]: 1, ...payload });
    }, []);

    const subscribe: TSubscribeFunction = useCallback(async (name, payload) => {
        if (!standaloneDerivAPI.current) {
            throw new Error('API not initialized');
        }

        const id = await ObjectUtils.hashObject({ name, payload });
        const matchingSubscription = subscriptions.current[id];
        if (matchingSubscription) return { id, subscription: matchingSubscription };

        const subscription = standaloneDerivAPI.current.subscribe({
            [name]: 1,
            subscribe: 1,
            ...(payload?.payload ?? {}),
        });

        subscriptions.current = { ...subscriptions.current, [id]: subscription };
        return { id, subscription };
    }, []);

    const unsubscribe: TUnsubscribeFunction = useCallback((id) => {
        const matchingSubscription = subscriptions.current[id];
        if (matchingSubscription) {
            matchingSubscription.unsubscribe();
            delete subscriptions.current[id];
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(subscriptions.current || {}).forEach(sub => sub.unsubscribe());
            if (standaloneDerivAPI.current && !standaloneDerivAPI.current.isConnectionClosed()) {
                standaloneDerivAPI.current.disconnect();
            }
        };
    }, []);

    const switchEnvironment = useCallback(
        (loginid: string | null | undefined) => {
            if (!standalone) return;

            const newEnvironment = WebSocketUtils.getEnvironmentFromLoginid(loginid || null);
            if (newEnvironment !== environment || loginid !== activeLoginid) {
                setEnvironment(newEnvironment);
                setActiveLoginid(loginid || null);

                // Clean up old connection
                if (standaloneDerivAPI.current) {
                    standaloneDerivAPI.current.disconnect();
                }

                // Initialize new connection with new loginid
                standaloneDerivAPI.current = initializeDerivAPI(() => setReconnect(true), loginid || undefined);
            }
        },
        [environment, standalone, activeLoginid]
    );

    // Ping connection to keep alive
    useEffect(() => {
        if (!standalone) return;

        const pingInterval = setInterval(() => {
            if (standaloneDerivAPI.current?.connection.readyState === WebSocket.OPEN) {
                standaloneDerivAPI.current.send({ ping: 1 }).catch(console.error);
            }
        }, 10000);

        return () => clearInterval(pingInterval);
    }, [standalone]);

    // Handle reconnections
    useEffect(() => {
        if (!standalone && !reconnect) return;

        let reconnectTimer: NodeJS.Timeout;
        const currentAPI = standaloneDerivAPI.current;

        if (reconnect || !currentAPI || currentAPI.isConnectionClosed()) {
            standaloneDerivAPI.current = initializeDerivAPI(() => {
                reconnectTimer = setTimeout(() => setReconnect(true), 1000);
            }, activeLoginid || undefined);
            setReconnect(false);
        }

        return () => {
            if (reconnectTimer) clearTimeout(reconnectTimer);
        };
    }, [environment, reconnect, standalone, activeLoginid]);

    return (
        <APIContext.Provider
            value={{
                derivAPI: standalone ? standaloneDerivAPI.current : WS,
                switchEnvironment,
                send,
                subscribe,
                unsubscribe,
                queryClient,
                isConnected,
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export const useAPIContext = (): APIContextData => {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('useAPIContext must be used within APIProvider');
    }
    return context;
};

export default APIProvider;