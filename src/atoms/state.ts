import { String } from 'aws-sdk/clients/cloudhsm';
import exp from 'constants';
import { type } from 'os';
import {atom, selectorFamily} from 'recoil';

// CARD STATE
type card = {
    name: string ;
    shown: boolean;
    filekey: string | null | undefined;
    folderId: number | null | undefined;
    newName: string | null | undefined;
}
export const cardState = atom<card>({
    key: 'cardkey',
    default: {
        name: '',
        shown: false,
        filekey: '',
        folderId: null,
        newName: undefined,
    },
});


// CURRENT DIRECTORY STATE
type Directory = {
    id: number | null | undefined;
    name: string | null | undefined;
}
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