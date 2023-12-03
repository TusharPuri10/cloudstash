import axios from "axios";
import { useSetRecoilState } from "recoil";
import { folderState } from "@/atoms/state";


export async function getFolders() {
    const setFolders = useSetRecoilState(folderState);
    try {
        const res = await axios.get(process.env.BASE_URL + "/api/db/folder/getallfolder", {
        params: {
            parentFolderId: null,
            email: "iamtusharpuri@gmail.com",
        },
        });
        setFolders(res.data.folders);
    } catch (error) {
        console.error("Error fetching folders:", error);
    }
}