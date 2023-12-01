import Bin from "@/components/Bin";
import React, { useEffect } from "react";
import NextNProgress from 'nextjs-progressbar';
import {  useRecoilState } from "recoil";
import { cardState, folderState , fileState} from "@/atoms/state";
import { useSession} from "next-auth/react";
import Signin from "@/components/Cards/Signin";
import CreateFolder from "@/components/Cards/CreateFolder";
import UploadFile from "@/components/Cards/UploadFile";
import Delete from "@/components/Cards/Delete";
import Rename from "@/components/Cards/Rename";
import File from "@/components/File";
import Folder from "@/components/Folder";
import axios from "axios";


export default function App() {
  const { data: session, status } = useSession();
  const [card, setCard] = useRecoilState(cardState);
  const [files, setFiles] = useRecoilState(fileState);
  const [folders, setFolders] = useRecoilState(folderState);

  async function getFolders() {
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
      // Handle the error as needed
    }
  }

  async function getFiles() {
    try {
      const res = await axios.get(process.env.BASE_URL + "/api/db/folder/getallfolder", {
        params: {
          folderId: null,
        },
      });
      setFolders(res.data.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      // Handle the error as needed
    }
  }

  useEffect(() => {

    //Signin Card
    if (status === "unauthenticated") {
      setCard({name: "signin", shown: true})
    }
    //UploadFile Card

    //get all files and folders
    // getFiles();
    // getFolders();
  }, [session])
  return (
    <div className="relative z-0" style={{backgroundColor: "#0D1F23", height: "100vh"}}>
        <NextNProgress color='#FFB000'/>
        {/* Area to add files and folders */}
        <div className={(card.shown)?"-z-10 h-screen opacity-80 blur-sm":"-z-10 h-screen"}>
          <Bin/>
          {files.map((file: any)=> <File/>)}
          {folders.map((folder: any)=> <Folder/>)}
        </div>
        {/* Area to show cards */}
        {card.name === "signin" && <Signin/>}
        {card.name === "CreateFolder" && <CreateFolder/>}
        {card.name === "UploadFile" && <UploadFile/>}
        {card.name === "Delete" && <Delete/>}
        {card.name === "Rename" && <Rename/>}
    </div>
  );
}
