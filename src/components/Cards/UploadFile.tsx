import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cardState,
  directoryState,
  userState,
  updationState,
  messageState,
  fileState,
} from "@/atoms/state";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSession } from "next-auth/react";
import { generateFileKey } from "@/lib/keygenerator";
import { useState } from "react";

const UploadFileCard = () => {
  const [loading, setLoading] = useState(false);
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
      "application/vnd.ms-excel": [".csv"], //csv
    },
  });
  const isFileTooLarge =
    fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  // List of Files
  const file = acceptedFiles.map((file) => (
    <li className="text text-amber-500" key={file.size}>
      {/* {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name} */}
      {file.name}
      {(file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") ? (<img src={URL.createObjectURL(file)} alt="*" className="object-scale-down w-20 h-20"/>) : (<></>)}
    </li>
  ));

  // States
  const directory = useRecoilValue(directoryState);
  const user = useRecoilValue(userState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const setCard = useSetRecoilState(cardState);
  const { data: session } = useSession();
  const setMessage = useSetRecoilState(messageState);
  const files = useRecoilValue(fileState);

  async function uploadFile() {
    if (acceptedFiles[0] && session && session.user) {
      try {
        // console.log(user.fileLimit, files.length);
        if (user.fileLimit && files.length + 1 > user.fileLimit) {
          setMessage({
            text: "You have reached the limit",
            open: true,
            type: "error",
          });
          setTimeout(() => {
            setMessage({ text: "", open: false, type: "" });
          }, 2000);
          setLoading(false);
            setCard({
              name: "",
              shown: false,
              folderId: null,
              filekey: null,
              newName: null,
              fileType: null,
              sharedfiledelete: false,
            });
          return;
        }
        const filekey = generateFileKey();
        let { data } = await axios.post("/api/aws/s3/upload-file", {
          file_key: filekey,
          type: acceptedFiles[0].type,
        });
        // console.log("data: ", data);
        await axios
          .put(data.url, acceptedFiles[0])
          .then((res) => {
            // console.log(res);
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
            // console.log("files: ", res.data.files);
            setUpdation(!updation);
            setLoading(false);
            setCard({
              name: "",
              shown: false,
              folderId: null,
              filekey: null,
              newName: null,
              fileType: null,
              sharedfiledelete: false,
            });
          });
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  }

  return (
    <div
      className="container absolute inset-0 z-50 mx-auto md:w-1/4 w-1/2 h-80 mt-32 rounded-xl flex flex-col items-center"
      style={{ backgroundColor: "#2D4A53" }}
    >
      <div
        {...getRootProps({ className: "dropzone" })}
        className="h-52 px-8 pt-12 block mt-4 w-full bg-transparent border-4 border-amber-500 border-dotted rounded-lg"
      >
        <input {...getInputProps()} />
        {!isDragReject && ( acceptedFiles.length === 0 ? (
          <div>
            <p className="md:text-xl text-sm font-medium text-gray-900 dark:text-white">
              Drag 'n' drop your file here
            </p>
            <p className="text-[#CCD0CF] text-sm">or click here</p>
          </div> ) : (
            <aside className="flex justify-center ">
              <ul>{file}</ul>
            </aside>
          )
        )}
        {isFileTooLarge && (
          <div className="text-danger mt-2">File is too large.</div>
        )}
      </div>
      <div className="w-full text-right mt-6">
        <button
          className="inline shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
          onClick={() => {
            uploadFile();
            setLoading(true);
          }}
        >
          {loading ? "uploading..." : "upload"}
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

export default UploadFileCard;
