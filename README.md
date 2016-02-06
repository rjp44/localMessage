# localMessage

This is a simple implementation of a Javascript class which
passes messages between windows or tabs in a browser that share the same origin.

Messages are passed using only localStorage so it isn't necessary to have a
window object in order to communicate and the mechanism survives a page reload.

If the consuming window is not open, or has not yet called receiveMessage on a name
then the posted message will persist in local storage and be delivered when
it does **even some time later after the sending window is closed**.

This is a neat way to get around the limitations of
[window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
with respect to needing a window reference and inter-tab issues, but
should be used sparingly. It's (ab-)use of persistent localStorage may cause quite
a lot of overhead in the browser as this is written down to disk.
Probably not appropriate to use this class to send large or very frequent messages!

Uses [Masquerade-js](https://github.com/ipcortex/Masquerade-JS) for Class implementation.



## Basic Example (message sender):
```javascript
    var queue = new localMessage();

    queue.postMessage("dial", number);
```

## Basic Example (message receiver in another window):
```javascript
    var queue = new localMessage();

    queue.receiveMessage("dial")
      .then((function(number){
        console.log('asked to dial '+number);
      }));
```

Both postMessage and receiveMessage return promises which resolve when a message is
successfully **received** by the consumer. At present there are no circumstances that
cause either the sender or receiver promise to reject (error). The message either
gets received, it which case both sender and recipient are told, or it is lost silently.
This is probably bad.

## Additional Example (this() execution by sender on receipt):
```javascript
    var queue = new localMessage();
    var message = { type:'new', priority:1, action:'fire'}

    queue.postMessage("doAction", message)
      .then((function(sent){
          console.log('receiver got message type: '+sent.value.type);
      }));
```
# Class definition
<a name="localMessage"></a>
## localMessage
**Kind**: global class  
**Author:** Rob Pickering rob@pickering.org  

* [localMessage](#localMessage)
    * [new localMessage([prefix])](#new_localMessage_new)
    * [.postMessage(name, value)](#localMessage.postMessage) ⇒ <code>Promise</code>
    * [.receiveMessage(name)](#localMessage.receiveMessage) ⇒ <code>Promise</code>

<a name="new_localMessage_new"></a>
### new localMessage([prefix])

| Param | Type | Description |
| --- | --- | --- |
| [prefix] | <code>string</code> | unique namespace prefix for this  instance of the message class in localStorage. |

<a name="localMessage.postMessage"></a>
### localMessage.postMessage(name, value) ⇒ <code>Promise</code>
**Kind**: static method of <code>[localMessage](#localMessage)</code>  
**Returns**: <code>Promise</code> - a promise which resolves when the message is
  received by the consumer  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message name, used by receiving page to listen |
| value | <code>Object</code> | opaque object to pass to receiver |

<a name="localMessage.receiveMessage"></a>
### localMessage.receiveMessage(name) ⇒ <code>Promise</code>
**Kind**: static method of <code>[localMessage](#localMessage)</code>  
**Returns**: <code>Promise</code> - a promise which resolves to the sent message object  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | message name we want to listen for |

