import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/router'

export default function Topbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter()
  return (
    <div>
      <nav className="dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="http://localhost:3000/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              CloudStash
            </span>
          </a>
          <div className="flex md:order-2">
            <div className="relative items-center">
              {session && session.user ? (
                <div>
                  <button
                    type="button"
                    className="flex mr-2 rounded-full"

                    onClick={() => {
                      isUserMenuOpen
                        ? setIsUserMenuOpen(false)
                        : setIsUserMenuOpen(true);
                    }}
                  >
                    <img
                      className="rounded-full w-11 h-11 hover:opacity-75"
                      src={session.user.image!}
                      alt="user profile"
                    ></img>
                  </button>
                  {/* Drop Down Menu */}
                  <div>
                    {isUserMenuOpen && (
                      <div
                        className="z-50 absolute mt-8 right-0 min-w-40 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                        id="user-dropdown"
                      >
                        <div className="px-4 py-3">
                          <span className="block text-sm text-gray-900 dark:text-white">
                            {session.user.name}
                          </span>
                          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                            {session.user.email}
                          </span>
                        </div>
                        <ul
                          className="py-2 flex flex-col items-center"
                          aria-labelledby="user-menu-button"
                        >
                          <li>
                            <button
                              className="h-8 px-4 m-2 text-sm bg-blue-700 hover:bg-blue-800 text-white font-bold border border-blue-700 rounded"
                              onClick={() => {
                                signOut();
                              }}
                            >
                              Signout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4"
                  onClick={() => signIn()}
                >
                  Signin
                </button>
              )}
            </div>
            <button data-collapse-toggle="navbar-cta"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
                isMenuOpen
                  ? setIsMenuOpen(false)
                  : setIsMenuOpen(true);
              }}>
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
          </div>
          <div className={(isMenuOpen)?"items-center justify-between w-full md:flex md:w-auto md:order-1":"relative items-center justify-between hidden w-full md:flex md:w-auto md:order-1"} id="navbar-cta">
            <ul className={(isMenuOpen)?" z-50 absolute mt-6 mr-2 right-0 flex flex-col font-medium p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700":"mt-6 mr-2 right-0 flex flex-col font-medium p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"}>
              <li>
                <button onClick={() => router.push('/')} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-3 py-2 text-xs text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/about')} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-3 py-2 text-xs text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/contact')} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-3 py-2 text-xs text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                  Contact
                </button>
              </li>
            </ul>
        </div>
        </div>
      </nav>
    </div>
  );
}
