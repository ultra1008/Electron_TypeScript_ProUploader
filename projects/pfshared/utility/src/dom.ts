import { assign, forEach, isNumber, isObject, isFunction } from "./core";
import { IS_BROWSER, WINDOW } from "./constants";

const REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;

/**
 * Apply styles to the given element.
 * @param {Element} element - The target element.
 * @param {Object} styles - The styles for applying.
 */
export function setStyle(element, styles) {
    const { style } = element;

    forEach(styles, (value, property) => {
        if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
            value = `${value}px`;
        }

        style[property] = value;
    });
}

/**
 * Check if the given element has a special class.
 * @param {Element} element - The element to check.
 * @param {string} value - The class to search.
 * @returns {boolean} Returns `true` if the special class was found.
 */
export function hasClass(element, value) {
    return element.classList
        ? element.classList.contains(value)
        : element.className.indexOf(value) > -1;
}

/**
 * Add classes to the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be added.
 */
export function addClass(element, value) {
    if (!value) {
        return;
    }

    if (isNumber(element.length)) {
        forEach(element, (elem) => {
            addClass(elem, value);
        });
        return;
    }

    if (element.classList) {
        element.classList.add(value);
        return;
    }

    const className = element.className.trim();

    if (!className) {
        element.className = value;
    } else if (className.indexOf(value) < 0) {
        element.className = `${className} ${value}`;
    }
}

/**
 * Remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be removed.
 */
export function removeClass(element, value) {
    if (!value) {
        return;
    }

    if (isNumber(element.length)) {
        forEach(element, (elem) => {
            removeClass(elem, value);
        });
        return;
    }

    if (element.classList) {
        element.classList.remove(value);
        return;
    }

    if (element.className.indexOf(value) >= 0) {
        element.className = element.className.replace(value, '');
    }
}

/**
 * Add or remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be toggled.
 * @param {boolean} added - Add only.
 */
export function toggleClass(element, value, added) {
    if (!value) {
        return;
    }

    if (isNumber(element.length)) {
        forEach(element, (elem) => {
            toggleClass(elem, value, added);
        });
        return;
    }

    // IE10-11 doesn't support the second parameter of `classList.toggle`
    if (added) {
        addClass(element, value);
    } else {
        removeClass(element, value);
    }
}

/**
 * Get data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to get.
 * @returns {string} The data value.
 */
export function getData(element, name) {
    if (isObject(element[name])) {
        return element[name];
    }

    if (element.dataset) {
        return element.dataset[name];
    }

    return element.getAttribute(`data-${toParamCase(name)}`);
}

/**
 * Set data to the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to set.
 * @param {string} data - The data value.
 */
export function setData(element, name, data) {
    if (isObject(data)) {
        element[name] = data;
    } else if (element.dataset) {
        element.dataset[name] = data;
    } else {
        element.setAttribute(`data-${toParamCase(name)}`, data);
    }
}

/**
 * Remove data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to remove.
 */
export function removeData(element, name) {
    if (isObject(element[name])) {
        try {
            delete element[name];
        } catch (error) {
            element[name] = undefined;
        }
    } else if (element.dataset) {
        // #128 Safari not allows to delete dataset property
        try {
            delete element.dataset[name];
        } catch (error) {
            element.dataset[name] = undefined;
        }
    } else {
        element.removeAttribute(`data-${toParamCase(name)}`);
    }
}

const REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;

/**
 * Transform the given string from camelCase to kebab-case
 * @param {string} value - The value to transform.
 * @returns {string} The transformed value.
 */
export function toParamCase(value) {
    return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
}

/**
 * Remove event listener from the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */
export function removeListener(element, type, listener, options = {}) {
    let handler = listener;

    type.trim().split(REGEXP_SPACES).forEach((event) => {
        if (!onceSupported) {
            const { listeners } = element;

            if (listeners && listeners[event] && listeners[event][listener]) {
                handler = listeners[event][listener];
                delete listeners[event][listener];

                if (Object.keys(listeners[event]).length === 0) {
                    delete listeners[event];
                }

                if (Object.keys(listeners).length === 0) {
                    delete element.listeners;
                }
            }
        }

        element.removeEventListener(event, handler, options);
    });
}

