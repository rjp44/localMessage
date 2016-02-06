## localMessage

This is a simple implementation of a Javascript class which should runs in a browser and
passes messages between windows or tabs that share the same origin.

Messages are passed using only localStorage so it isn't necessary to have a
window object in order to communicate and the mechanism survives a page reload.

If the consumer window is not open, or has not yet called receiveMessage on a name
then the posted message will persist in local storage and be delivered when
it does **even some time later after he sending window is closed**.

Uses [Masquerade-js](https://github.com/ipcortex/Masquerade-JS) for Class implementation

Basic Example (message sender):
    var queue = new localMessage();
    queue.postMessage("dial", number);


Basic Example (message receiver in another window):
    var queue = new localMessage();

    queue.receiveMessage("dial")
      .then((function(number){
        console.log('asked to dial '+number);
      }));

Additional Example (send complex object, fire then() when it is received):
    var queue = new localMessage();
    var message = { type:'new', priority:1, action:'fire'}

    queue.postMessage("doAction", message)
      .then((function(sent){
          console.log('receiver got message type: '+sent.value.type);
      }));
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

