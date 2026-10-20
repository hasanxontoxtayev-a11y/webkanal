/**
 * TubePilot AI — Chrome Extension Service Worker
 * Handles network proxying to bypass YouTube page Content Security Policy (CSP)
 */

declare const chrome: any;

const API_BASE_URL = 'https://www.tubepilotpro.com';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TubePilot AI] Universal YouTube HUD Extension Installed Successfully');
});

// Proxy network requests from content scripts to bypass YouTube CSP
chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (res: any) => void) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', timestamp: Date.now() });
    return true;
  }

  if (message.type === 'FETCH_STATUS') {
    fetch(`${API_BASE_URL}/api/extension/status`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err?.message || 'Network error' }));
    return true; // asynchronous response
  }

  if (message.type === 'FETCH_AUDIT') {
    const query = encodeURIComponent(message.query || '');
    fetch(`${API_BASE_URL}/api/channels/audit?q=${query}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err?.message || 'Network error' }));
    return true; // asynchronous response
  }

  return true;
});
