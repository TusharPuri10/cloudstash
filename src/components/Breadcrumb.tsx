import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { pageState } from "@/atoms/state";
import { useState } from "react";

export default function Breadcrumb() {
  const router = useRouter();
  const [page, setPage] = useRecoilState(pageState);
  const [dropDown, setDropDown] = useState(false);
  return (
    <nav className="flex justify-between ml-32" aria-label="Breadcrumb">
      <ol className="inline-flex items-center mb-3 sm:mb-0">
        <li>
          <button
            className="text-white font-medium  px-2 hover:text-yellow-500"
            onClick={() => {
              router.push("/");
              setPage("/");
            }}
            type="button"
          >
            Home
          </button>
        </li>
        <span className="mx-2 text-gray-400">/</span>
        <li aria-current="page" className="relative items-center">
          <div className="flex items-center">
            <button
              className="text-white inline-flex items-center font-medium  px-2 hover:text-yellow-500"
              onClick={()=>{(dropDown)?setDropDown(false):setDropDown(true)}}
            >
              Root
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {dropDown && 
            <div
            style={{backgroundColor: "#2D4A53"}}
              id="dropdown-database"
              className="z-10 mt-40 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-white dark:text-white"
              >
                <li>
                  <button
                    className="px-4 py-2 dark:hover:text-gray-300"
                    
                  >
                    Create Folder
                  </button>
                </li>
                <li>
                  <button
                    className="px-4 py-2 dark:hover:text-gray-300"
                  >
                    Upload File
                  </button>
                </li>
              </ul>
            </div>}
          </div>
        </li>
      </ol>
    </nav>
  );
}
