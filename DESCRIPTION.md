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
