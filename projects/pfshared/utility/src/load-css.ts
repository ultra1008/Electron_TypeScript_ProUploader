/**
 * Dynamically load a CSS style sheet
 * 
 * `href` [REQUIRED] is the URL for your CSS file.
 * `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
 *  By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
 * `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
 * 
 */
export function $loadCSS(href: string, before?, media?: string) {
    var doc = document;
    var ss = doc.createElement("link");
    var ref: Node & ChildNode;
    if (before) {
        ref = before;
    } else {
        const refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
        ref = refs[refs.length - 1];
    }

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = "only x";

    // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
    function ready(cb: any) {
        if (doc.body) {
            return cb();
        }
        setTimeout(() => {
            ready(cb);
        });
    }

    // Inject link
    // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
    // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    ready(() => {
        ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
    });

    // A method (exposed on returned object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
    var onLoadCssDefined = callback => {
        const resolvedHref = ss.href;
        var i = sheets.length;
        while (i--) {
            if (sheets[i].href === resolvedHref) {
                return callback();
            }
        }
        setTimeout(() => {
            onLoadCssDefined(callback);
        });
    };

    function loadCallback() {
        if (ss.addEventListener) {
            ss.removeEventListener("load", loadCallback);
        }
        ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if (ss.addEventListener) {
        ss.addEventListener("load", loadCallback);
    }

    (ss as any).onloadcssdefined = onLoadCssDefined;

    onLoadCssDefined(loadCallback);

    return ss;
}
