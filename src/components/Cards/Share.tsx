import { useRecoilState } from "recoil";
import { cardState, updationState, messageState } from "@/atoms/state";
import axios from "axios";
import { useEffect, useState } from "react";

// ShareCard Component
const ShareCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [shareWithEmail, setShareWithEmail] = useState<string | null | undefined>("");
  const [shareWithEveryone, setShareWithEveryone] = useState<boolean>(false);
  const [optionSelect, setOptionSelect] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string | null | undefined>(card.url);
  const [message, setMessage] = useRecoilState(messageState);

  // SHARE
  async function Share() {
    try {
      if (card.filekey) {
        // Logic to handle sharing with specific email
        if (shareWithEmail && !shareWithEveryone) {
          // Call your API with shareWithEmail
          // Example:
          axios
            .post("/api/db/file/sharefile", {
              filekey: card.filekey,
              shareWithEmail: shareWithEmail,
            })
            .then((response) => {
              console.log(response.data);
              (updation) ? setUpdation(false) : setUpdation(true);
            })
            .catch((error) => console.log(error.message));
        } else {
          // Logic to handle sharing with everyone
          // Call your API with shareWithEveryone
          // Example:
          axios
            .post("/api/db/file/sharefile", {
              filekey: card.filekey,
              shareWithEveryone: true,
            })
            .then((response) => {
              console.log(response.data);
              // Extract and set the share link in state
              setShareLink(response.data.shareLink);
              (updation) ? setUpdation(false) : setUpdation(true);
            })
            .catch((error) => console.log(error.message));
        }
      }

      // Similar logic for folder sharing...
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="absolute inset-0 z-50 mx-auto w-1/4 h-72 mt-24 rounded-xl flex flex-col items-center" style={{ backgroundColor: "#2D4A53" }}>
        <div className="flex flex-row justify-center">
        <label className="mt-8 mb-4 mr-4 text-xl font-medium text-gray-900 dark:text-white">Share with</label>
        {!optionSelect && <label className="inline-flex w-28 items-center px-4 mt-8 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onClick={()=>setOptionSelect(true)}>
        {shareWithEveryone?"everyone":"friend"}
            <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
            >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
            />
            </svg>
        </label>}
        {optionSelect && !shareWithEveryone && <ul className="mt-8 w-28 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li style={{ cursor: "pointer" }} key="friend" className="px-4 py-2 border-b border-gray-200 dark:border-gray-600" onClick={()=>{setShareWithEveryone(false); setOptionSelect(false);}}>friend</li>
            <li style={{ cursor: "pointer" }} key="everyone" className="px-4 py-2 border-b border-gray-200 dark:border-gray-600" onClick={()=>{setShareWithEveryone(true); setOptionSelect(false);}}>everyone</li>
        </ul>}
        {optionSelect && shareWithEveryone && <ul className="mt-8 w-28 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li style={{ cursor: "pointer" }} key="everyone" className="px-4 py-2 border-b border-gray-200 dark:border-gray-600" onClick={()=>{setShareWithEveryone(true); setOptionSelect(false);}}>everyone</li>
            <li style={{ cursor: "pointer" }} key="friend" className="px-4 py-2 border-b border-gray-200 dark:border-gray-600" onClick={()=>{setShareWithEveryone(false); setOptionSelect(false);}}>friend</li>
        </ul>}
        </div>
        
      {/* Input for sharing with a specific email */}
      {shareWithEveryone === false && (
        <div className="absolute mt-28">
          <label className="block mb-2 text-gray-900 dark:text-white">Email</label>
          <input
            className="bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white "
            placeholder="Enter email"
            value={shareWithEmail || ''}
            onChange={(e) => setShareWithEmail(e.target.value)}
          />
        </div>
      )}

      {/* Display share link or share button based on selection */}
      {shareWithEveryone ? (
        <div className="absolute mt-36">
          <p className="text-gray-900 dark:text-white">Link</p>
          <div className="flex items-center">
            <span className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg w-60 h-10 items-center">{shareLink!.length > 30 ? `${shareLink!.substring(0, 30)}...` : shareLink}</span>
            <button
              className="ml-2 text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3"
              onClick={() => {
                /* Logic to copy share link to clipboard */
                setMessage({open: true, text: "copied"});
                setTimeout(() => {
                    setMessage({text: "", open: false});
                  }, 1500);
                navigator.clipboard.writeText(shareLink || '');
              }}
            >
              Copy
            </button>
          </div>
          {message.open && message.text==="copied" && <div id="toast-simple" className="absolute top-20 flex items-center w-auto right-0 max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <div className="ps-4 text-sm font-normal">{message.text}</div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-undo" aria-label="Close"
                onClick={()=>setMessage({open: false, text: ""})}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>}
        </div>
      ) : (
        <div className="absolute mt-48 ml-24">
          <button
            className="inline text-white bg-stone-500 hover:bg-neutral-500 rounded-2xl py-1 px-3 my-4 mx-2"
            onClick={() => {
              Share();
              setCard({ name: "", shown: false, folderId: null, filekey: null, newName: null, url: null });
            }}
          >
            share
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
      )}
    </div>
  );
};

export default ShareCard;
