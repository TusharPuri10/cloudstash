import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cardState,
  directoryState,
  userState,
  updationState,
} from "@/atoms/state";
import axios from "axios";
import { useState } from "react";

const CreateFolderCard = () => {
  const setCard = useSetRecoilState(cardState);
  const directory = useRecoilValue(directoryState);
  const user = useRecoilValue(userState);
  const [folderName, setFolderName] = useState("untitled_folder");
  const [updation, setUpdation] = useRecoilState(updationState);
  const [loading, setLoading] = useState(false);

  // CREATE FOLDER
  async function createFolder() {
    try {
      await axios
        .post("/api/db/folder/createfolder", {
          folderName: folderName,
          userId: user.id,
          parentFolderId: directory[directory.length - 1].id,
        })
        .then((res) => {
          setUpdation(!updation);
          setCard({
            name: "",
            shown: false,
            folderId: null,
            filekey: "",
            newName: null,
            fileType: null,
            sharedfiledelete: false,
          });
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  return (
    <div
      className="absolute inset-0 z-50 mx-auto md:w-1/4 w-3/5 h-56 mt-24 rounded-xl flex flex-col items-center"
      style={{ backgroundColor: "#2D4A53" }}
    >
      <label className="block my-6 px-4 text-left w-full text-xl font-medium text-gray-900 dark:text-white">
        New Folder
      </label>
      <div className="px-4 w-full">
        <input
          autoFocus={true}
          className="w-full bg-gray-50 border border-white text text-gray-900 text rounded-lg p-2.5 dark:bg-gray-700 dark:text-white "
          placeholder="untitled_folder"
          required
          onChange={(e) => {
            setFolderName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createFolder();
              setLoading(true);
            }
          }}
        ></input>
      </div>
      <div className="mt-6 w-full text-right">
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
          onClick={() => {
            createFolder();
            setLoading(true);
          }}
        >
          {loading ? "creating..." : "create"}
        </button>
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-transparent border-2 border-neutral-500 md:text-lg rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mx-2"
          onClick={() => {
            setCard({
              name: "",
              shown: false,
              folderId: null,
              filekey: "",
              newName: null,
              fileType: null,
              sharedfiledelete: false,
            });
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default CreateFolderCard;
