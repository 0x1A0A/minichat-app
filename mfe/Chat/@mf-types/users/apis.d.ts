
    export type RemoteKeys = 'users/Login' | 'users/store/users';
    type PackageType<T> = T extends 'users/store/users' ? typeof import('users/store/users') :T extends 'users/Login' ? typeof import('users/Login') :any;