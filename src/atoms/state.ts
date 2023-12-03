import { String } from 'aws-sdk/clients/cloudhsm';
import exp from 'constants';
import { type } from 'os';
import {atom, selectorFamily} from 'recoil';

export const cardState = atom({
    key: 'cardkey',
    default: {
        name: '',
        shown: false
    },
});

export const directoryState = atom({
    key: 'folder',
    default: ['root']
});

// FOLDER STATE

type Folder = {
    id?: string | null | undefined;
    name?: string | null | undefined;
    createdAt?: string | null | undefined;
    updatedAt?: string | null | undefined;
}

export const folderState = atom<Folder[]>({
    key: "folderList",
    default: [{
        id: null,
        name: null,
        createdAt: null,
        updatedAt: null,
    }],
});

export const folderItem = selectorFamily({
    key:"FolderItem",
    get:
        (id: string) => async ({get}) => {
            const folders = get(folderState);
            return folders.find((folder) => folder.id === id);
        },
    set:
        (id: string) =>
        ({set, get}, newValue) => {
            const folders = get(folderState);
            const updatedFolders = folders.map((folder)=>
            folder.id === id ? {...folder, ...newValue } : folder );
            console.log("updated folders: ", updatedFolders);
            set(folderState, updatedFolders);
        }
})

// FILE STATE

type File = {
    name?: string | null | undefined;
    url?: string | null | undefined;
    // size?: number | null | undefined; //TODO: not added in model yet
    type?: string | null | undefined;
    createdAt?: String | null | undefined;
    updatedAt?: string | null | undefined;
}
export const fileState = atom<File[]>({
    key: "fileList",
    default: [{
        name: null,
        url: null,
        type: null,
        createdAt: null,
        updatedAt: null
    }],
})

export const fileItem = selectorFamily({
    key:"FileItem",
    get:
        (url: string) => async ({get}) => {
            const files = get(fileState);
            return files.find((file) => file.url === url);
        },
    set:
        (url: string) =>
        ({set, get}, newValue) => {
            const files = get(fileState);
            const updatedFiles = files.map((file)=>
            file.url === url ? {...file, ...newValue } : file );
            console.log("updated files: ", updatedFiles);
            set(fileState, updatedFiles);
        }
})

//  USER STATE

type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    id?: string | null | undefined;
};

export const userState = atom<User>({
    key: "userState",
    default: {
        name: null,
        email: null,
        id: null,
    },
});