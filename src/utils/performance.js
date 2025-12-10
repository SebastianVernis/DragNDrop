/**
 * Performance Utilities Module
 * Provides debouncing, throttling, and other performance optimization utilities
 * @module utils/performance
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - Options object
 * @param {boolean} options.leading - Invoke on the leading edge of the timeout
 * @param {boolean} options.trailing - Invoke on the trailing edge of the timeout
 * @returns {Function} The debounced function
 */
export function debounce(func, wait = 300, options = {}) {
    const { leading = false, trailing = true } = options;
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    let result = null;

    function invokeFunc() {
        result = func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
        return result;
    }

    function leadingEdge() {
        if (leading) {
            result = invokeFunc();
        }
    }

    function trailingEdge() {
        timeout = null;
        if (trailing && lastArgs) {
            return invokeFunc();
        }
        lastArgs = lastThis = null;
        return result;
    }

    function cancel() {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = lastArgs = lastThis = null;
    }

    function flush() {
        return timeout === null ? result : trailingEdge();
    }

    function debounced(...args) {
        lastArgs = args;
        lastThis = this;

        if (timeout !== null) {
            clearTimeout(timeout);
        }

        if (leading && timeout === null) {
            leadingEdge();
        }

        timeout = setTimeout(trailingEdge, wait);
        return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;

    return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @param {Object} options - Options object
 * @param {boolean} options.leading - Invoke on the leading edge of the timeout
 * @param {boolean} options.trailing - Invoke on the trailing edge of the timeout
 * @returns {Function} The throttled function
 */
export function throttle(func, wait = 100, options = {}) {
    const { leading = true, trailing = true } = options;
    let timeout = null;
    let previous = 0;
    let lastArgs = null;
    let lastThis = null;
    let result = null;

    function invokeFunc(time) {
        previous = time;
        result = func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
        return result;
    }

    function leadingEdge(time) {
        previous = time;
        timeout = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
        const timeSinceLastCall = time - previous;
        return wait - timeSinceLastCall;
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timeout = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
        timeout = null;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = null;
        return result;
    }

    function shouldInvoke(time) {
        const timeSinceLastCall = time - previous;
        return previous === 0 || timeSinceLastCall >= wait;
    }

    function cancel() {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        previous = 0;
        timeout = lastArgs = lastThis = null;
    }

    function flush() {
        return timeout === null ? result : trailingEdge(Date.now());
    }

    function throttled(...args) {
        const time = Date.now();
        lastArgs = args;
        lastThis = this;

        if (!previous && !leading) {
            previous = time;
        }

        const remaining = remainingWait(time);

        if (shouldInvoke(time)) {
            if (timeout === null) {
                return leadingEdge(time);
            }
            if (trailing) {
                timeout = setTimeout(timerExpired, wait);
                return invokeFunc(time);
            }
        }

        if (timeout === null) {
            timeout = setTimeout(timerExpired, remaining);
        }

        return result;
    }

    throttled.cancel = cancel;
    throttled.flush = flush;

    return throttled;
}

/**
 * Caches DOM element references for improved performance
 */
export class DOMCache {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Gets an element by ID, using cache if available
     * @param {string} id - Element ID
     * @returns {Element|null} The element or null
     */
    getElementById(id) {
        if (this.cache.has(id)) {
            const element = this.cache.get(id);
            // Verify element is still in DOM
            if (document.contains(element)) {
                return element;
            }
            // Remove stale reference
            this.cache.delete(id);
        }

        const element = document.getElementById(id);
        if (element) {
            this.cache.set(id, element);
        }
        return element;
    }

    /**
     * Gets elements by selector, with optional caching
     * @param {string} selector - CSS selector
     * @param {boolean} cache - Whether to cache the result
     * @returns {NodeList} The elements
     */
    querySelectorAll(selector, cache = false) {
        if (cache && this.cache.has(selector)) {
            return this.cache.get(selector);
        }

        const elements = document.querySelectorAll(selector);
        if (cache) {
            this.cache.set(selector, elements);
        }
        return elements;
    }

    /**
     * Gets a single element by selector, with optional caching
     * @param {string} selector - CSS selector
     * @param {boolean} cache - Whether to cache the result
     * @returns {Element|null} The element or null
     */
    querySelector(selector, cache = false) {
        if (cache && this.cache.has(selector)) {
            const element = this.cache.get(selector);
            if (document.contains(element)) {
                return element;
            }
            this.cache.delete(selector);
        }

        const element = document.querySelector(selector);
        if (cache && element) {
            this.cache.set(selector, element);
        }
        return element;
    }

    /**
     * Clears the cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Removes a specific cache entry
     * @param {string} key - Cache key to remove
     */
    remove(key) {
        this.cache.delete(key);
    }

    /**
     * Gets cache statistics
     * @returns {Object} Cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

/**
 * Request Animation Frame wrapper for smooth animations
 * @param {Function} callback - Function to call on next frame
 * @returns {number} Request ID
 */
export function nextFrame(callback) {
    return requestAnimationFrame(callback);
}

/**
 * Cancels a request animation frame
 * @param {number} id - Request ID to cancel
 */
export function cancelFrame(id) {
    cancelAnimationFrame(id);
}

/**
 * Batches multiple DOM reads to prevent layout thrashing
 * @param {Array<Function>} reads - Array of read functions
 * @returns {Promise<Array>} Promise resolving to array of results
 */
export function batchReads(reads) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            const results = reads.map(read => read());
            resolve(results);
        });
    });
}

/**
 * Batches multiple DOM writes to prevent layout thrashing
 * @param {Array<Function>} writes - Array of write functions
 * @returns {Promise<void>} Promise resolving when writes complete
 */
export function batchWrites(writes) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            writes.forEach(write => write());
            resolve();
        });
    });
}

/**
 * Measures performance of a function
 * @param {Function} func - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Function} Wrapped function that measures performance
 */
export function measurePerformance(func, label) {
    return function(...args) {
        const start = performance.now();
        const result = func.apply(this, args);
        const end = performance.now();
        console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    };
}

/**
 * Lazy loads an image
 * @param {string} src - Image source URL
 * @param {Object} options - Options
 * @returns {Promise<HTMLImageElement>} Promise resolving to loaded image
 */
export function lazyLoadImage(src, options = {}) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        if (options.crossOrigin) {
            img.crossOrigin = options.crossOrigin;
        }

        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Intersection Observer wrapper for lazy loading
 * @param {Element} element - Element to observe
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Intersection Observer options
 * @returns {IntersectionObserver} The observer instance
 */
export function observeIntersection(element, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
                observer.unobserve(entry.target);
            }
        });
    }, defaultOptions);

    observer.observe(element);
    return observer;
}

/**
 * Memoizes a function result
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Function to resolve cache key
 * @returns {Function} Memoized function
 */
export function memoize(func, resolver) {
    const cache = new Map();

    function memoized(...args) {
        const key = resolver ? resolver(...args) : JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    }

    memoized.cache = cache;
    memoized.clear = () => cache.clear();

    return memoized;
}

/**
 * Creates a singleton DOM cache instance
 */
export const domCache = new DOMCache();

// Export all utilities
export default {
    debounce,
    throttle,
    DOMCache,
    domCache,
    nextFrame,
    cancelFrame,
    batchReads,
    batchWrites,
    measurePerformance,
    lazyLoadImage,
    observeIntersection,
    memoize
};
