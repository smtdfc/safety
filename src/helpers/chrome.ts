import { PageInfo } from "../types";

export function getCurrentURL(): Promise < string > {
  return new Promise((re, rj) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      if (!url) return rj();
      re(url);
    });
  });
}

export function getCurrentPageInfo(): Promise < PageInfo > {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id || !tab.url) return reject("No active tab");
      
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => ({
            content: document.documentElement.outerHTML,
            title: document.title,
            redirect: document.referrer,
          }),
        });
        
        const pageInfo: PageInfo = {
          url: tab.url,
          pageMetadata: {
            title: result.result.title || "",
            redirect: result.result.redirect || "",
          },
          content: result.result.content || "",
          accessTime: new Date().toISOString(),
        };
        
        resolve(pageInfo);
      } catch (err) {
        reject(err);
      }
    });
  });
}