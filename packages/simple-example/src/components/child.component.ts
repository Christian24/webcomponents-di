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