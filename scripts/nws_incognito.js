//
// A note to reviewers:
//
// This script causes hyperlinks to "Not Safe For Work" imagery (e.g. pornographic images) to open automatically in
// an incognito window when clicked, instead of a normal tab. In Firefox, doing so requires the
// "allowedIncognitoAccess" permission.
//

let NwsIncognito = {
    hookToNwsPosts(item) {
        let allLinks = [];
        let nwsPost = item.querySelector("div.fpmod_nws");
        if (nwsPost) {
            let postBody = nwsPost.querySelector("div.postbody");
            let links = postBody.getElementsByTagName("a");
            for (let iLink = 0; iLink < links.length; iLink++) {
                //Clone the link to get rid of any handlers that were put on it before (like the inline image loader)
                //Of course, that relies on it being done before this.  So... yeah.
                let cloned = links[iLink].cloneNode(true);
                //Add href to collection for open all.
                allLinks.push(cloned.href);
                $(cloned).click(e => {
                    // Note to reviewers: please refer to the top of this file for explanation
                    browser.runtime.sendMessage({ name: "allowedIncognitoAccess" }).then(result => {
                        if (!window.chrome && !result)
                            alert(
                                'This feature will not work unless you enable "Run in Private Windows" in the Chrome Shack addon settings for Firefox!'
                            );
                        browser.runtime.sendMessage({ name: "launchIncognito", value: e.target.href });
                    });
                    return false;
                });

                // prevent reapplying
                if (cloned.innerHTML.indexOf(" (Incognito)") == -1) {
                    cloned.innerHTML += " (Incognito)";
                }
                $(links[iLink]).replaceWith(cloned);

                // remove expando buttons for Incognito mode
                let expando = links[iLink].querySelector("div.expando");
                if (!!expando) expando.parentNode.removeChild(expando);
            }
        }
    }
};

addDeferredHandler(enabledContains("nws_incognito"), res => {
    if (res) processPostEvent.addHandler(NwsIncognito.hookToNwsPosts);
});
