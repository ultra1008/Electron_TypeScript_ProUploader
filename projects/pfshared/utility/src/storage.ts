/**
 * Storage Helper
 */
export const $storage = {
    get: function (key) {
        return window.localStorage.getItem(key);
    },
    set: function (key, val) {
        return window.localStorage.setItem(key, val);
    },
    clear: function () {
        return window.localStorage.clear();
    },
    remove: function (key) {
        return window.localStorage.removeItem(key);
    }
};



