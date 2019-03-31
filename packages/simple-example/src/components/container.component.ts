import {customElement, LitElement, TemplateResult, html} from 'lit-element';
@customElement('container-component')
export class ContainerComponent extends LitElement{

    protected render(): TemplateResult | void {
        return html`
        <div style="background-color: blue">
            <h1>I'm the container</h1>
            <slot>
            
            </slot>
        </div>`
    }
}