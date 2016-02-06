## localMessage

This is a simple implementation of a Javascript class which should run in any ECMA5 browser and
pass messages between any windows or tabs that share the same origin.

Messages are passed using only localStorage so it isn't necessary to have a
window object in order to communicate and the mechanism survives a page reload.

If the consumer window is not open, or has not yet called receiveMessage on a name
then the posted message will persist in local storage and be delivered when
it does ** even some time later after he sending window is closed **.
