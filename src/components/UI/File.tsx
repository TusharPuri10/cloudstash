import Draggable, { DraggableEvent, DraggableData, DraggableEventHandler } from 'react-draggable';
import React, { useState, useRef, useEffect } from 'react';
import { creationState } from "@/atoms/state";
import axios from "axios";

interface Props {
    file: {
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
  const [position, setPosition] = useState({ x: (index % 8) * 150, y: Math.floor(index / 8) * 150 });
  const [s3GetPromiseUrl, setS3GetPromiseUrl] = useState<string|null>(null);
  const [s3GetDownloadUrl, setS3GetDownloadUrl] = useState<string|null>(null);
  const [creation, setCreation] = useState(creationState);
  

  const handleDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
    // Update the position during drag
    setPosition((prevPosition) => ({ x: prevPosition.x + data.deltaX, y: prevPosition.y + data.deltaY }));
    if (fileRef.current) {
        fileRef.current.style.zIndex = '10';
      }
  };

  const handleDragStop = () => {
    // Reset position after dragging stops
    setTimeout(() => {
        setPosition({ x: (index % 8) * 150, y: Math.floor(index / 8) * 150 });
        if (fileRef.current) {
          fileRef.current.style.zIndex = '0';
        }
      }, 180); 
  };

  useEffect(() => {
    try{
      
      // if(!s3GetPromiseUrl)
      // {
      //   axios
      //   .post("/api/aws/s3/get-file", {
      //     file_key: file.filekey,
      //     type: file.type,
      //   })
      //   .then((response) => setS3GetPromiseUrl(response.data.url))
      //   .catch((error) => console.log(error.message));
      // }
      // if(!s3GetDownloadUrl)
      // {
      //   axios
      //   .post("/api/aws/s3/download-file", {
      //     file_key: file.filekey,
      //     type: file.type,
      //     file_name: file.name,
      //   })
      //   .then((response) => setS3GetDownloadUrl(response.data.url))
      //   .catch((error) => console.log(error.message));
      // }
    }
    catch(error){
      console.log(error);
    }
  }, []);
  
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
        ref={fileRef}
        style={{
          position: 'absolute',
          cursor: 'move',
          transition: 'transform 0.12s ease', // Add a smooth transition effect
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img src="/file.png" alt="Folder Icon" draggable="false" onDoubleClick={()=>window.open(s3GetPromiseUrl, "_blank")}/>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute top-0 right-0 mt-1 mr-1 w-5 h-5"
          onMouseEnter={() => setShowDetails(true)}
          onMouseLeave={() => setShowDetails(false)}
          type="button"
        >
            i
        </button>
        <a
          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
          href={s3GetDownloadUrl}
          download={`${file.name}.${file.type!.split('/')[1]}`}
        >
          Download
        </a>
        <div className="flex items-center place-content-center">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{file.name}</span>
        </div>
        {showDetails && (
          <div className="absolute top-10 left-0 mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white w-40 h-auto">
            <p>Created: {new Date(file.createdAt!).toLocaleString()}</p>
            <p>Updated: {new Date(file.updatedAt!).toLocaleString()}</p>
          </div>
        )}
      </div>
    </Draggable>
  );
}
