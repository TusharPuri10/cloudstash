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
import Share from "@/components/Cards/Share";
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
  const [ message, setMessage ] = useRecoilState(messageState);

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
            fileLimit: res.data.fileLimit,
          });
          console.log("user id: ",res.data);
        });
    } catch (error) {
      console.error("Error fetching user id", error);
    }
  }
  useEffect(() => {
      //Signin Card
      if (status === "unauthenticated") {
        setCard({ name: "signin", shown: true, folderId: null, filekey: null, newName: null, url: null });
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
        <div className={ card.shown ? "h-screen opacity-30" : "h-screen "}
        onClick={()=>card.shown && setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null, url: null })}>
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
        {card.name === "Rename" && <Rename />}
        {card.name === "Delete" && <Delete />}
        {card.name === "Share" && <Share />}
        {message.open && message.text==="You have reached the limit" && <div id="toast-simple" className="absolute flex bottom-24 my-auto w-auto max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <div className="ps-4 text-sm font-normal">{message.text}</div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-undo" aria-label="Close"
                onClick={()=>setMessage({open: false, text: ""})}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>}
      </div>
    </div>
  );
}
