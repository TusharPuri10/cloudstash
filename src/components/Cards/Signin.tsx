import { signIn } from "next-auth/react";

const AuthCard = () => {
  return (
    <div
      className="absolute inset-0 z-50 mx-auto w-1/2 h-1/2 mt-36 rounded-xl auth-card flex flex-col items-center justify-center"
      style={{ backgroundColor: "#132E35" }}
    >
      <h1 className="pb-4 md:text-3xl text-2xl font-extrabold text-white md:text-4xl lg:text-5xl">
        Welcome to CloudStash
      </h1>
      <p className="md:text-lg text-md font-normal text-white lg:text-xl">
        Sign in to access your CloudStash account
      </p>
      <button
        type="button"
        className="md:w-3/5 w-11/12 bg-[#4285F4] text-white w-full py-2.5 rounded-lg mt-4 hover:bg-[#4285F4]/70  md:text-base text-sm md:font-semibold transition duration-200 flex items-center justify-center"
        onClick={() => signIn("google")}
      >
        <svg
          className="w-4 h-4 mr-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Sign in with Google
      </button>
      <button
        type="button"
        className="md:w-3/5 w-11/12 bg-gray-600 text-white w-full py-2.5 rounded-lg mt-4 hover:bg-gray-700 md:text-base text-sm md:font-semibold transition duration-200 flex items-center justify-center"
        onClick={() => signIn("github")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="w-4 h-4 mr-2"
          viewBox="0 0 1792 1792"
        >
          <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
        </svg>
        Sign in with GitHub
      </button>
    </div>
  );
};

export default AuthCard;
