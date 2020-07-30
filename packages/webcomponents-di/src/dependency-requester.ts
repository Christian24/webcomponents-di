import { RequestDependencyEventDetail } from './mixins';

import { DI_REQUEST_EVENT_NAME } from './mixins';

/**
 * Allows an element to request a dependency
 */
export class DependencyRequester {
  protected element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Request a dependency from a component up the tree
   * @param key the name of the dependency to request
   * @param options an optional object of options you want the providing component to know, for example if you want a reference to a singleton or a new instance
   * @return the instance of the requested instance or undefined if none was found
   */
  requestInstance<T = unknown, O = unknown>(key: string, options?: O): T | undefined {
    const event = new CustomEvent<RequestDependencyEventDetail<T, O>>(DI_REQUEST_EVENT_NAME, {
      detail: { key, options },
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.element.dispatchEvent(event);
    if (event.defaultPrevented && event.detail.provider) {
      return event.detail.provider();
    } else {
      throw new Error(`no provider found for ${key}`);
    }
  }
}
