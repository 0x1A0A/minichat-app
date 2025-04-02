
    export type RemoteKeys = 'chat/Messages' | 'chat/stores/chatServer';
    type PackageType<T> = T extends 'chat/stores/chatServer' ? typeof import('chat/stores/chatServer') :T extends 'chat/Messages' ? typeof import('chat/Messages') :any;