/**
 * TubePilot AI — Extension Toolbar Popup Logic
 */

declare const chrome: any;

document.addEventListener('DOMContentLoaded', () => {
  const auditBtn = document.getElementById('btn-audit');
  const inputEl = document.getElementById('channel-input') as HTMLInputElement | null;

  if (auditBtn && inputEl) {
    auditBtn.addEventListener('click', () => {
      const handle = inputEl.value.trim();
      const targetUrl = handle
        ? `https://www.tubepilotpro.com/uz/dashboard?audit_handle=${encodeURIComponent(handle)}`
        : `https://www.tubepilotpro.com/uz/dashboard`;
      
      chrome.tabs.create({ url: targetUrl });
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        auditBtn.click();
      }
    });
  }
});
