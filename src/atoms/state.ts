import { String } from 'aws-sdk/clients/cloudhsm';
import exp from 'constants';
import { type } from 'os';
import {atom, selectorFamily} from 'recoil';

type card = {
    name: string ;
    shown: boolean;
    fileKey: string | null | undefined;
    folderId: number | null | undefined;
}

export const cardState = atom<card>({
    key: 'cardkey',
    default: {
        name: '',
        shown: false,
        fileKey: '',
        folderId: null,
    },
});

type Directory = {
    id: number | null | undefined;
    name: string | null | undefined;
}
// CURRENT DIRECTORY STATE
export const directoryState = atom<Directory[]>({
    key: 'directory',
    default: []
});

// FOLDER STATE

type Folder = {
    id: number | null | undefined;
    name: string | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
}

export const folderState = atom<Folder[]>({
    key: "folderList",
    default: [],
});

export const folderItem = selectorFamily({
    key:"FolderItem",
    get:
        (id: number) => async ({get}) => {
            const folders = get(folderState);
            return folders.find((folder) => folder.id === id);
        },
    set:
        (id: number) =>
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
    name: string | null | undefined;
    filekey: string | null | undefined;
    type: string | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
}
export const fileState = atom<File[]>({
    key: "fileList",
    default: [],
})

export const fileItem = selectorFamily({
    key:"FileItem",
    get:
        (key: string) => async ({get}) => {
            const files = get(fileState);
            return files.find((file) => file.filekey === key);
        },
    set:
        (key: string) =>
        ({set, get}, newValue) => {
            const files = get(fileState);
            const updatedFiles = files.map((file)=>
            file.filekey === key ? {...file, ...newValue } : file );
            console.log("updated files: ", updatedFiles);
            set(fileState, updatedFiles);
        }
})

//  USER STATE

type User = {
    name: string | null | undefined;
    email: string | null | undefined;
    id: string | null | undefined;
};

export const userState = atom<User>({
    key: "userState",
    default: {
        name: null,
        email: null,
        id: null,
    },
});

// MAIN FOLDER STATE
export const mainFolderState = atom({
    key: "mainFolder",
    default: "root"
});

// FOLDER CREATION STATE
export const updationState = atom({
    key: "rootUpdation",
    default: false
});

// Message State
export const messageState = atom({
    key: "message",
    default: {
        open: false,
        text: ""
    }
});