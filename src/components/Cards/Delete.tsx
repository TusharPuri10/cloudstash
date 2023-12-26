import { useRecoilState } from "recoil";
import { cardState, updationState } from "@/atoms/state";
import axios from "axios";
import { useState } from "react";

const DeleteCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [loading, setLoading] = useState(false);

  // DELETE
  async function Delete() {
    try {
      if (card.sharedfiledelete) {
        axios
          .post("/api/db/file/deletefile", {
            filekey: card.filekey,
          })
          .then((response) => {
            // console.log(response.data);
            setUpdation(!updation);
            setLoading(false);
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
        return;
      }
      if (card.filekey) {
        axios
          .post("/api/aws/s3/delete-file", {
            file_key: card.filekey,
          })
          .then((response) => {
            axios
              .post("/api/db/file/deletefile", {
                filekey: card.filekey,
              })
              .then((response) => {
                // console.log(response.data);
                setUpdation(!updation);
                setLoading(false);
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
          })
          .catch((error) => console.log(error.message));
      }
      if (card.folderId) {
        axios
          .post("/api/db/folder/deletefolder", {
            folderId: card.folderId,
          })
          .then((response) => {
            // console.log(response.data);
            setUpdation(!updation);
            setLoading(false);
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
    <div className="absolute inset-0 z-50 mx-auto md:w-1/4 w-3/5 h-40 mt-24 rounded-xl flex flex-col items-center bg-[#2D4A53]">
      <label className="block my-6 mx-4 font-medium text-gray-900 dark:text-white">
        Are you sure you want to permanently delete?
      </label>
      <div className="w-full text-right">
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
          onClick={() => {
            Delete();
            setLoading(true);
          }}
        >
          {loading ? "deleting..." : "delete"}
        </button>
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-transparent border-2 border-neutral-500 md:text-lg rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mx-2"
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

export default DeleteCard;
