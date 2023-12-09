import { useRecoilState, useRecoilValue } from "recoil";
import {
  cardState,
  directoryState,
  userState,
  updationState,
} from "@/atoms/state";
import { useDropzone } from "React-dropzone";
import axios from "axios";
import { useSession } from "next-auth/react";

const UploadFileCard = () => {
  // Props for Drop Zone
  const maxSize = 1024 * 1024 * 10; //10mb
  const minSize = 0;
  const {
    getRootProps,
    getInputProps,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    minSize,
    maxSize,
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx", ".doc"], // docx
      "image/jpg": [".jpg", ".jpeg"], // jpg
      "application/pdf": [".pdf"], // pdf
      "image/png": [".png"], // png
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx", ".ppt"], // pptx
      "text/plain": [".txt"], // txt
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
      ], // xlsx
      "application/zip": [".zip"], // zip
    },
  });
  const isFileTooLarge =
    fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  // List of Files
  const files = acceptedFiles.map((file) => (
    <li className="text text-amber-500" key={file.size}>
      {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
    </li>
  ));

  // Generate File Key
  const generateFileKey = (bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // States
  const [directory, setDirectory] = useRecoilState(directoryState);
  const user = useRecoilValue(userState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [card, setCard] = useRecoilState(cardState);
  const { data: session, status } = useSession();

  async function uploadFile() {
    if (acceptedFiles[0] && session && session.user) {
      try {
        const filekey = generateFileKey();
        let { data } = await axios.post("/api/aws/s3/upload-file", {
          file_key: filekey,
          type: acceptedFiles[0].type,
        });
        console.log("data: ", data);
        await axios.put(data.url, acceptedFiles[0], {
          headers: {
            "Content-type": acceptedFiles[0].type,
            "Access-Control-Allow-Origin": "*",
          },
        }).then((res) => {
          console.log(res);
        });
        await axios
          .post("/api/db/file/createfile", {
            folderId: directory[directory.length - 1].id,
            fileName: acceptedFiles[0].name,
            fileType: acceptedFiles[0].type,
            filekey: filekey,
            owner: user.name,
          })
          .then((res) => {
            console.log("files: ", res.data.files);
            (updation) ? setUpdation(false) : setUpdation(true);
          });
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  }

  return (
    <div
      className="container absolute inset-0 z-50 mx-auto w-1/4 h-1/2 mt-32 rounded-xl flex flex-col items-center"
      style={{ backgroundColor: "#2D4A53" }}
    >
      <div
        {...getRootProps({ className: "dropzone" })}
        className="h-60 py-24 px-12 block mt-6 mx-auto w-80 bg-transparent border-4 border-amber-500 border-dotted rounded-lg text-xl font-medium text-gray-900 dark:text-white"
      >
        <input {...getInputProps()} />
        {!isDragReject && <p>Drag 'n' drop your file here</p>}
        {isFileTooLarge && (
          <div className="text-danger mt-2">File is too large.</div>
        )}
      </div>
      <aside className="flex justify-center ">
        <ul>{files}</ul>
      </aside>
      <div className="ml-24">
        <button
          className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
          onClick={() => {
            uploadFile();
            setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null});
          }}
        >
          upload
        </button>
        <button
          className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
          onClick={() => {
            setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null });
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default UploadFileCard;
