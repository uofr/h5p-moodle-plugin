//UOFR Hack dapiawej Custom H5P iframes resizer update September 13, 2023
//Update August 2025
// Function to initialize resize and observer for a h5p iframe
function initIframeResize(iframe) {
  if (iframe.classList.contains('h5p-custom-class')) {
    console.log('[H5P Resizer] Skipped — already initialized:', iframe);
    return; // Prevent double init
  }

  iframe.classList.add('h5p-custom-class');
  console.log('[H5P Resizer] Initializing iframe:', iframe);

  iframe.addEventListener('load', function() {
    console.log('[H5P Resizer] Iframe loaded, setting up observer:', iframe);

    try {
      const doc = iframe.contentWindow.document;

      const observer = new MutationObserver(function(mutationsList) {
        console.log('[H5P Resizer] Mutation observed in iframe:', iframe);
        for (let mutation of mutationsList) {
          if (
            mutation.type === 'childList' ||
            (mutation.type === 'attributes' && mutation.attributeName === 'style')
          ) {
            console.log('[H5P Resizer] Triggering resize due to mutation:', mutation);
            resizeSingleIframe(iframe);
            break;
          }
        }
      });

      observer.observe(doc, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });

      console.log('[H5P Resizer] MutationObserver attached for iframe.');
      resizeSingleIframe(iframe);

    } catch (e) {
      console.warn('[H5P Resizer] Could not observe iframe:', e);
    }
  });
}

// Resize only the given iframe
function resizeSingleIframe(iframe) {
  try {
    const sectionEmbed = iframe.contentWindow.document.querySelector('.embedded-main');
    if (!sectionEmbed) {
      console.warn('[H5P Resizer] .embedded-main not found in iframe.');
      return;
    }

    const sectionHeight = sectionEmbed.offsetHeight;
    const newHeight = sectionHeight + 30;

    iframe.style.height = newHeight + 'px';
    iframe.style.width = '100%';

    console.log('[H5P Resizer] Resized iframe to height:', newHeight);
  } catch (e) {
    console.warn('[H5P Resizer] Error resizing iframe:', e);
  }
}

// Process all current iframes on the page
function initAllCurrentIframes() {
  console.log('[H5P Resizer] Scanning for existing iframes...');
  document.querySelectorAll('iframe[src*="mod/hvp/embed.php"]').forEach(initIframeResize);
}

// Initial run for existing iframes
initAllCurrentIframes();

// Watch for new iframes injected by AJAX
new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.tagName === 'IFRAME' && node.src.includes('mod/hvp/embed.php')) {
        console.log('[H5P Resizer] Detected new iframe via AJAX:', node);
        initIframeResize(node);
      } else if (node.nodeType === 1) {
        //check inside containers (in case iframe is nested in a div)
        const nestedIframes = node.querySelectorAll?.('iframe[src*="mod/hvp/embed.php"]');
        if (nestedIframes && nestedIframes.length > 0) {
          console.log('[H5P Resizer] Detected nested iframes via AJAX:', nestedIframes);
          nestedIframes.forEach(initIframeResize);
        }
      }
    });
  });
}).observe(document.body, { childList: true, subtree: true });
