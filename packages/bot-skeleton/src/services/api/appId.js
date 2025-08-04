import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { WebSocketUtils } from '@deriv-com/utils';
import { getLanguage } from '@deriv/translations';
import APIMiddleware from './api-middleware';
import { website_name } from '@deriv/shared';

export const generateDerivApiInstance = () => {
    const app_id = '70344'; // Default app_id, can be overridden by WebSocketUtils.getAppId()
    const socket_url = `ss://ws.derivws.com/websockets/v3?app_id=${app_id}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    console.log('[WebSocket] Connecting to:', socket_url);

    const deriv_socket = new WebSocket(socket_url);

    deriv_socket.onopen = () => {
        console.log('[WebSocket] Connection opened');
    };
    deriv_socket.onerror = error => {
        console.error('[WebSocket] Connection error:', error);
    };
    deriv_socket.onclose = event => {
        console.log('[WebSocket] Connection closed:', event);
    };
    deriv_socket.onmessage = message => {
        console.log('[WebSocket] Data received:', message.data);
    };
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
        middleware: new APIMiddleware({}),
    });
    return deriv_api;
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts')) || undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || {};
    return {
        token: active_account?.token || undefined,
        account_id: active_loginid || undefined,
    };
};
