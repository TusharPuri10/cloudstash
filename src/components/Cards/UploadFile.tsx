import { useRecoilState } from "recoil";
import { cardState } from "@/atoms/state";
import { useDropzone } from "React-dropzone";
import { useState } from "react";

interface Accept {
  [key: string]: string[];
}

function Dropzone() {

  // Props for Drop Zone
  const maxSize = 1024 * 1024 * 10; //10mb
  const minSize = 0;
  const accept: Accept = {
    '*/*': ['*'],
  };
  const { getRootProps, getInputProps, isDragReject, acceptedFiles, fileRejections } = useDropzone({
    minSize,
    maxSize,
    multiple: false,
    accept
  });
  const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  // Previes the file name in drop zone
  const files = acceptedFiles.map((file) => (
    <li className="text text-amber-500">
      {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
    </li>
  ));

  //// Do all the s3 upload and everything
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  };
  

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} onChange={handleFileChange}/>
        {!isDragReject && <p>Drag 'n' drop some files here</p>}
        {isFileTooLarge && (
          <div className="text-danger mt-2">
            File is too large.
          </div>
        )}
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

const CreateFolderCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  return (
    <div className="absolute inset-0 z-50 mx-auto w-1/4 h-1/2 mt-24 rounded-xl flex flex-col items-center" style={{backgroundColor: "#2D4A53"}}>
      <div className="block mt-6 mx-auto w-80 py-20 px-8 bg-transparent border-4 border-amber-500 border-dotted rounded-lg text-xl font-medium text-gray-900 dark:text-white">
        <Dropzone />
      </div>
      <div className="ml-24">
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 border border-green-900 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          // TODO: add logic to create folder here
          setCard({ name: "", shown: false });
        }}
      >
        upload
      </button>
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 border border-green-900 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          setCard({ name: "", shown: false });
        }}
      >
        cancel
      </button>
      </div>
    </div>
  );
};

export default CreateFolderCard;
