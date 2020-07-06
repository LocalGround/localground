const mixins = {

    broadcastEvent: (name, srcElement, data) => {
        const customEvent = new CustomEvent(name, {
            bubbles: true,
            detail: data
        });
        srcElement.dispatchEvent(customEvent);
    },

    removeClass: (selector, className) => {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            el.classList.remove(className);
        }
    },

    attachListener: (selector, eventName, listener) => {
        if (typeof selector === 'string') {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                el.addEventListener(eventName, listener, false);
            }
        } else {
            const el = selector;
            el.addEventListener(eventName, listener, false);
        }
    },

    createElementFromHTML: (htmlString) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild; 
    }
}