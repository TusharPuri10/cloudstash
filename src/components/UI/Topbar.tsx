import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/UI/Breadcrumb";
import { useRecoilValue } from "recoil";
import { cardState, messageState } from "@/atoms/state";

export default function Topbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const card = useRecoilValue(cardState);
  const router = useRouter();
  return (
    <div className="bg-[#0D1F23]">
      <nav
        className={card.shown && router.asPath === "/root" ? "opacity-30" : ""}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          {/* logo */}
          <button
            className="ml-6 flex items-center py-6 self-center text-md text-white sm:text-xl md:text-2xl font-semibold whitespace-nowrap "
            onClick={() => {
              router.push("/");
            }}
          >
            CloudStash
          </button>
          {/* Menu - Home, About, contact */}
          {router.asPath === "/root" ? (
            <div>
              <Breadcrumb />
            </div>
          ) : (
            <div
              id="navbar-cta"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <ul
                className={`flex md:flex-row flex-col font-medium rounded-lg md:bg-[#0D1F23] bg-[#253745] mr-20 md:static ${
                  isMenuOpen ? "" : "hidden md:flex"
                } absolute right-2 top-20`}
              >
                <li key="home" className="px-5 md:py-0 py-2 mr-1">
                  <button
                    className="no-underline hover:underline"
                    style={{
                      color: router.asPath === "/" ? "#FFA33C" : "white",
                    }}
                    onClick={() => {
                      router.push("/");
                      setIsMenuOpen(false);
                    }}
                    type="button"
                  >
                    Home
                  </button>
                </li>
                <li key="about" className="px-5 md:py-0 py-2">
                  <button
                    className="no-underline hover:underline"
                    style={{
                      color: router.asPath === "/about" ? "#FFA33C" : "white",
                    }}
                    onClick={() => {
                      router.push("/about");
                      setIsMenuOpen(false);
                    }}
                    type="button"
                  >
                    About
                  </button>
                </li>
                <li key="contact" className="px-5 md:py-0 py-2">
                  <button
                    className="no-underline hover:underline"
                    style={{
                      color: router.asPath === "/contact" ? "#FFA33C" : "white",
                    }}
                    onClick={() => {
                      router.push("/contact");
                      setIsMenuOpen(false);
                    }}
                    type="button"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            {(router.asPath === "/" ||
              router.asPath === "/about" ||
              router.asPath === "/contact") && (
              <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
                id="navbar-cta"
                className="md:hidden"
              >
                <button
                  data-collapse-toggle="navbar-default"
                  type="button"
                  className="flex items-center w-10 h-10 mr-4 ml-4 my-5 justify-center text-sm text-amber-500 rounded-lg hover:text-amber-600 "
                  aria-controls="navbar-default"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>
              </div>
            )}
            {/* Profile */}
            <div className="relative items-center">
              {session && session.user ? (
                <div
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button
                    type="button"
                    className="flex mr-4 ml-6 rounded-full py-3"
                  >
                    <img
                      className="rounded-full w-11 h-11 hover:opacity-75"
                      src={session.user.image!}
                    ></img>
                  </button>
                  {/* Drop Down Menu */}
                  <div>
                    {isUserMenuOpen && (
                      <div
                        className="border-2 border-[#0D1F23] z-50 bg-[#253745] absolute right-2 min-w-40 text-base list-none divide-y divide-[#0D1F23] rounded-lg shadow "
                        id="user-dropdown"
                      >
                        <div className="px-4 py-4">
                          <span className="block text-sm text-white ">
                            {session.user.name}
                          </span>
                          <span className="block text-sm text-white truncate ">
                            {session.user.email}
                          </span>
                        </div>
                        <ul
                          className="flex flex-col items-center"
                          aria-labelledby="user-menu-button"
                        >
                          <li>
                            <button
                              className="h-8 px-4 m-2 text-sm bg-[#4A5C6A] text-white font-bold rounded "
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
                <div>
                  {status === "loading" ? (
                    <div role="status" className="py-3">
                      <svg
                        aria-hidden="true"
                        className="w-11 h-11 mr-4 ml-6 text-[#5A636A] animate-spin fill-amber-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <button
                      className="bg-transparent border-2 mt-6 border-yellow-600 hover:bg-yellow-600 text-yellow-50 rounded-lg font-semibold hover:text-white py-1 px-3 my-4 mr-4"
                      onClick={() => signIn()}
                    >
                      Signin
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
