import { useRecoilState } from "recoil";
import { cardState,directoryState,userState, updationState } from "@/atoms/state";
import axios from "axios";
import { useState } from "react";

const DeleteCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [directory, setDirectory] = useRecoilState(directoryState);
  const [folderName, setFolderName] = useState("untitled_folder");
  const [user, setUser] = useRecoilState(userState);
  const [updation, setUpdation] = useRecoilState(updationState);

  // CREATE FOLDER
  async function Delete() {
    try{

        if(card.fileKey)
        {
            axios
            .post("/api/aws/s3/delete-file", {
            file_key: card.fileKey,
            })
            .then((response) => {

                axios.post("/api/db/file/deletefile", {
                    fileKey: card.fileKey,
                }).then((response) => {
                    console.log(response.data);
                    (updation) ? setUpdation(false) : setUpdation(true);
                }).catch((error) => console.log(error.message));
            }).catch((error) => console.log(error.message));
        }
        if(card.folderId)
        {
            axios
            .post("/api/db/folder/deletefolder", {
            folderId: card.folderId,
            })
            .then((response) => {
            console.log(response.data);
            (updation) ? setUpdation(false) : setUpdation(true);
            })
            .catch((error) => console.log(error.message));
        }
      }
      catch(error){
        console.log(error);
      }
  }

  return (
    <div className="absolute inset-0 z-50 mx-auto w-1/4 h-1/4 mt-24 rounded-xl flex flex-col items-center" style={{backgroundColor: "#2D4A53"}}>
      <label className="block mt-6 mb-4 my-20 text-xl font-medium text-gray-900 dark:text-white">Are you sure <br />you want to permanently delete?</label>
      <div className="ml-24">
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          Delete();
          setCard({ name: "", shown: false, folderId: null, fileKey: "" });
        }}
      >
        delete
      </button>
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          setCard({ name: "", shown: false, folderId: null, fileKey: "" });
        }}
      >
        cancel
      </button>
      </div>
    </div>
  );
};

export default DeleteCard;
