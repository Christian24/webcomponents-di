# WebComponents-DI
This package aims to provide simple dependency injection for web components. It is based on an idea by Justin Fagnani. 
You can find more details about it here: https://www.youtube.com/watch?v=6o5zaKHedTE

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
all basic functionality to request dependencies. You can find a more advanced example in example project.
All this does is request a dependency called `world`. Now to provide this in the parent all you do is this:
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
Note that here the mixin is called `provideDI` the method is called `resolveDependency`. Again, a more elaborate example
can be found in the demo project. 
## TODO
* Release to npm
* Right now dependencies can only be provided if the requesting component is a child component. Need to figure out if it
should be that way
* Some general cleanup/improvements  