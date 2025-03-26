interface IMessage {
    value: string;
    room: string;
    user: string;
}
type MessageStore = {
    data: Map<string, IMessage[]>;
};
export declare const useMessagesStore: import("pinia").StoreDefinition<"messages", MessageStore, {}, {
    get(room: string): {
        value: string;
        room: string;
        user: string;
    }[] | undefined;
    add(msg: string, room: string, user: string): void;
}>;
export {};
