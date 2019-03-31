import { requestDI} from './mixins';
import {DependenciesMap} from './common';

/**
 * Use this on a CustomElement to allow it to receive Dependencies on connectedCallback
 * Dependencies can be created with createDependency or the inject decorator
 * @param target
 */
export function enableDI(target: any) {
    return class extends requestDI(target) {
        static _dependenciesMap?: DependenciesMap;

        static _ensureDependenciesExist() {
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
            super.connectedCallback();

            this.constructor._ensureDependenciesExist();

            this.constructor._dependenciesMap.forEach((value: PropertyKey, key: string) => {
                console.log(`key: ${key} value: ${value.toString()}`);
                this[value.toString()] = this.__requestInstance(key);
            });
        }
    };
}

/**
 * Allows a dependency to be injected
 * @param key The key of the dependency to inject
 */
export function inject(key: string) {
    return function (target: Object, propertyName: string) {
        (target.constructor as any).createDependency(key, propertyName);
    };
}