const REGEXP_SPACES = /\s\s*/;
const onceSupported = (() => {
    let supported = false;

    if (IS_BROWSER) {
        let once = false;
        const listener = () => { };
        const options = Object.defineProperty({}, 'once', {
            get() {
                supported = true;
                return once;
            },

            /**
             * This setter can fix a `TypeError` in strict mode
             * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
             * @param {boolean} value - The value to set
             */
            set(value) {
                once = value;
            },
        });

        WINDOW.addEventListener('test', listener, options);
        WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
})();

/**
 * Add event listener to the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */
export function addListener(element, type, listener, options: any = {}) {
    let handler = listener;

    type.trim().split(REGEXP_SPACES).forEach((event) => {
        if (options.once && !onceSupported) {
            const { listeners = {} } = element;

            handler = (...args) => {
                delete listeners[event][listener];
                element.removeEventListener(event, handler, options);
                listener.apply(element, args);
            };

            if (!listeners[event]) {
                listeners[event] = {};
            }

            if (listeners[event][listener]) {
                element.removeEventListener(event, listeners[event][listener], options);
            }

            listeners[event][listener] = handler;
            element.listeners = listeners;
        }

        element.addEventListener(event, handler, options);
    });
}

/**
 * Dispatch event on the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Object} data - The additional event data.
 * @returns {boolean} Indicate if the event is default prevented or not.
 */
export function dispatchEvent(element, type, data) {
    let event;

    // Event and CustomEvent on IE9-11 are global objects, not constructors
    if (isFunction(Event) && isFunction(CustomEvent)) {
        event = new CustomEvent(type, {
            detail: data,
            bubbles: true,
            cancelable: true,
        });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
}

/**
 * Get the offset base on the document.
 * @param {Element} element - The target element.
 * @returns {Object} The offset data.
 */
export function getOffset(element) {
    const box = element.getBoundingClientRect();

    return {
        left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
        top: box.top + (window.pageYOffset - document.documentElement.clientTop),
    };
}

/**
 * Get transforms base on the given object.
 * @param {Object} obj - The target object.
 * @returns {string} A string contains transform values.
 */
export function getTransforms({
    rotate,
    scaleX,
    scaleY,
    translateX,
    translateY,
}) {
    const values = [];

    if (isNumber(translateX) && translateX !== 0) {
        values.push(`translateX(${translateX}px)`);
    }

    if (isNumber(translateY) && translateY !== 0) {
        values.push(`translateY(${translateY}px)`);
    }

    // Rotate should come first before scale to match orientation transform
    if (isNumber(rotate) && rotate !== 0) {
        values.push(`rotate(${rotate}deg)`);
    }

    if (isNumber(scaleX) && scaleX !== 1) {
        values.push(`scaleX(${scaleX})`);
    }

    if (isNumber(scaleY) && scaleY !== 1) {
        values.push(`scaleY(${scaleY})`);
    }

    const transform = values.length ? values.join(' ') : 'none';

    return {
        WebkitTransform: transform,
        msTransform: transform,
        transform,
    };
}


/**
 * Get the max ratio of a group of pointers.
 * @param {string} pointers - The target pointers.
 * @returns {number} The result ratio.
 */
export function getMaxZoomRatio(pointers) {
    const pointers2 = assign({}, pointers);
    const ratios = [];

    forEach(pointers, (pointer, pointerId) => {
        delete pointers2[pointerId];

        forEach(pointers2, (pointer2) => {
            const x1 = Math.abs(pointer.startX - pointer2.startX);
            const y1 = Math.abs(pointer.startY - pointer2.startY);
            const x2 = Math.abs(pointer.endX - pointer2.endX);
            const y2 = Math.abs(pointer.endY - pointer2.endY);
            const z1 = Math.sqrt((x1 * x1) + (y1 * y1));
            const z2 = Math.sqrt((x2 * x2) + (y2 * y2));
            const ratio = (z2 - z1) / z1;

            ratios.push(ratio);
        });
    });

    ratios.sort((a, b) => Math.abs(a) < Math.abs(b) ? -1 : 1);

    return ratios[0];
}

/**
 * Get a pointer from an event object.
 * @param {Object} event - The target event object.
 * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
 * @returns {Object} The result pointer contains start and/or end point coordinates.
 */
export function getPointer({ pageX, pageY }, endOnly) {
    const end = {
        endX: pageX,
        endY: pageY,
    };

    return endOnly ? end : assign({
        startX: pageX,
        startY: pageY,
    }, end);
}

/**
 * Get the center point coordinate of a group of pointers.
 * @param {Object} pointers - The target pointers.
 * @returns {Object} The center point coordinate.
 */
export function getPointersCenter(pointers) {
    let pageX = 0;
    let pageY = 0;
    let count = 0;

    forEach(pointers, ({ startX, startY }) => {
        pageX += startX;
        pageY += startY;
        count += 1;
    });

    pageX /= count;
    pageY /= count;

    return {
        pageX,
        pageY,
    };
}
