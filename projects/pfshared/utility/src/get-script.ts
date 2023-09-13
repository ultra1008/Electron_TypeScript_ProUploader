/**
 * Dynamically load a cached script
 * http://api.jquery.com/jquery.getScript/
 * 
 * @example
 * $getScript("test.js").then(function(script, textStatus) {
 *      console.log( textStatus );
 * });
 * 
 */
export function $getScript(url: string, options?) {
    // allow user to set any option except for dataType, cache, and url
    options = Object.assign(options || {},
        {
            dataType: "script",
            cache: true,
            url: url
        });

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    // !!! return $.ajax(options);
}
