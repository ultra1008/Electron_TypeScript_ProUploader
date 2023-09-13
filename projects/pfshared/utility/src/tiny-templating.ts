/**
 * tiny templating engine
 * http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
 * 
 * @example
 * $tt("Hello {who}!", { who: "JavaScript" });
 * // "Hello JavaScript!"
 * 
 * @example
 * $tt("Hello {who}! It's {time} ms since epoch.", { who: "JavaScript", time: Date.now });
 * // "Hello JavaScript! It's 1299680443046 ms since epoch."
 * 
 */
export function $tt(s, d) {
    for (let p in d) {
        if (d.hasOwnProperty(p)) {
            s = s.replace(new RegExp(`{${p}}`, "g"), d[p]);
        }
    }
    return s;
}
