export declare const useChatServer: import("pinia").StoreDefinition<"chat-server", Pick<{
    connectStatus: import("vue").ComputedRef<import("@vueuse/core").WebSocketStatus>;
    sendMessage: (msg: string) => void;
}, never>, Pick<{
    connectStatus: import("vue").ComputedRef<import("@vueuse/core").WebSocketStatus>;
    sendMessage: (msg: string) => void;
}, "connectStatus">, Pick<{
    connectStatus: import("vue").ComputedRef<import("@vueuse/core").WebSocketStatus>;
    sendMessage: (msg: string) => void;
}, "sendMessage">>;
