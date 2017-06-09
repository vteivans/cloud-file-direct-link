window.onload = function () {
  var urlContainer = document.getElementById("url-container");
  var errorView = document.getElementById('error'),
      resultView = document.getElementById('result'),
      introView = document.getElementById('intro');
  var resultOutput = resultView.querySelector('input'),
      copyButton = resultView.querySelector('button');

  // First we get the active tab - the one user is looking at right now:
  chrome.tabs.query({
    active: true,               // Select active tabs
    lastFocusedWindow: true     // In the current window
  },
  function (tabs) {
    // Get the current tab:
    var tab = tabs[0];

    // Generate URL for Google Drive
    var embedURL = createGoogleDriveURL(tab.url);

    if (!embedURL) {
      showError("URL of current tab isn't Google drive file URL!");
      return;
    }

    // Hide error and intro information:
    errorView.classList.remove('error');
    introView.classList.remove('intro');

    // When input gets clicked, select the URL
    resultOutput.addEventListener('click',
      function clickURLInputOutput (event) {
        resultOutput.focus();
        setTimeout(() => {
          resultOutput.setSelectionRange(0, resultOutput.value.length);
        }, 0);
      }, null);

    // When copy button gets clicked, copy the URL and close the popup
    copyButton.addEventListener('click',
      function clickCopyURLButton (event) {
        resultOutput.focus();
        setTimeout(() => {
          resultOutput.setSelectionRange(0, resultOutput.value.length);
          document.execCommand('copy');
          window.close();
        }, 0);
      }, null);

    // Show the result
    resultOutput.value = embedURL;
    resultView.classList.add('result');
  });


  function showError(message) {
    resultView.classList.remove('result');
    introView.classList.remove('intro');

    errorView.querySelector('p').innerHTML = message;
    errorView.classList.add('error');
  }
};


function createGoogleDriveURL(url) {
  var fileIDRegEx = /drive\.google\.com\/file\/d\/([^\/]+)/;
  var urlFragments = String(url).match(fileIDRegEx);

  if (urlFragments.length < 2) {
    return;
  }

  return 'https://drive.google.com/uc?export=view&id=' + urlFragments[1];
}
