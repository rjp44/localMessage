var localMessage = new Class({
    /**
     * Class for passing messages between any windows or tabs within a browser that
     * share the same origin.
     *
     * Messages are passed using only localStorage so it isn't necessary to have a
     * window object in order to communicate and the mechanism survives a page reload.
     *
     * If the consumer window is not open, or has not yet called receiveMessage on a name
     * then the posted message will persist in local storage and be delivered when
     * it does ** even some time later after he sending window is closed **.
     *
     * Class implemented using {@link https://github.com/ipcortex/Masquerade-JS ipcortex Masquerade-JS}
     * @author Rob Pickering rob@pickering.origin
     * @name localMessage
     * @constructor
     * @param {string} [prefix] unique namespace prefix for this
     *  instance of the message class in localStorage.
     * @requires ipcortex/MasquradeJS
     */
    construct: function(prefix) {
        // Stuff we are waiting to post (e.g. because there is an unconsumed message with the same key)
        this.queue = [];

        this.prefix = (prefix) ? prefix : "localMessage$";
        window.addEventListener('storage', (function(event) {
            this._queueRunner(event);
        }).bind(this));
    },

    /**
     * @function localMessage.postMessage
     * @param {string} name - message name, used by receiving page to listen
     * @param {Object} value - opaque object to pass to receiver
     * @returns {Promise} a promise which resolves when the message is
     *   received by the consumer
     */
    postMessage: function(name, value) {
        var ret = Promise.defer();
        this.queue.push({
            pop: false,
            name: name,
            value: value,
            ret: ret
        });
        this._queueRunner({
            key: this.prefix + name
        });
        return ret.promise;
    },

    /**
     * @function localMessage.receiveMessage
     * @param {string} name - message name we want to listen for
     * @returns {Promise} a promise which resolves to the sent message object
     *
     */

    receiveMessage: function(name) {
        var ret = Promise.defer();
        this.queue.push({
            pop: true,
            name: name,
            ret: ret
        });
        this._queueRunner({
            key: this.prefix + name
        });
        return ret.promise;
    },

    _queueRunner: function(ev) {

        var item = "";
        // Iterate over queue looking for messages that are pending send or receive
        this.queue.forEach(function(request) {
            var item = localStorage.getItem(this.prefix + request.name);
            var itemExists = (item != null && item.length);
            if ((!ev || ev.key == this.prefix + request.name) && !request.resolved)
            // This is a pop request and a matching localStorage item has been posted
                if (request.pop && itemExists) {
                    request.resolved = true;
                    localStorage.removeItem(this.prefix + request.name);
                    request.ret.resolve(JSON.parse(item));
                }
                // This is a push request and any previous message has been consumed
                else if (!request.pop && !itemExists) {
                // Previous post has been received, inform sender and destroy it
                if (request.sent && !request.resolved) {
                    request.resolved = true;
                    request.ret.resolve(request.name);
                }
                // Send next message off queue
                else {
                    localStorage.setItem(this.prefix + request.name, JSON.stringify(request.value));
                    request.sent = true;
                }
            }
        }, this);

        // Clean up resolved requests
        this.queue.slice().reverse().forEach(function(r, i, o) {
            if (r.resolved) {
                this.queue.splice(o.length - 1 - i, 1);
            }
        }, this);

    }
});
