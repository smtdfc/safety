export function getCurrentURL(): Promise < string > {
  return new Promise((re, rj) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      if(!url) return rj();
      re(url);
    });
  });
}