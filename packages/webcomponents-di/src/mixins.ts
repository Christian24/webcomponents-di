export interface WebComponent extends HTMLElement {
    connectedCallback?(): void;

    disconnectedCallback?(): void;
}

interface RequestDependencyEventDetail {
    key: string;
    provider?: () => unknown;
}

export type Constructor<T = WebComponent> = new (...args: any[]) => T;

const requestEventName: string = 'WEBCOMPONENTS-DI: REQUEST';
type ProvidersMap = Map<string, () => unknown>;

/**
 * Allows providing dependecies to other components
 * @param base
 */
export function provideDI<TBase extends Constructor>(base: TBase) {
    return class extends base {
        static providersMap?: ProvidersMap;

        static _ensureProviders() {

            if (this.providersMap === undefined) {
                this.providersMap = new Map();
                const superDependencies: ProvidersMap = Object.getPrototypeOf(this).providersMap;
                if (superDependencies !== undefined) {
                    superDependencies.forEach(
                        (v: () => unknown, k: string) =>
                            this.providersMap!.set(k, v));
                }
            }
        }

         static addProvider(key: string, value: unknown): void {
            this.constructor._ensureProviders();

             this.constructor.providersMap!.set(key, () => value);
        }

        /**
         * Looks for the requested dependency
         * @param eventTarget
         */
        handleRequest(eventTarget: Event): void {
            const providersMap: ProvidersMap= this.constructor.providersMap;
            const event: CustomEvent<RequestDependencyEventDetail> = <CustomEvent<RequestDependencyEventDetail>>eventTarget;
            const detail: RequestDependencyEventDetail = event.detail;
            if (providersMap !== undefined && providersMap.has(detail.key)) {
                event.detail.provider = <() => unknown>providersMap.get(detail.key);
                event.preventDefault();
                event.stopPropagation();
            }
        }

        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }
            this.constructor._ensureProviders();
            this.addEventListener(requestEventName, this.handleRequest.bind(this));
        }

        disconnectedCallback() {
            if (super.disconnectedCallback !== undefined) {
                super.disconnectedCallback();
            }
            this.removeEventListener(requestEventName, this.handleRequest.bind(this));
        }
    };
}

/**
 * Mixin that allows a component to request dependencies
 * @param base
 */
export function requestDI<TBase extends Constructor>(base: TBase) {
    return class extends base {

        __requestInstance(key: string): unknown | null {
            let event = new CustomEvent<RequestDependencyEventDetail>(requestEventName, {
                detail: {key},
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
