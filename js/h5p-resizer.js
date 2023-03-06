//UOFR Hack Custom H5P resizer
//First find all iframes that contain "mod/hvp/embed.php" in the src attribute
var iframes = document.querySelectorAll('iframe[src*="mod/hvp/embed.php"]');

// Create an array to store the original height of each iframe
var originalHeights = [];

// Loop through each iframe and add the custom class and store the original height
for (var i = 0; i < iframes.length; i++) {
  var iframe = iframes[i];
  iframe.classList.add('h5p-custom-class');
  //originalHeights.push(iframe.offsetHeight);
}

var iframes = document.querySelectorAll('iframe');
for (var i = 0; i < iframes.length; i++) {
  const iframe = iframes[i];
// Add a load event listener that will wait for all the dom elements, 1st to load.
window.addEventListener('load', function() {
  //Use Mutation observer since (message API eventlistener) is not reliable to resize the iframe.
  //which can lead to performance problems and unexpected behavior.
  const newObserver = new MutationObserver(function(mutationsList, observer) {
    for(var mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // User has interacted with iframe content
        console.log('User interacted with iframe content');
        break;
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // A div inside the iframe has been resized
        resizeIframes();
        console.log('H5P iframe has been resized to the correct value');
        break;
      }
    }
  });

  newObserver.observe(iframe.contentWindow.document, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
});
}


// Resize all H5P iframes, we are not going to use (message API eventlistener) is not reliable to resize the iframe and avoid flikering.
function resizeIframes() {
  // Loop through each iframe with the custom class
  var iframes = document.querySelectorAll('.h5p-custom-class');
  for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    console.log('Iframe ready:', iframe);

    // Set iframe height based on content
    const elements = iframe.contentWindow.document.querySelectorAll('.completion-info');
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    var sectionEmbed = iframe.contentWindow.document.querySelector('.embedded-main');
    var sectionHeight = sectionEmbed.offsetHeight;
    //console.log('Section height:', sectionHeight);
    var newHeightWithExtra = sectionHeight + 30;
    originalHeights[i] = newHeightWithExtra;
    iframe.style.height = newHeightWithExtra + 'px';
    iframe.style.width = '100%';
    console.log('Result - Iframe height + Section height:', newHeightWithExtra);

  }
 
}

window.addEventListener('load', function() {
  // Resize all H5P iframes immediately
  resizeIframes();

  //Just in case Set a timeout to attempt resizing again after a certain period of time
  setTimeout(function() {
    resizeIframes();
  }, 1000);

  console.log('Custom iframe resizing code loaded.');
});
