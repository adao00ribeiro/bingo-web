const newLocal = '${api}';
const newLocal_1 = '${API_WS}';
export const environment = {
  production: false,
    api: newLocal || 'http://localhost',
    API_WS: newLocal_1 || 'ws://localhost/ws'
};
