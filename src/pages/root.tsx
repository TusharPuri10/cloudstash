import React, { useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cardState, fileState, folderState, userState, directoryState,mainFolderState,updationState,messageState } from "@/atoms/state";
import { useSession } from "next-auth/react";
import Signin from "@/components/Cards/Signin";
import CreateFolder from "@/components/Cards/CreateFolder";
import UploadFile from "@/components/Cards/UploadFile";
import Delete from "@/components/Cards/Delete";
import Rename from "@/components/Cards/Rename";
import File from "@/components/UI/File";
import Folder from "@/components/UI/Folder";
import axios from "axios";
import Topbar from "@/components/UI/Topbar";
import { FiArrowLeft } from 'react-icons/fi';

interface FolderInterface {id: number | null | undefined, name: string | null | undefined, createdAt: string | null | undefined, updatedAt: string | null | undefined};
interface FileInterface {filekey: string | null | undefined, name: string | null | undefined, createdAt: string | null | undefined, updatedAt: string | null | undefined, type: string | null | undefined};

export default function App() {
  const { data: session, status } = useSession();
  const [card, setCard] = useRecoilState(cardState);
  const [user, setUser] = useRecoilState(userState);
  const [files, setFiles] = useRecoilState(fileState);
  const [folders, setFolders] = useRecoilState(folderState);
  const [directory, setDirectory] = useRecoilState(directoryState);
  const [mainFolder, setMainFolder] = useRecoilState(mainFolderState);
  const [loading, setLoading] = useState(false);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [rootid, setRootid] = useState(0);
  const setMessage = useSetRecoilState(messageState);

  // GET ALL FOLDERS IN CURRENT FOLDER
  async function getFolders() {
    console.log("inside get folders");
    try {
      console.log("parent folder id: ",directory[directory.length-1].id);
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
      console.error("Error fetching all folders:", error);
    }
  }

  // GET ALL FILES IN CURRENT FOLDER
  async function getFiles() {
    console.log("inside get files");
    try {
      await axios
        .post("/api/db/file/getallfile", {
          userId: user.id,
          folderId: directory[directory.length-1].id,
        })
        .then((res) => {
          console.log("files: ",res.data.files);
          setFiles(res.data.files);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching all files:", error);
    }
  }

  // CREATE ROOT FOLDER FUNCTION
  async function createRootFolder() {
    console.log("inside create root folder");
    try{
      await axios
      .post("/api/db/folder/createfolder", {
        userId: user.id,
        folderName: "root",
      })
      .then((res) => {
        console.log("created root folder: ",res.data);
        setDirectory([{id: res.data.folderId, name: "root"}]);
        setRootid(res.data.id);
      });
    }catch (error) {
      console.error("Error creating root folders:", error);
    }
  }

  //  GET MAIN FOLDER (ROOT, SHARED) ID
  async function getMainFolder(folderName: string) {
    console.log("inside get main folder");
    try {
      await axios
        .post("/api/db/folder/getmainfolder", {
          userId: user.id,
          folderName: folderName,
        })
        .then((res) => {
          if (res.data) {
            console.log(mainFolder," folder exists: ",res.data.id);
            setDirectory([{id: res.data.id, name: mainFolder}]);
            setRootid(res.data.id);
          }
          else if(mainFolder==="root")
          {
            console.log(mainFolder, " folder does not exist. Creating root folder...");
            createRootFolder();
          }
          else if(mainFolder==="shared")
          {
            setMessage({text: "Nothing shared with you yet!", open: true});
            setTimeout(() => {
              setMessage({text: "", open: false});
            }, 1500);
            setMainFolder("root");
            setLoading(false);
          }
        });
    } catch (error) {
      console.error("Error fetching main folder:", error);
    }
  }

  // GET USER ID FUNCTION
  async function getUserId() {
    console.log("inside get user id");
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
        setCard({ name: "signin", shown: true, folderId: null, fileKey: null });
      } else if(!user.id && session?.user?.email){
        setLoading(true);
        getUserId();
      }
  },[session]);

  useEffect(() => {

    console.log(directory);
    console.log(mainFolder);
    if(user.id && mainFolder==="root" && directory.length===0)   getMainFolder( mainFolder);
    if(user.id && mainFolder==="shared") getMainFolder( mainFolder );
  }, [user,mainFolder]);

  useEffect(() => {
    setLoading(true);
    if(directory.length>0){
      getFolders().then(()=>{getFiles()});
    }},[updation,directory]);


  return (
    <div style={{ backgroundColor: "#0D1F23" }}>
      <NextNProgress color="#FFB000" />
      <Topbar/>
      <div style={{ backgroundColor: "#132E35"}} className="mx-6 bg-white ring-1 ring-gray-900/5 rounded-lg">
        {/* Area to add files and folders */}
        { (loading) ? (
              <div className="flex items-center justify-center h-screen">
                <div className="w-28 h-28 border-t-4 border-amber-500 rounded-full animate-spin"></div>
              </div>
        ):(
        <div className={ card.shown ? "h-screen opacity-30" : "h-screen"}>
          <button
            className={ (directory.length > 1) ? "absolute border-lime-800 rounded-ee-lg rounded-ss-lg border-2 border-teal-900 top-20 left-6 p-1 text-amber-50 hover:text-amber-400 dark:text-amber-500 dark:hover:text-amber-400" : "absolute border-lime-800 rounded-ee-lg rounded-ss-lg border-2 border-teal-900 top-20 left-6 p-1 text-gray-500 dark:text-gray-400"}
            onClick={() => {
              if (directory.length > 1) {
                setDirectory(prevDirectory => prevDirectory.slice(0, -1));
              }
              if(mainFolder==="shared"){
                setDirectory([]);
                setMainFolder("root");
              }
            }}
          >
            <FiArrowLeft size={25} />
          </button>
          {folders.map((folder: FolderInterface, index: number) => (
            <Folder key={folder.id} folder={folder} index={index} />
          ))}
          {files.map((file: FileInterface, index: number) => (
            <File key={file.filekey} file={file} index={index+folders.length}/>
          ))}
        </div>
        )}
        {card.name === "signin" && <Signin />}
        {card.name === "CreateFolder" && <CreateFolder />}
        {card.name === "UploadFile" && <UploadFile />}
        {card.name === "Delete" && <Delete />}
        {card.name === "Rename" && <Rename />}
      </div>
    </div>
  );
}
