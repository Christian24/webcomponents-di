# WebComponents-DI
This package aims to provide simple dependency injection for web components. It is based on an idea by Justin Fagnani. 
You can find more details about it here: https://www.youtube.com/watch?v=6o5zaKHedTE

The basic idea is that dependencies are requested and provided using events. This project aims to do the following:
* make something similar to the initial implementation available to everyone using web components
* add some icing on top to make it super easy to use

There is a simple demo that illustrates how to use this project. It uses LitElement, but `WebComponents-DI` should 
work with any web component library or framework. 

## TODO
* Release to npm
* Right now dependencies can only be provided if the requesting component is a child component. Need to figure out if it
should be that way
* `onReceiveCallback`: if the advanced enableDI way is used there is no way for the child to know when a dependency is 
received. Maybe will add a callback for this. 
* export library correctly: The src/ in the import path should not be there. 
* Some general cleanup/improvements  