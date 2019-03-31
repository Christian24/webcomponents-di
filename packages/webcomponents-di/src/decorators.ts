import {AdvancedDIWebComponentConstructor} from './mixins';


/**
 * Allows a dependency to be injected
 * @param key The key of the dependency to inject
 */
export function inject(key: string) {
    return function (target: any, propertyName: string) {
        console.log(target);
        console.log(target.constructor);

        (target.constructor as unknown as AdvancedDIWebComponentConstructor).createDependency(key, propertyName);
    };
}



