import Draggable, { DraggableEvent, DraggableData, DraggableEventHandler } from 'react-draggable';
import React, { useState, useRef, useEffect } from 'react';
import { cardState, dragState, mainFolderState } from "@/atoms/state";
import { useRecoilState } from 'recoil';
import axios from "axios";
import { FaDownload, FaShare, FaTrash , FaMarker } from 'react-icons/fa';
import { calculatePosition } from '@/lib/grid';

interface Props {
    file: {
        owner: string | null | undefined;
        sharekey: string | null | undefined;
        filekey: string | null | undefined;
        name: string | null | undefined;
        createdAt: string | null | undefined;
        updatedAt: string | null | undefined;
        type: string | null | undefined;
    },
    index: number
}

export default function File({ file, index }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const fileRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(calculatePosition(index));
  const [s3GetPromiseUrl, setS3GetPromiseUrl] = useState<string|undefined>(undefined);
  const [s3GetDownloadUrl, setS3GetDownloadUrl] = useState<string|undefined>(undefined);
  const [card, setCard] = useRecoilState(cardState);
  const [drag, setDrag] = useRecoilState(dragState);
  const [mainFolder, setMainFolder] = useRecoilState(mainFolderState);
  

  const handleDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
    // Update the position during drag
    setPosition((prevPosition) => ({ x: prevPosition.x + data.deltaX, y: prevPosition.y + data.deltaY }));
    setDrag({entity: "file", filekey: file.filekey, id: null});
    if (fileRef.current) {
        fileRef.current.style.zIndex = '10';
      }
  };

  const handleDragStop = () => {
    // Reset position after dragging stops
    setTimeout(() => {
        setPosition(calculatePosition(index));
        if (fileRef.current) {
          fileRef.current.style.zIndex = '0';
        }
      }, 180); 
  };

  useEffect(() => {
    try{
      if(!s3GetPromiseUrl)
      {
        const filekey = (file.sharekey==="" ? file.filekey : file.sharekey)
        axios
        .post("/api/aws/s3/get-file", {
          file_key: filekey,
          type: file.type,
        })
        .then((response) => setS3GetPromiseUrl(response.data.url))
        .catch((error) => console.log(error.message));
      }
      if(!s3GetDownloadUrl)
      {
        const filekey = (file.sharekey==="" ? file.filekey : file.sharekey)
        axios
        .post("/api/aws/s3/download-file", {
          file_key: filekey,
          type: file.type,
          file_name: file.name,
        })
        .then((response) => setS3GetDownloadUrl(response.data.url))
        .catch((error) => console.log(error.message));
      }
    }
    catch(error){
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition(calculatePosition(index));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [index]);

  return (
    <Draggable
      axis="both"
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      grid={[5, 5]}
      scale={1}
      bounds="parent"
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        className="w-20 h-20 handle z-0 mx-12 mt-10"
        onMouseLeave={() => {
          setShowDetails(false);
          if (fileRef.current) {
            fileRef.current.style.zIndex = '0';
          }
        }}
        ref={fileRef}
        style={{
          position: 'absolute',
          cursor: 'move',
          transition: 'transform 0.12s ease', // Add a smooth transition effect
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img src={
          file.type === "application/pdf" ? "filetypes/pdf.png" :
          file.type === "image/jpeg" ? "filetypes/jpg.png" :
          file.type === "image/png" ? "filetypes/png.png" :
          file.type === "text/plain" ? "filetypes/txt.png" :
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "filetypes/docx.png" :
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? "filetypes/xlsx.png" :
          file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? "filetypes/pptx.png" :
          file.type === "application/zip" ? "filetypes/zip.png" :
          "/file.png"
        } alt="Folder Icon" draggable="false" onDoubleClick={()=>window.open(s3GetPromiseUrl, "_blank")}/>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute top-0 right-0 mt-1 mr-1 w-5 h-5"
          onMouseEnter={() => {
            setShowDetails(true);
            if (fileRef.current) {
              fileRef.current.style.zIndex = '10';
            }
          }}
          type="button"
        >
            i
        </button>
        <div className="flex items-center place-content-center">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{file.name!.length > 12 ? `${file.name!.substring(0, 12)}...` : file.name}</span>
        </div>
        {showDetails && (
        <div className="absolute top-0 left-0 w-44">
          <div className='h-12'></div>
          <div className='h-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white'>
            {mainFolder==="shared" && <p className='text-amber-500'>Owner:</p>}
            {mainFolder==="shared" && <p>{file.owner}</p>}
            <p className='text-amber-500'>Name:</p>
            <p>{file.name}</p>
            <p className='text-amber-500'>Created:</p>
            <p> {new Date(file.createdAt!).toLocaleString()}</p>
            <p className='text-amber-500'>Updated:</p>
            <p>{new Date(file.updatedAt!).toLocaleString()}</p>
            <div className="flex space-x-2 mt-2">
              <a href={s3GetDownloadUrl} download={`${file.name}.${file.type!.split('/')[1]}`}>
                <button
                className="bg-green-500 text-white px-2 py-1 text-xs rounded flex items-center">
                  <FaDownload/>
                </button>
              </a>
              {mainFolder==="root" && <button
                className="bg-purple-500 text-white px-2 py-1 text-xs rounded flex items-center"
                onClick={() => setCard({ name: "Share", shown: true,  folderId: null, filekey: file.filekey, newName: null, url: s3GetPromiseUrl, sharedfiledelete: false })}
              >
                <FaShare/>
              </button>}
              <button
                className="bg-red-500 text-white px-2 py-1 text-xs rounded flex items-center"
                onClick={() => {
                  (file.sharekey===""?setCard({ name: "Delete", shown: true,  folderId: null, filekey: file.filekey, newName: null, url: null, sharedfiledelete: false }):setCard({ name: "Delete", shown: true,  folderId: null, filekey: file.filekey, newName: null, url: null, sharedfiledelete: false }))
                  }}>
                <FaTrash/>
              </button>
              <button
                className="bg-gray-500 text-white px-2 py-1 text-xs rounded flex items-center"
                onClick={() => setCard({ name: "Rename", shown: true,  folderId: null, filekey: file.filekey, newName: file.name, url: null, sharedfiledelete: false })}
              >
                <FaMarker/>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Draggable>
  );
}
