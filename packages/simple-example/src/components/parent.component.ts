import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {provideDI} from 'webcomponents-di/src/mixins';

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