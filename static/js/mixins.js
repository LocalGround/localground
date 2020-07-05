const mixins = {

    broadcastEvent: (name, ev, data) => {
        const customEvent = new CustomEvent(name, {
            bubbles: true,
            detail: data
        });
        ev.currentTarget.dispatchEvent(customEvent);
    },

    removeClass: (selector, className) => {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            el.classList.remove(className);
        }
    },

    attachListener: (selector, eventName, listener) => {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            el.addEventListener(eventName, listener);
        }
    }
}