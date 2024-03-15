import React, { useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cardState,
  fileState,
  folderState,
  userState,
  directoryState,
  mainFolderState,
  updationState,
  messageState,
} from "@/atoms/state";
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
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import Bin from "@/components/3dmodels/Bin";
import Mailbox from "@/components/3dmodels/Mailbox";

interface FolderInterface {
  id: number | null | undefined;
  name: string | null | undefined;
  createdAt: string | null | undefined;
  updatedAt: string | null | undefined;
}
interface FileInterface {
  owner: string | null | undefined;
  sharekey: string | null | undefined;
  filekey: string | null | undefined;
  name: string | null | undefined;
  createdAt: string | null | undefined;
  updatedAt: string | null | undefined;
  type: string | null | undefined;
}

export default function App() {
  const { data: session, status } = useSession();
  const [card, setCard] = useRecoilState(cardState);
  const [user, setUser] = useRecoilState(userState);
  const [files, setFiles] = useRecoilState(fileState);
  const [folders, setFolders] = useRecoilState(folderState);
  const [directory, setDirectory] = useRecoilState(directoryState);
  const [mainFolder, setMainFolder] = useRecoilState(mainFolderState);
  const [loading, setLoading] = useState(false);
  const updation = useRecoilValue(updationState);
  const [rootid, setRootid] = useState(0);
  const [message, setMessage] = useRecoilState(messageState);
  const router = useRouter();

  // GET ALL FOLDERS IN CURRENT FOLDER
  async function getFolders() {
    // console.log("inside get folders");
    try {
      // console.log("parent folder id: ", directory[directory.length - 1].id);
      await axios
        .post("/api/db/folder/getallfolder", {
          parentFolderId: directory[directory.length - 1].id,
          userId: user.id,
        })
        .then((res) => {
          // console.log("folders: ", res.data.folders);
          setFolders(res.data.folders);
        });
    } catch (error) {
      console.error("Error fetching all folders:", error);
    }
  }

  // GET ALL FILES IN CURRENT FOLDER
  async function getFiles() {
    // console.log("inside get files");
    try {
      await axios
        .post("/api/db/file/getallfile", {
          userId: user.id,
          folderId: directory[directory.length - 1].id,
        })
        .then((res) => {
          // console.log("files: ", res.data.files);
          setFiles(res.data.files);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching all files:", error);
    }
  }

  // CREATE ROOT FOLDER FUNCTION
  async function createRootFolder() {
    // console.log("inside create root folder");
    try {
      await axios
        .post("/api/db/folder/createfolder", {
          userId: user.id,
          folderName: "root",
        })
        .then((res) => {
          // console.log("created root folder: ", res.data);
          setDirectory([{ id: res.data.folderId, name: "root" }]);
          setRootid(res.data.id);
        });
    } catch (error) {
      console.error("Error creating root folders:", error);
    }
  }

  //  GET MAIN FOLDER (ROOT, SHARED) ID
  async function getMainFolder(folderName: string) {
    // console.log("inside get main folder");
    try {
      await axios
        .post("/api/db/folder/getmainfolder", {
          userId: user.id,
          folderName: folderName,
        })
        .then((res) => {
          if (res.data) {
            // console.log(mainFolder, " folder exists: ", res.data.id);
            setDirectory([{ id: res.data.id, name: mainFolder }]);
            setRootid(res.data.id);
          } else if (mainFolder === "root") {
            // console.log(
            //   mainFolder,
            //   " folder does not exist. Creating root folder..."
            // );
            createRootFolder();
          } else if (mainFolder === "shared") {
            setMessage({
              text: "Nothing shared with you yet!",
              open: true,
              type: "error",
            });
            setTimeout(() => {
              setMessage({ text: "", open: false, type: "" });
            }, 2000);
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
    // console.log("inside get user id");
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
          // console.log("user id: ", res.data);
        });
    } catch (error) {
      console.error("Error fetching user id", error);
    }
  }
  useEffect(() => {
    // console.log("sign in use effect");
    //Signin Card
    if (status === "unauthenticated") {
      setCard({
        name: "signin",
        shown: true,
        folderId: null,
        filekey: null,
        newName: null,
        fileType: null,
        sharedfiledelete: false,
      });
    } else if (!user.id && session?.user?.email) {
      setLoading(true);
      getUserId();
    } else {
      setCard({
        name: "",
        shown: false,
        folderId: null,
        filekey: null,
        newName: null,
        fileType: null,
        sharedfiledelete: false,
      });
    }
  }, [session]);

  useEffect(() => {
    // console.log(directory,"directory useeffect");
    // console.log(mainFolder);
    if (user.id && mainFolder === "root" && directory.length === 0)
      getMainFolder(mainFolder);
    if (user.id && mainFolder === "shared") getMainFolder(mainFolder);
  }, [user, mainFolder]);

  useEffect(() => {
    // console.log("files loading useeffect");
    if (user.id) {
      setLoading(true);
      if (directory.length > 0) {
        getFolders().then(() => {
          getFiles();
        });
      }
    }
  }, [updation, directory]);

  return (
    <div className="bg-[#0D1F23]">
      <NextNProgress color="#FFB000" />
      <Topbar />
      <div className="mx-6 rounded-xl bg-[#132E35]">
        {/* Area to add files and folders */}
        {loading ? (
          <div className="flex items-center justify-center md:h-[calc(100vh-80px)] sm:h-[calc(100vh-77px)] h-[calc(100vh-73px)]">
            <div className="w-28 h-28 border-t-4 border-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <div
              className={
                card.shown
                  ? "opacity-30 flex md:h-[calc(100vh-80px)] sm:h-[calc(100vh-77px)] h-[calc(100vh-73px)]"
                  : "flex md:h-[calc(100vh-80px)] sm:h-[calc(100vh-77px)] h-[calc(100vh-73px)]"
              }
              onDoubleClick={() =>
                card.shown &&
                setCard({
                  name: "",
                  shown: false,
                  folderId: null,
                  filekey: null,
                  newName: null,
                  fileType: null,
                  sharedfiledelete: false,
                })
              }
            >
              {/* Back Button */}
              <button
                className={
                  directory.length > 1 || mainFolder === "shared"
                    ? "border-lime-800 rounded-ee-lg rounded-ss-lg border-2 border-teal-900 top-20 left-6 p-1 text-amber-50 hover:text-amber-400 h-10 "
                    : "border-lime-800 rounded-ee-lg rounded-ss-lg border-2 border-teal-900 top-20 left-6 p-1 text-gray-500 h-10"
                }
                onClick={() => {
                  if (directory.length > 1) {
                    setDirectory((prevDirectory) => prevDirectory.slice(0, -1));
                  }
                  if (mainFolder === "shared") {
                    setDirectory([]);
                    setMainFolder("root");
                  }
                }}
              >
                <FiArrowLeft size={25} />
              </button>

              <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
              >
                {/* Files and Folders */}
                <div className="md:w-10/12 w-5/6">
                  {[...folders]
                    .sort((a, b) => {
                      const dateA = a.createdAt
                        ? new Date(a.createdAt)
                        : new Date(0);
                      const dateB = b.createdAt
                        ? new Date(b.createdAt)
                        : new Date(0);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .map((folder: FolderInterface, index: number) => (
                      <Folder key={folder.id} folder={folder} index={index} />
                    ))}
                  {[...files]
                    .sort((a, b) => {
                      const dateA = a.createdAt
                        ? new Date(a.createdAt)
                        : new Date(0);
                      const dateB = b.createdAt
                        ? new Date(b.createdAt)
                        : new Date(0);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .map((file: FileInterface, index: number) => (
                      <File
                        key={file.filekey}
                        file={file}
                        index={index + folders.length}
                      />
                    ))}
                </div>
                {/* Side Bar */}
                <div className="md:w-2/12 w-1/6 h-68">
                  {!(card.name === "signin") && router.asPath === "/root" && (
                    <Bin />
                  )}
                  {!(card.name === "signin") && router.asPath === "/root" && (
                    <Mailbox />
                  )}
                </div>
              </DndProvider>
              {message.open &&
                message.text === "Nothing shared with you yet!" && (
                  <div
                    id="toast-simple"
                    className="absolute right-4 top-80 flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow space-x "
                    role="alert"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600 rotate-45"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
                      />
                    </svg>
                    <div className="ps-4 text-sm font-normal">
                      {message.text}
                    </div>
                    <button
                      type="button"
                      className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 "
                      data-dismiss-target="#toast-undo"
                      aria-label="Close"
                      onClick={() =>
                        setMessage({ open: false, text: "", type: "" })
                      }
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>
                )}
            </div>

            {card.name === "signin" && <Signin />}
            {card.name === "CreateFolder" && <CreateFolder />}
            {card.name === "UploadFile" && <UploadFile />}
            {card.name === "Rename" && <Rename />}
            {card.name === "Delete" && <Delete />}
            {card.name === "Share" && <Share />}
            {message.open &&
              (message.text === "You have reached the limit" ||
                message.text === "User not found" ||
                message.text === "File shared" || message.text) && (
                <div
                  id="toast-simple"
                  className="absolute flex bottom-24 my-auto w-auto max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow space-x "
                  role="alert"
                >
                  {message.type === "error" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-red-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  )}
                  {message.type === "success" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                      />
                    </svg>
                  )}
                  <div className="ps-4 text-sm font-normal">{message.text}</div>
                  <button
                    type="button"
                    className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 "
                    data-dismiss-target="#toast-undo"
                    aria-label="Close"
                    onClick={() =>
                      setMessage({ open: false, text: "", type: "" })
                    }
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
