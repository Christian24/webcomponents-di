export type DependenciesMap = Map<string, DependenciesMapValue>;
export type optionsType = unknown;

export interface DependenciesMapValue {
    property: PropertyKey;
    options?: optionsType;
}