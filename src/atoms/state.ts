import {atom} from 'recoil';

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

export const folderState = atom({
    key: "folderList",
    default: [],
});

export const fileState = atom({
    key: "fileList",
    default: [],
})