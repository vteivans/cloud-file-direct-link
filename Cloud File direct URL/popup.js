

window.onload = function () {
    var urlContainer = document.getElementById("url-container");
    var errorView = document.getElementById('error'),
        resultView = document.getElementById('result'),
        introView = document.getElementById('intro');

    // First we get the active tab - the one user is looking at right now:
    chrome.tabs.query({
        active: true,               // Select active tabs
        lastFocusedWindow: true     // In the current window
    },
    function (tabs) {
        // Since there can only be one active tab in one active window,
        //  the array has only one element
        var tab = tabs[0];

        if (!tab) {
           showError('No active tab');
            return;
        }
        var embedURL = createGoogleDriveURL(tab.url);

        if (!embedURL) {
            showError("URL of current tab isn't Google drive file URL!");
            return;
        }

        // Display URL
        showResult(embedURL);

        /*
        input.focus();
        setTimeout(() => {
            input.setSelectionRange(0, input.value.length);
        }, 0);
        */


    });

    function showError(message) {
        if (resultView) {
            resultView.classList.remove('result');
        }
        if (introView) {
            introView.classList.remove('intro');
        }

        if (!errorView) {
            console.error("No error view! Can't show error: " + message);
            return;
        }
        errorView.querySelector('p').innerHTML = message;
        errorView.classList.add('error');
    }

    function showResult(result) {
        if (errorView) {
            errorView.classList.remove('error');
        }
        if (introView) {
            introView.classList.remove('intro');
        }

        if (!resultView) {
            showError('No result view!');
            return;
        }

        var resultOutput = resultView.querySelector('input');
        var copyButton = resultView.querySelector('button');
        if (!resultOutput) {
            showError('No result output!');
            return;
        }

        resultOutput.value = result;

        resultOutput.addEventListener('click', function (event) {
            resultOutput.focus();
            setTimeout(() => {
                resultOutput.setSelectionRange(0, resultOutput.value.length);
            }, 0);
        }, null);

        if (copyButton) {
            copyButton.addEventListener('click', function (event) {
                resultOutput.focus();
                setTimeout(() => {
                    resultOutput.setSelectionRange(0, resultOutput.value.length);
                    document.execCommand('copy');
                }, 0);
            }, null);
        }

        resultView.classList.add('result');
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
