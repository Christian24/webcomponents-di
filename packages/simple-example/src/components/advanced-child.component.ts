import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {inject} from 'webcomponents-di/src/decorators';
import {addDI} from 'webcomponents-di/src/mixins';

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
}