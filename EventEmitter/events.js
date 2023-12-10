//here we will create our EventEmiiter in Node.js
module.exports = class EventEmitter {
    listeners = {} //master object

    addListener(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
        return this;
    }

    on(eventName, fn) {
        return this.addListener(eventName, fn);
    }

    once(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        const onceWrapper = () => {
            fn();
            this.off(eventName, onceWrapper);
        }
        this.listeners[eventName].push(onceWrapper);
        return this;
    }

    off(eventName, fn) {
        return this.removeListener(eventName, fn);
    }

    removeListener(eventName, fn) {
        let lis = this.listeners[eventName];
        if (!lis) return this;
        for (let i =0; i<=lis.length; i++) {
            if (lis[i].toString() === fn.toString()) {
                lis.splice(i, 1);
                break;
            }
        }
        return this;
    }

    emit(eventName, ...args) {
        let fns = this.listeners[eventName];
        if (!fns) return false;
        fns.forEach((f) => {
            f(...args);
        });
        return true;
    }

    listenerCount(eventName) {
        let fns = this.listeners[eventName] || [];
        return fns.length;
    }

    rawListeners(eventName) {
        return this.listeners[eventName];
    }
}