import Bin from "@/components/Bin";
import React, { useEffect } from "react";
import NextNProgress from "nextjs-progressbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { cardState, fileState, folderState, userState, directoryState } from "@/atoms/state";
import { useSession } from "next-auth/react";
import Signin from "@/components/Cards/Signin";
import CreateFolder from "@/components/Cards/CreateFolder";
import UploadFile from "@/components/Cards/UploadFile";
import Delete from "@/components/Cards/Delete";
import Rename from "@/components/Cards/Rename";
import File from "@/components/File";
import Folder from "@/components/Folder";
import axios from "axios";
import Topbar from "@/components/Topbar";

export default function App() {
  const { data: session, status } = useSession();
  const [card, setCard] = useRecoilState(cardState);
  const [user, setUser] = useRecoilState(userState);
  const [files, setFiles] = useRecoilState(fileState);
  const [folders, setFolders] = useRecoilState(folderState);
  const [directory, setDirectory] = useRecoilState(directoryState);

  // GET ALL FOLDERS IN CURRENT FOLDER
  async function getFolders() {
    try {
      await axios
        .post("/api/db/folder/getallfolder", {
          parentFolderId: directory[directory.length-1].id,
          userId: user.id,
        })
        .then((res) => {
          console.log("folders: ",res.data.folders);
          setFolders(res.data.folders);
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  // GET ALL FILES IN CURRENT FOLDER
  async function getFiles() {
    try {
      await axios
        .post("/api/db/file/getallfile", {
          userId: user.id,
        })
        .then((res) => {
          console.log("files: ",res.data);
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  // CREATE ROOT FOLDER FUNCTION
  async function createRootFolder() {
    try{
      await axios
      .post("/api/db/folder/createfolder", {
        userId: user.id,
        folderName: "root",
      })
      .then((res) => {
        console.log("created root folder: ",res.data);
        setDirectory([{id: res.data.id, name: "root"}]);
      });
    }catch (error) {
      console.error("Error creating root folders:", error);
    }
  }

  //  GET MAIN FOLDER (ROOT, SHARED) ID
  async function getMainFolder(folderName: string) {
    try {
      await axios
        .post("/api/db/folder/getmainfolder", {
          userId: user.id,
          folderName: folderName,
        })
        .then((res) => {
          if (res) {
            console.log("root folder exists: ",res.data);
            setDirectory([{id: res.data.id, name: "root"}]);
          } else if(folderName==="root"){
            createRootFolder();
          }
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  // GET USER ID FUNCTION
  async function getUserId() {
    try {
      await axios
        .post("/api/db/user/getuserid", {
          email: session?.user?.email,
        })
        .then((res) => {
          setUser({
            id: res.data.id,
            name: session?.user?.name,
            email: session?.user?.email,
          });
          console.log("user id: ",res.data.id);
        });
    } catch (error) {
      console.error("Error fetching user id", error);
    }
  }

  useEffect(() => {
    //Signin Card
    if (status === "unauthenticated") {
      setCard({ name: "signin", shown: true });
    } else if(!user.id && session?.user?.email){
      getUserId();
    }

    if(user.id && directory.length===0) getMainFolder( "root");
    if(directory.length>0) getFolders();
  }, [session,user,directory]);
  return (
    <div style={{ backgroundColor: "#0D1F23" }}>
      <NextNProgress color="#FFB000" />
      <Topbar/>

      {/* Area to add files and folders */}
      <div className={ card.shown ? "h-screen opacity-30" : "h-screen"}>
        <Bin />
        {/* {files.map((file: any) => (
          <File />
        ))}
        {folders.map((folder: any) => (
          <Folder />
        ))} */}
      </div>
      {/* Area to show cards */}
      {card.name === "signin" && <Signin />}
      {card.name === "CreateFolder" && <CreateFolder />}
      {card.name === "UploadFile" && <UploadFile />}
      {card.name === "Delete" && <Delete />}
      {card.name === "Rename" && <Rename />}
    </div>
  );
}
