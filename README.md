# WebComponents-DI
This package aims to provide simple dependency injection for web components. It is based on an idea by Justin Fagnani. 
You can find more details about it here: <https://www.youtube.com/watch?v=6o5zaKHedTE>

The basic idea is that dependencies are requested and provided using events. This project aims to do the following:
* make something similar to the initial implementation available to everyone using web components
* add some icing on top to make it super easy to use

There is a simple demo that illustrates how to use this project. It uses LitElement, but `WebComponents-DI` should 
work with any web component library or framework. 

The general idea goes like this: 
There is a child component which wants to request a dependency from a parent component. The example uses `LitElement`, 
but it should be easy to understand even if you do not know it:

```typescript
import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {requestDI} from 'webcomponents-di';

@customElement('child-component')
export class ChildComponent extends requestDI(LitElement) {
    world: unknown | null = null;

    connectedCallback(): void {
        super.connectedCallback();
        this.world = this.requestInstance('world');
    }

    protected render(): TemplateResult | void {
        return html`
            <div style="background-color: red"><h2>I'm the Child</h2>
                <p>Hello, ${this.world}</p>
            </div>`;
    }
}
```

The only webcomponents-di parts are `requestDI` mixin and the method `requestInstance`. The mixin `requestDI` provides 
all basic functionality to request dependencies. You can find a more advanced example in the example project.
`requestInstance` requests a dependency called `world`. Now to provide this dependency in a parent web component all you do is this:
```typescript
import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {provideDI} from 'webcomponents-di';

@customElement('parent-component')
export class ParentComponent extends provideDI(LitElement) {

    resolveDependency(key: string, options?: unknown): unknown | null {
        if (key === 'world') {
            return 'DI (from parent)';
        }
        return super.resolveDependency(key, options);
    }

    protected render(): TemplateResult | void {
        return html`
        <div style="background-color: blue">
            <h1>I'm the parent</h1>
            <child-component></child-component>
            <advanced-child-component>
        </div>`
    }
}
```
Here the mixin `provideDI` provides a method you can implement called  `resolveDependency`.
It is called whenever a request for a dependency is received from a child component. 
Dependencies are resolved using their key. So if you want to provide a dependency from
your component simply return it. `resolveDependency` takes an optional `options` parameter
which can be used to transfer additional data about the requested dependency.   

So far for the basics. There is also a more sophisticated example in `packages/simple-example`.
It uses Typescript decorators to make the entire process a bit simpler still. 

To test the example, check out this repository, go into `packages/simple-example` and run
`npm start`. 

Note that this project has only been tested with Typescript yet.  

## Contributing
If you want to contribute you can either open issues to start a discussion on bugs or ideas or you can submit a Pull Request directly. To get the project running you need to have `lerna` installed globally. After checking out the project just run `lerna bootstrap` in its root directory. 
## TODO
* Right now dependencies can only be provided if the requesting component is a child component. Need to figure out if it
should be that way
* Some general cleanup/improvements  
* Some more docs
* Tests
