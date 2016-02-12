var localMessage = new Class({
    /**
     *
     * @author Rob Pickering rob@pickering.org
     * @name localMessage
     * @constructor
     * @param {string} [prefix] unique namespace prefix for this
     *  instance of the message class in localStorage.
     * @requires ipcortex/MasquradeJS
     */
    construct: function(prefix) {
        // Stuff we are waiting to post or receive
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
        return (new Promise(function(resolve, reject) {
            this.queue.push({
                pop: false,
                name: name,
                value: value,
                ret: {
                        resolve: resolve,
                        reject: reject
                }
            });
            this._queueRunner({
                key: this.prefix + name
            });
        }));
    },

    /**
     * @function localMessage.receiveMessage
     * @param {string} name - message name we want to listen for
     * @returns {Promise} a promise which resolves to the sent message object
     *
     */

    receiveMessage: function(name) {
        return (new Promise(function(resolve, reject) {
            this.queue.push({
                pop: true,
                name: name,
                ret: {
                    resolve: resolve,
                    reject: reject
                }
            });
            this._queueRunner({
                key: this.prefix + name
            });
        }));

    },

    _queueRunner: function(ev) {

        var item = "";
        // Iterate over queue looking for messages that are pending send or receive
        this.queue.forEach(function(request) {
            var item = localStorage.getItem(this.prefix + request.name);
            var itemExists = (item != null && item.length);
            if ((!ev || ev.key == this.prefix + request.name) && !request.resolved) {
                // This is a pop request and a matching localStorage item has just been posted
                if (request.pop && itemExists) {
                    request.resolved = true;
                    localStorage.removeItem(this.prefix + request.name);
                    request.ret.resolve(JSON.parse(item));
                }
                // This is a push request and matching previous message has just been consumed
                else if (!request.pop && !itemExists) {
                    // Previous post has been received, inform sender and destroy it
                    if (request.sent && !request.resolved) {
                        request.resolved = true;
                        request.ret.resolve(request);
                    }
                    // Put next message off queue into localStorage
                    else {
                        localStorage.setItem(this.prefix + request.name, JSON.stringify(request.value));
                        request.sent = true;
                    }
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
