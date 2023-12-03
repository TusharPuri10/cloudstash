import Bin from "@/components/Bin";
import React, { useEffect } from "react";
import NextNProgress from "nextjs-progressbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { cardState, fileState, folderState, userState } from "@/atoms/state";
import { useSession } from "next-auth/react";
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
  const [user, setUser] = useRecoilState(userState);
  const files = useRecoilValue(fileState);
  const folders = useRecoilValue(folderState);

  // CREATE ROOT FOLDER FUNCTION
  async function createRootFolder() {
    await axios
      .post("/api/db/folder/createfolder", {
        userId: user.id,
        folderName: "root",
      })
      .then((res) => {
        console.log("created root folder: ",res.data);
      });
  }

  //  GET MAIN FOLDER (ROOT, SHARED) ID
  async function getMainFolder(userId: string, folderName: string) {
    try {
      await axios
        .post("/api/db/folder/getmainfolder", {
          userId: userId,
          folderName: folderName,
        })
        .then((res) => {
          if (res) {
            console.log("root folder exists: ",res.data);
          } else {
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
          getMainFolder(res.data.id, "root")
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  useEffect(() => {
    //Signin Card
    if (status === "unauthenticated") {
      setCard({ name: "signin", shown: true });
    } else if(!user.id){
      getUserId();
    }


  }, [session]);
  return (
    <div
      className="relative z-0"
      style={{ backgroundColor: "#0D1F23", height: "100vh" }}
    >
      <NextNProgress color="#FFB000" />
      {/* Area to add files and folders */}
      <div
        className={
          card.shown ? "-z-10 h-screen opacity-80 blur-sm" : "-z-10 h-screen"
        }
      >
        <Bin />
        {files.map((file: any) => (
          <File />
        ))}
        {folders.map((folder: any) => (
          <Folder />
        ))}
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
