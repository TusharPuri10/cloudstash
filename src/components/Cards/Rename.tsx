import { useRecoilState } from "recoil";
import { cardState,updationState } from "@/atoms/state";
import axios from "axios";
import { useEffect, useState } from "react";

const RenameCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [newName, setNewName] = useState<string | null | undefined>(null);
  const placeholder: string | undefined = card.newName!;
  const originalExtension = card.newName ? card.newName.split('.').pop() : '';
  const [isTyping, setIsTyping] = useState(false);
  console.log("original extension: ",originalExtension);
  console.log(isTyping);
  console.log("new name: ",newName);

  // RENAME
  async function Rename() {
    try {
      if (card.filekey) {
        // Case 1: User renamed it to 'home.xyz' with a different extension, replace with the correct extension
        if (newName && newName.includes('.') &&  newName.split('.').pop() !== originalExtension) {
          axios
          .post("/api/db/file/renamefile", {
            filekey: card.filekey,
            newName: newName.replace(/\.[^.]+$/, `.${originalExtension}`),
          })
          .then((response) => {
            console.log(response.data);
            (updation) ? setUpdation(false) : setUpdation(true);
          })
          .catch((error) => console.log(error.message));
        }
        else if (newName && !newName.includes('.')) { // Case 2: User renamed it to 'home' then add the original extension
          axios
          .post("/api/db/file/renamefile", {
            filekey: card.filekey,
            newName: `${newName}.${originalExtension}`,
          })
          .then((response) => {
            console.log(response.data);
            (updation) ? setUpdation(false) : setUpdation(true);
          })
          .catch((error) => console.log(error.message));
        }
        else
        {
          axios
          .post("/api/db/file/renamefile", {
            filekey: card.filekey,
            newName: newName,
          })
          .then((response) => {
            console.log(response.data);
            (updation) ? setUpdation(false) : setUpdation(true);
          })
          .catch((error) => console.log(error.message));
        }
      }
  
      if (card.folderId) {
        axios
          .post("/api/db/folder/renamefolder", {
            folderId: card.folderId,
            newName: newName,
          })
          .then((response) => {
            console.log(response.data);
            (updation) ? setUpdation(false) : setUpdation(true);
          })
          .catch((error) => console.log(error.message));
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className="absolute inset-0 z-50 mx-auto w-1/4 h-1/4 mt-24 rounded-xl flex flex-col items-center" style={{backgroundColor: "#2D4A53"}}>
    <label className="block mt-6 mb-4 mr-32 text-xl font-medium text-gray-900 dark:text-white">Edit the name</label>
      <input className="bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white " placeholder={placeholder} required
      onChange={(e) => {
        setNewName(e.target.value);
      }}
    ></input>
      <div className="ml-24">
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          Rename();
          setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null, url: null });
        }}
      >
        rename
      </button>
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null, url: null });
        }}
      >
        cancel
      </button>
      </div>
    </div>
  );
};

export default RenameCard;
