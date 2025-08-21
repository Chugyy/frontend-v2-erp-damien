// scripts/index.js - Point d'entrée API V2 ERP

export { default as api } from './api.js';
export { auth } from './auth.js';
export { accounts } from './accounts.js';
export { contacts } from './contacts.js';

// Import dynamique pour modules avancés
export const loadConversations = () => import('./conversations.js');
export const loadAutomation = () => import('./automation.js');
export const loadAnalytics = () => import('./analytics.js');