import Draggable, {
  DraggableEvent,
  DraggableData,
  DraggableEventHandler,
} from "react-draggable";
import React, { useState, useRef, useEffect } from "react";
import { directoryState, cardState } from "@/atoms/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FaTrash, FaMarker } from "react-icons/fa";
import { calculatePosition } from "@/lib/grid";
import { useDrag } from "react-dnd";

interface Props {
  folder: {
    id: number | null | undefined;
    name: string | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
  };
  index: number;
}

export default function Folder({ folder, index }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(calculatePosition(index));
  const setDirectory = useSetRecoilState(directoryState);
  const [card, setCard] = useRecoilState(cardState);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "object",
    item: { id: folder.id, key: null, name: null, type: null },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  folderRef.current && drag(folderRef);

  const handleDrag: DraggableEventHandler = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    // Update the position during draga
    setPosition((prevPosition) => ({
      x: prevPosition.x + data.deltaX,
      y: prevPosition.y + data.deltaY,
    }));
  };

  const handleDragStop = () => {
    // Reset position after dragging stops
    setTimeout(() => {
      if (!card.shown) setPosition(calculatePosition(index));
      if (folderRef.current) {
        folderRef.current.style.zIndex = "0";
      }
    }, 180);
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition(calculatePosition(index));
    };
    const updateBounds = () => {
      setBounds({
        left: 0,
        top: 0,
        bottom: window.innerHeight - 250,
        right: window.innerWidth - 200,
      });
    };
    if (!card.shown) handleResize();
    updateBounds();
    window.addEventListener("resize", handleResize);
    window.addEventListener("bounds", updateBounds);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("bounds", updateBounds);
    };
  }, [index, card, window.innerWidth]);

  return (
    <Draggable
      axis="both"
      position={position}
      scale={1}
      bounds={bounds}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        className={`md:w-20 md:h-20 w-16 h-16 handle z-0 mx-12 mt-10`}
        onMouseLeave={() => {
          setShowDetails(false);
        }}
        onDoubleClick={() => {
          setDirectory((prevDirectory) => [
            ...prevDirectory,
            { id: folder.id, name: folder.name },
          ]);
        }}
        style={{
          position: "absolute",
          transition: "transform 0.12s ease", // Add a smooth transition effect
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "pointer",
          zIndex: isDragging || showDetails ? 100 : 0,
        }}
        ref={drag}
      >
        <img src="/folder.png" alt="folder icon" className="w-full h-full" />
        <button
          key={folder.id}
          className="bold text-white bg-blue-700 hover:bg-blue-800 rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute top-0 right-0 mt-1 mr-1 w-5 h-5"
          onMouseEnter={() => {
            if (!isDragging) setShowDetails(true);
          }}
          type="button"
        >
          i
        </button>
        <div className="flex items-center place-content-center cursor-pointer">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {folder.name!.length > 12
              ? `${folder.name!.substring(0, 12)}...`
              : folder.name}
          </span>
        </div>
        {showDetails && (
          <div className="cursor-pointer absolute top-0 w-44">
            <div className="h-12"></div>
            <div className="h-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 text-sm text-gray-700 dark:text-white">
              <p className="text-amber-500">Name:</p>
              <p>{folder.name}</p>
              <p className="text-amber-500">Created:</p>
              <p> {new Date(folder.createdAt!).toLocaleString()}</p>
              <p className="text-amber-500">Updated:</p>
              <p>{new Date(folder.updatedAt!).toLocaleString()}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 text-xs rounded flex items-center"
                  onClick={() =>
                    setCard({
                      name: "Delete",
                      shown: true,
                      folderId: folder.id,
                      filekey: null,
                      newName: null,
                      fileType: null,
                      sharedfiledelete: false,
                    })
                  }
                >
                  <FaTrash />
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 text-xs rounded flex items-center"
                  onClick={() =>
                    setCard({
                      name: "Rename",
                      shown: true,
                      folderId: folder.id,
                      filekey: null,
                      newName: folder.name,
                      fileType: null,
                      sharedfiledelete: false,
                    })
                  }
                >
                  <FaMarker />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
}
