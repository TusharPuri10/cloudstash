import {atom} from 'recoil';

export const cardState = atom({
    key: 'cardkey',
    default: {
        name: '',
        shown: false
    },
});

export const folderState = atom({
    key: 'folder',
    default: ['/root']
});