import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {inject} from 'webcomponents-di';
import {addDI} from 'webcomponents-di';

@customElement('advanced-child-component')
export class AdvancedChildComponent extends addDI(LitElement) {
    @inject('world', {uppercase: true})
    world: string | null = null;


    protected render(): TemplateResult | void {
        return html`
            <div style="background-color: orange"><h2>I'm the Advanced Child</h2>
                <p>Hello, ${this.world}</p>
            </div>`;
    }

    receiveDependency(value: unknown, key: string, options?: unknown) {
        super.receiveDependency(value, key, options);
        if (key=== 'world') {
            console.log(`Dependency: ${key} received value is: ${value}/options were ${options.uppercase}`);
        }
    }
}