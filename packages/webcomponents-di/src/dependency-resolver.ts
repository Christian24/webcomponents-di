import { DI_REQUEST_EVENT_NAME, RequestDependencyEventDetail } from './mixins';

/**
 * The type used to describe the callback used to resolve a dependency
 * This is the actual part where you should check if you have the requested dependency and return it
 * @param key the name of the requested dependency
 * @param options the optional options
 */
export type ResolveCallback = (key: string, options?: any) => unknown | undefined;
/**
 * Allows an element to resolve dependencies
 */
export class DependencyResolver {
  // @ts-ignore
  private callback: ResolveCallback = (key: string, options?: unknown) => {
    return undefined;
  };
  /**
   * Looks for the requested dependency
   * @param eventTarget
   */
  handleRequestEvent(eventTarget: Event): void {
    const event: CustomEvent<RequestDependencyEventDetail> = eventTarget as CustomEvent<
      RequestDependencyEventDetail
    >;
    // Get information about the requested dependency
    const detail: RequestDependencyEventDetail = event.detail;
    // Try to resolve it
    const dependency = this.callback(detail.key, detail.options);
    if (dependency) {
      // We did find the requested dependency let's pack it and send it back
      event.detail.provider = () => dependency;
      // Let the requester know we resolved the dependency
      event.preventDefault();
      // Stop this from bubbling up as we have resolved it
      event.stopPropagation();
    }
  }

    /**
     * Allows to set the callback called when a dependency event is caught
     * @param callback
     */
  setResolveCallback(callback: ResolveCallback): void {
      this.callback = callback;
  }

  /**
   * Connects the resolver to the given element
   * @param element
   */
  connect(element: HTMLElement): void {
    element.addEventListener(DI_REQUEST_EVENT_NAME, this.handleRequestEvent.bind(this));
  }

  /**
   * Disconnects the resolve from the given element
   * @param element
   */
  disconnect(element: HTMLElement): void {
    element.removeEventListener(DI_REQUEST_EVENT_NAME, this.handleRequestEvent.bind(this));
  }
}
