import { useRecoilState } from "recoil";
import { cardState, updationState } from "@/atoms/state";
import axios from "axios";
import { useState, useRef } from "react";

const RenameCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [newName, setNewName] = useState<string | null | undefined>(null);
  const [defaultvalue, setDefaultvalue] = useState<string>(card.newName!);
  const originalExtension = card.newName ? card.newName.split(".").pop() : "";
  const [loading, setLoading] = useState(false);
  // RENAME
  async function Rename() {
    try {
      if (card.filekey) {
        // Case 1: User renamed it to 'home.xyz' with a different extension, replace with the correct extension
        if (
          newName &&
          newName.includes(".") &&
          newName.split(".").pop() !== originalExtension
        ) {
          axios
            .post("/api/db/file/renamefile", {
              filekey: card.filekey,
              newName: newName.replace(/\.[^.]+$/, `.${originalExtension}`),
            })
            .then((response) => {
              console.log(response.data);
              setUpdation(!updation);
              setCard({
                name: "",
                shown: false,
                folderId: null,
                filekey: null,
                newName: null,
                url: null,
                sharedfiledelete: false,
              });
            })
            .catch((error) => console.log(error.message));
        } else if (newName && !newName.includes(".")) {
          // Case 2: User renamed it to 'home' then add the original extension
          axios
            .post("/api/db/file/renamefile", {
              filekey: card.filekey,
              newName: `${newName}.${originalExtension}`,
            })
            .then((response) => {
              console.log(response.data);
              setUpdation(!updation);
              setCard({
                name: "",
                shown: false,
                folderId: null,
                filekey: null,
                newName: null,
                url: null,
                sharedfiledelete: false,
              });
            })
            .catch((error) => console.log(error.message));
        } else {
          axios
            .post("/api/db/file/renamefile", {
              filekey: card.filekey,
              newName: newName,
            })
            .then((response) => {
              console.log(response.data);
              setUpdation(!updation);
              setCard({
                name: "",
                shown: false,
                folderId: null,
                filekey: null,
                newName: null,
                url: null,
                sharedfiledelete: false,
              });
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
            setUpdation(!updation);
            setCard({
              name: "",
              shown: false,
              folderId: null,
              filekey: null,
              newName: null,
              url: null,
              sharedfiledelete: false,
            });
          })
          .catch((error) => console.log(error.message));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="absolute inset-0 z-50 mx-auto md:w-1/4 w-3/5 h-48 mt-24 rounded-xl flex flex-col items-center"
      style={{ backgroundColor: "#2D4A53" }}
    >
      <label className="w-full px-4 mt-6 mb-4 text-left text-xl font-medium text-gray-900 dark:text-white">
        Edit the name
      </label>
      <div className="px-4 w-full">
        <input
          autoFocus={true}
          className="w-full bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white "
          value={defaultvalue}
          required
          onChange={(e) => {
            setNewName(e.target.value);
            setDefaultvalue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              Rename();
              setLoading(true);
            }
          }}
        ></input>
      </div>
      <div className="w-full text-right mt-4">
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
          onClick={() => {
            Rename();
            setLoading(true);
          }}
        >
          {loading ? "renaming..." : "rename"}
        </button>
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-transparent border-2 border-neutral-500 md:text-lg rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 ml-2 mr-1"
          onClick={() => {
            setCard({
              name: "",
              shown: false,
              folderId: null,
              filekey: null,
              newName: null,
              url: null,
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

export default RenameCard;
