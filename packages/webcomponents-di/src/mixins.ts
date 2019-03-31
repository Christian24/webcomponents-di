import {DependenciesMap, optionsType} from './common';

export interface WebComponent extends HTMLElement {
    connectedCallback(): void;

    disconnectedCallback(): void;
}

export interface BasicDIComponent extends WebComponent {
    requestInstance(key: string, options?: optionsType): unknown | null;
}

interface RequestDependencyEventDetail {
    key: string;
    options?: optionsType;
    provider?: () => unknown;
}

export interface AdvancedDIWebComponentConstructor extends BasicDIComponent {
    _dependenciesMap?: DependenciesMap;

    _ensureDependenciesExist?(): void;

    createDependency(key: string, value: PropertyKey): void;
}

export type Constructor<T = WebComponent> = new (...args: any[]) => T;
export type BasicConstructor<T = BasicDIComponent> = new (...args: any[]) => T;

const requestEventName: string = 'WEBCOMPONENTS-DI: REQUEST';


/**
 * Allows providing dependecies to other components
 * @param base
 */
export function provideDI<TBase extends Constructor>(base: TBase) {
    return class extends base {


        /**
         * Looks for the requested dependency
         * @param eventTarget
         */
        handleRequestEvent(eventTarget: Event): void {

            const event: CustomEvent<RequestDependencyEventDetail> = <CustomEvent<RequestDependencyEventDetail>>eventTarget;
            console.log(event);
            // Get information about the requested dependency
            const detail: RequestDependencyEventDetail = event.detail;
            // Try to resolve it
            const dependency: null | unknown = this.resolveDependency(detail.key, detail.options);
            if (dependency !== null) {
                // We did find the requested dependency let's pack it and send it back
                event.detail.provider = () => dependency;
                // Let the requester know we resolved the dependency
                event.preventDefault();
                // Stop this from bubbling up as we have resolved it
                event.stopPropagation();
            }
        }


        /**
         * This is the actual part where you should check if you have the requested dependency and return it
         * @param key the name of the requested dependency
         * @param options the optional options
         */
        // @ts-ignore
        resolveDependency(key: string, options?: unknown): unknown | null {
            return null;
        }


        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }

            this.addEventListener(requestEventName, this.handleRequestEvent.bind(this));

        }

        disconnectedCallback() {
            if (super.disconnectedCallback !== undefined) {
                super.disconnectedCallback();
            }

            this.removeEventListener(requestEventName, this.handleRequestEvent.bind(this));
        }
    };
}

/**
 * Mixin that allows a component to request dependencies
 * @param base
 */
export function requestDI<TBase extends Constructor>(base: TBase) {
    return class extends base implements BasicDIComponent {
        /**
         * Request a dependency from a component up the tree
         * @param key the name of the dependency to request
         * @param options an optional object of options you want the providing component to know, for example if you want a reference to a singleton or a new instance
         * @return the instance of the requested instance or null if none was found
         */
        requestInstance(key: string, options?: unknown): unknown | null {
            let event = new CustomEvent<RequestDependencyEventDetail>(requestEventName, {
                detail: {key, options},
                bubbles: true,
                cancelable: true,
                composed: true
            });
            this.dispatchEvent(event);
            if (event.defaultPrevented) {
                // @ts-ignore
                return event.detail.provider();
            } else {
                throw new Error(`no provider found for ${key}`);
            }

            return null;
        }


    };
}

/**
 * Use this on a CustomElement to allow it to receive Dependencies on connectedCallback
 * Dependencies can be created with createDependency or the inject decorator
 * @param target
 */
export function enableDI<T extends BasicConstructor>(target: T) {

    return class extends target {
        static _dependenciesMap?: DependenciesMap;

        static _ensureDependenciesExist(): void {
            if (this._dependenciesMap === undefined) {
                this._dependenciesMap = new Map();
                const superDependencies: DependenciesMap = Object.getPrototypeOf(this)._dependenciesMap;
                if (superDependencies !== undefined) {
                    superDependencies.forEach(
                        (v: PropertyKey, k: string) =>
                            this._dependenciesMap!.set(k, v));
                }
            }
        }

        /**
         * Creates a new dependency
         * @param key the name of the dependency
         * @param value the value that will be injected
         */
        static createDependency(key: string, value: PropertyKey) {
            this._ensureDependenciesExist();
            this._dependenciesMap!.set(key, value);
        }

        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }
            const constructor = <AdvancedDIWebComponentConstructor><unknown>this.constructor;
            if (constructor._ensureDependenciesExist !== undefined) {
                constructor._ensureDependenciesExist();
            } else {
                throw new Error('createDependency not found, did you forget to add @enableDI to your component?')
            }

            if (constructor._dependenciesMap !== undefined) {

                constructor._dependenciesMap.forEach((value: PropertyKey, key: string) => {
                    console.log(`key: ${key} value: ${value.toString()}`);
                    console.log(this.requestInstance)
                    // @ts-ignore
                    this[value.toString()] = this.requestInstance(key);
                });
            }
        }
    };
}

/**
 * Adds the full functionality of receiving dependencies with decorators and all
 * @param target
 */
export function addDI(target: Constructor) {
    return enableDI(requestDI(target));
}



