import CloudAndBox from "@/components/3dmodels/CloudAndBox";
import NextNProgress from "nextjs-progressbar";
import Topbar from "@/components/UI/Topbar";

export default function App() {
  return (
    <div className="relative z-0 w-full h-screen">
      <NextNProgress color="#FFB000" />
      <div className="absolute inset-0 z-50 h-20">
        <Topbar />
        <h1 className="flex justify-center items-center px-4 pt-4 mt-8 mb-2 text-2xl font-extrabold text-white md:text-4xl lg:text-5xl xl:text-6xl">
          AWS S3 cloud-based storage service
        </h1>
        <p className="flex mr-6 justify-center items-center text-base font-normal md:text-lg text-white  lg:text-xl">
          Enter the box
        </p>
      </div>
      <CloudAndBox />
      <div>
        <div className="absolute bottom-0 right-0 z-50 flex justify-center items-center w-full h-20">
          <p className="flex justify-center items-center text-base font-normal text-white">
            Made with ❤️ by&nbsp;{" "}
            <a
              className="text-blue-400 hover:text-blue-600"
              href="https://github.com/TusharPuri10"
            >
              Tushar Puri
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
