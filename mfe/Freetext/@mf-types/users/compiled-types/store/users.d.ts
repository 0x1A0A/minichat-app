interface IUser {
    name: string | null;
    authenticated: boolean;
}
export declare const useUserStore: import("pinia").StoreDefinition<"user", import("@vueuse/core").RemovableRef<IUser>, {
    verified: (state: IUser & import("pinia").PiniaCustomStateProperties<import("@vueuse/core").RemovableRef<IUser>>) => boolean;
}, {
    setUser(data: {
        name: string;
    }): void;
    logout(): void;
}>;
export {};
