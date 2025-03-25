
    export type RemoteKeys = 'rooms/Rooms';
    type PackageType<T> = T extends 'rooms/Rooms' ? typeof import('rooms/Rooms') :any;