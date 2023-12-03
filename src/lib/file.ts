import axios from "axios";
import { useSetRecoilState } from "recoil";
import { fileState } from "@/atoms/state";

export async function getFiles() {
    const setFiles = useSetRecoilState(fileState);
    try {
        const res = await axios.get(process.env.BASE_URL + "/api/db/file/getallfile", {
        params: {
            folderId: null,
        },
        });
        setFiles(res.data.folders);
    } catch (error) {
        console.error("Error fetching folders:", error);
        // Handle the error as needed
    }
}