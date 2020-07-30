import { DependenciesMap, DependenciesMapValue, optionsType } from './common';
import { DependencyResolver } from './dependency-resolver';
import { DependencyRequester } from './dependency-requester';

export interface WebComponent extends HTMLElement {
  connectedCallback(): void;

  disconnectedCallback(): void;
}

export interface BasicDIComponent extends WebComponent {
  requestInstance(key: string, options?: optionsType): unknown | null;
}

export interface RequestDependencyEventDetail<T = unknown, O = unknown> {
  key: string;
  options?: O;
  provider?: () => T | undefined;
}

export interface AdvancedDIWebComponentConstructor extends BasicDIComponent {
  _dependenciesMap?: DependenciesMap;

  _ensureDependenciesExist?(): void;

  createDependency(key: string, value: PropertyKey, options?: optionsType): void;
}

export type Constructor<T> = new (...args: any[]) => T;
export type BasicConstructor<T = BasicDIComponent> = new (...args: any[]) => T;

export const DI_REQUEST_EVENT_NAME: string = 'WEBCOMPONENTS-DI: REQUEST';

/**
 * Allows providing dependecies to other components
 * @param base
 */
export function provideDI<TBase extends Constructor<WebComponent>>(base: TBase) {
  return class extends base {
    dependencyResolver: DependencyResolver = new DependencyResolver();

    /**
     * This is the actual part where you should check if you have the requested dependency and return it
     * @param key the name of the requested dependency
     * @param options the optional options
     */
    // @ts-ignore
    resolveDependency(key: string, options?: unknown): unknown | undefined {
      return undefined;
    }

    connectedCallback() {
      if (super.connectedCallback !== undefined) {
        super.connectedCallback();
      }
      this.dependencyResolver.connect(this);
      this.dependencyResolver.setResolveCallback(this.resolveDependency.bind(this));
    }

    disconnectedCallback() {
      if (super.disconnectedCallback !== undefined) {
        super.disconnectedCallback();
      }

      this.dependencyResolver.disconnect(this);
    }
  };
}

/**
 * Mixin that allows a component to request dependencies
 * @param base
 */
export function requestDI<TBase extends Constructor<WebComponent>>(base: TBase) {
  return class extends base implements BasicDIComponent {
    dependencyRequester: DependencyRequester = new DependencyRequester(this);
    /**
     * Request a dependency from a component up the tree
     * @param key the name of the dependency to request
     * @param options an optional object of options you want the providing component to know, for example if you want a reference to a singleton or a new instance
     * @return the instance of the requested instance or null if none was found
     */
    requestInstance<T = unknown, O = unknown>(key: string, options?: O): T | undefined {
      return this.dependencyRequester.requestInstance(key, options);
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
          superDependencies.forEach((v: DependenciesMapValue, k: string) =>
            this._dependenciesMap!.set(k, v)
          );
        }
      }
    }

    /**
     * Creates a new dependency
     * @param key the name of the dependency
     * @param value the value that will be injected
     */
    static createDependency(key: string, value: PropertyKey, options?: optionsType) {
      this._ensureDependenciesExist();
      const mapValue: DependenciesMapValue = { property: value, options };
      this._dependenciesMap!.set(key, mapValue);
    }

    connectedCallback() {
      if (super.connectedCallback !== undefined) {
        super.connectedCallback();
      }
      const constructor = <AdvancedDIWebComponentConstructor>(<unknown>this.constructor);
      if (constructor._ensureDependenciesExist !== undefined) {
        constructor._ensureDependenciesExist();
      } else {
        throw new Error('createDependency not found, did you forget to extend addDI?');
      }

      if (constructor._dependenciesMap !== undefined) {
        constructor._dependenciesMap.forEach((value: DependenciesMapValue, key: string) => {
          // @ts-ignore
          this[value.property.toString()] = this.requestInstance(key, value.options);
        });
      }
    }

    requestInstance(key: string, options?: optionsType): unknown | null {
      const value: unknown | null = super.requestInstance(key, options);

      if (value !== null) {
        this.receiveDependency(value, key, options);
      }

      return value;
    }

    /**
     * This is called once a dependency was successfully requested
     * You can do further stuff with the dependency here
     * @param value the dependency
     * @param key the key
     * @param options the optional options
     */
    // @ts-ignore
    receiveDependency(value: unknown, key: string, options?: optionsType) {
      // This is a stub
    }
  };
}

/**
 * Adds the full functionality of receiving dependencies with decorators and all
 * @param target
 */
export function addDI(target: Constructor<WebComponent>) {
  return enableDI(requestDI(target));
}
