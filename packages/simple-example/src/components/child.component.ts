import {customElement, LitElement, TemplateResult, html} from 'lit-element';
@customElement('child-component')
export class ChildComponent extends LitElement{
    protected  render(): TemplateResult | void {
        return html`<div style="background-color: red"><h1>Child</h1></div>`;
    }
}