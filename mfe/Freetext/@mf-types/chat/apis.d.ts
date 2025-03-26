
    export type RemoteKeys = 'chat/Messages';
    type PackageType<T> = T extends 'chat/Messages' ? typeof import('chat/Messages') :any;