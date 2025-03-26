
    export type RemoteKeys = 'rooms/Rooms' | 'rooms/store/rooms';
    type PackageType<T> = T extends 'rooms/store/rooms' ? typeof import('rooms/store/rooms') :T extends 'rooms/Rooms' ? typeof import('rooms/Rooms') :any;