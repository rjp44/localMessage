# localMessage

This is a simple implementation of a Javascript class which
passes messages between windows or tabs in a browser that share the same origin.

Messages are passed using only localStorage so it isn't necessary to have a
window object in order to communicate and the mechanism survives a page reload.

If the consuming window is not open, or has not yet called receiveMessage on a name
then the posted message will persist in local storage and be delivered when
it does **even some time later after the sending window is closed**.

This is a neat way to get around the limitations of the browser [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
mechanism with respect to needing a window reference and inter-tab issues, but
should probably be used sparingly. It's (ab-)use of localStorage probably causes quite
a lot of overhead in the browser as this is a persistent which is written down to disk.
It probably isn't appropriate to use this class to send large or very frequent messages.

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
