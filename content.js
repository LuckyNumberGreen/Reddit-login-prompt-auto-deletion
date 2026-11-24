// helper function that searches the normal webpage and shadow doms
function findAndDestroyPopup(root = document) {
// find the headline ID 
const headline = root.querySelector('#desktop-dynamic-upsell-headline');

if (headline) {
    // check if it is in a shadow dom
    const rootNode = headline.getRootNode();
    
    if (rootNode instanceof ShadowRoot && rootNode.host) {
        // delete the entire web component holding both the box and overlay
        console.log('Removed Reddit popup master component:', rootNode.host.tagName);
        rootNode.host.remove();
    } else {
      // delete the 720px box directly if it's not in a shadow root
    const mainBox = headline.closest('.w-\\[720px\\]') || headline.parentElement;
    if (mainBox) mainBox.remove();
    }
    
    unlockScroll();
}


const overlays = root.querySelectorAll('div[part="overlay"].dialog-overlay');
overlays.forEach((overlay) => {
    overlay.remove();
    unlockScroll();
});

// dig into any shadow dom on the page 
const allElements = root.querySelectorAll('*');
for (const el of allElements) {
    if (el.shadowRoot) {
        findAndDestroyPopup(el.shadowRoot);
    }
}
}

// reenable scrolling in case the popup locked it
function unlockScroll() {
if (document.body) {
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
}
if (document.documentElement) {
    document.documentElement.style.overflow = '';
}
}

// run immediately when the page loads
findAndDestroyPopup();

// watch the page continuously (throttled)
let timeout = null;
const observer = new MutationObserver(() => {
if (!timeout) {
    timeout = setTimeout(() => {
        findAndDestroyPopup();
        timeout = null;
        }, 100); // at most once every 100 ms when the page updates
}
});

observer.observe(document.documentElement, {
childList: true,
subtree: true
});