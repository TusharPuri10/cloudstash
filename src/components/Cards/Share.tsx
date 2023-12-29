import { useRecoilState } from "recoil";
import { cardState, updationState, messageState } from "@/atoms/state";
import axios from "axios";
import { useState } from "react";
import { generateFileKey } from "@/lib/keygenerator";

// ShareCard Component
const ShareCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [updation, setUpdation] = useRecoilState(updationState);
  const [shareWithEmail, setShareWithEmail] = useState<
    string | null | undefined
  >("");
  const [shareWithEveryone, setShareWithEveryone] = useState<boolean>(false);
  const [optionSelect, setOptionSelect] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>(card.url!);
  const [message, setMessage] = useRecoilState(messageState);
  const [loading, setLoading] = useState(false);

  // SHARE
  async function Share() {
    try {
      if (card.filekey) {
        // Logic to handle sharing with specific email
        if (shareWithEmail && !shareWithEveryone) {
          const filekey = generateFileKey();
          axios
            .post("/api/db/file/sharefile", {
              copiedfilekey: filekey,
              originalfilekey: card.filekey,
              userEmail: shareWithEmail,
            })
            .then((response) => {
              // console.log(response.data);
              setMessage({
                open: true,
                text: response.data.message,
                type: response.data.type,
              });
              setTimeout(() => {
                setMessage({ text: "", open: false, type: "" });
              }, 2000);
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
          setUpdation(!updation);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function selectText() {
    const input = document.getElementById("text-box") as HTMLInputElement;
    input!.focus();
    input!.select();
  }

  return (
    <div
      className="absolute inset-0 z-50 mx-auto md:w-1/4 w-3/5 h-72 mt-24 rounded-xl flex flex-col items-center"
      style={{ backgroundColor: "#2D4A53" }}
    >
      <div className="flex flex-row justify-center w-full">
        <label className="mt-8 mb-4 mx-4 text-xl font-medium text-gray-900 dark:text-white">
          Share
        </label>
        {!optionSelect && (
          <label
            className="inline-flex hover:text-gray-300 w-28  h-9 py-2 px-4 mt-8 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onClick={() => setOptionSelect(true)}
          >
            {shareWithEveryone ? "everyone" : "friend"}
            <svg
              className="w-2.5 h-2.5 ml-3 mt-1.5"
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
          </label>
        )}
        {optionSelect && !shareWithEveryone && (
          <ul className="mt-8 w-28 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li
              style={{ cursor: "pointer" }}
              key="friend"
              className="px-4 py-2 hover:text-gray-300 border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                setShareWithEveryone(false);
                setOptionSelect(false);
              }}
            >
              friend
            </li>
            <li
              style={{ cursor: "pointer" }}
              key="everyone"
              className="px-4 py-2 hover:text-gray-300 border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                setShareWithEveryone(true);
                setOptionSelect(false);
              }}
            >
              everyone
            </li>
          </ul>
        )}
        {optionSelect && shareWithEveryone && (
          <ul className="mt-8 w-28 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li
              style={{ cursor: "pointer" }}
              key="everyone"
              className="px-4 py-2 hover:text-gray-300 border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                setShareWithEveryone(true);
                setOptionSelect(false);
              }}
            >
              everyone
            </li>
            <li
              style={{ cursor: "pointer" }}
              key="friend"
              className="px-4 py-2 hover:text-gray-300 border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                setShareWithEveryone(false);
                setOptionSelect(false);
              }}
            >
              friend
            </li>
          </ul>
        )}
      </div>

      {/* Input for sharing with a specific email */}
      {shareWithEveryone === false && (
        <div className={`${optionSelect ? "w-full px-4" : "w-full mt-8 px-4"}`}>
          <label className="text-left text-lg font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <div className="mt-2">
            <input
              autoFocus={true}
              className="w-full bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white "
              placeholder="Enter email"
              value={shareWithEmail || ""}
              onChange={(e) => setShareWithEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  Share();
                  setLoading(true);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Display share link or share button based on selection */}
      {shareWithEveryone ? (
        <div className={`${optionSelect ? "w-full px-4" : "w-full mt-8 px-4"}`}>
          <p className="text-gray-900 dark:text-white mb-4">Link</p>
          <div className="w-full">
            <input
              id="text-box"
              className="w-full bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white "
              defaultValue={shareLink}
              required
            ></input>
            <div className="w-full text-right">
              <button
                className="inline mt-4 shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
                onClick={() => {
                  /* Logic to copy share link to clipboard */
                  selectText();
                  setMessage({ open: true, text: "copied", type: "success" });
                  setTimeout(() => {
                    setMessage({ text: "", open: false, type: "" });
                  }, 2000);
                  navigator.clipboard.writeText(shareLink || "");
                }}
              >
                Copy
              </button>
            </div>
          </div>
          {message.open && message.text === "copied" && (
            <div
              id="toast-simple"
              className="absolute top-76 flex items-center w-auto right-12 max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                data-slot="icon"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
              <div className="ps-4 text-sm font-normal">{message.text}</div>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-undo"
                aria-label="Close"
                onClick={() => setMessage({ open: false, text: "", type: "" })}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full text-right mt-10">
          <button
            className="inline shadow-lg shadow-teal-950 text-white bg-amber-600 md:text-lg md:font-medium rounded-lg md:py-1.5 py-1 md:px-3.5 px-3 mr-2"
            onClick={() => {
              Share();
              setLoading(true);
            }}
          >
            {loading ? "sharing..." : "share"}
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
      )}
    </div>
  );
};

export default ShareCard;
