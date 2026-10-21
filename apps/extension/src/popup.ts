/**
 * TubePilot AI — Extension Toolbar Popup Logic
 */

declare const chrome: any;

document.addEventListener('DOMContentLoaded', () => {
  const auditBtn = document.getElementById('btn-audit');
  const inputEl = document.getElementById('channel-input') as HTMLInputElement | null;

  if (auditBtn && inputEl) {
    auditBtn.addEventListener('click', () => {
      // 1. Try to inject and render directly on current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        const activeTab = tabs[0];
        if (activeTab?.id && activeTab?.url?.includes('youtube.com')) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js'],
          }, () => {
            chrome.scripting.insertCSS({
              target: { tabId: activeTab.id },
              files: ['styles.css'],
            });
          });
        } else {
          const handle = inputEl.value.trim();
          const targetUrl = handle
            ? `https://www.tubepilotpro.com/uz/dashboard?audit_handle=${encodeURIComponent(handle)}`
            : `https://www.tubepilotpro.com/uz/dashboard`;
          chrome.tabs.create({ url: targetUrl });
        }
      });
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        auditBtn.click();
      }
    });
  }
});
