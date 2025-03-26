interface IRoomsStore {
    rooms: Set<string>;
    selected: string | null;
}
export declare const useRoomsStore: import("pinia").StoreDefinition<"rooms", IRoomsStore, {}, {
    add(name: string): /*elided*/ any & {
        rooms: Set<string> & Omit<Set<string>, keyof Set<any>>;
        selected: string | null;
    } & import("pinia")._StoreWithState<"rooms", IRoomsStore, {}, /*elided*/ any> & {} & {} & import("pinia").PiniaCustomProperties<string, import("pinia").StateTree, import("pinia")._GettersTree<import("pinia").StateTree>, import("pinia")._ActionsTree>;
    remove(name: string): /*elided*/ any & {
        rooms: Set<string> & Omit<Set<string>, keyof Set<any>>;
        selected: string | null;
    } & import("pinia")._StoreWithState<"rooms", IRoomsStore, {}, /*elided*/ any> & {} & {} & import("pinia").PiniaCustomProperties<string, import("pinia").StateTree, import("pinia")._GettersTree<import("pinia").StateTree>, import("pinia")._ActionsTree>;
    select(name: string): (/*elided*/ any & {
        rooms: Set<string> & Omit<Set<string>, keyof Set<any>>;
        selected: string | null;
    } & import("pinia")._StoreWithState<"rooms", IRoomsStore, {}, /*elided*/ any> & {} & {} & import("pinia").PiniaCustomProperties<string, import("pinia").StateTree, import("pinia")._GettersTree<import("pinia").StateTree>, import("pinia")._ActionsTree>) | undefined;
}>;
export {};
