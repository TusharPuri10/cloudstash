import { useRecoilState } from "recoil";
import { cardState } from "@/atoms/state";

const CreateFolderCard = () => {
  const [card, setCard] = useRecoilState(cardState);
  return (
    <div className="absolute inset-0 z-50 mx-auto w-1/4 h-1/4 mt-24 rounded-xl flex flex-col items-center" style={{backgroundColor: "#2D4A53"}}>
      <label className="block mt-6 mb-4 mr-32 text-xl font-medium text-gray-900 dark:text-white">New Folder</label>
      <input className="bg-gray-50 border border-white text text-gray-900 text rounded-lg w-60 p-2.5 dark:bg-gray-700 dark:text-white " placeholder="untitled_folder" required></input>
      <div className="ml-24">
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 border border-green-900 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          // TODO: add logic to create folder here
          setCard({ name: "", shown: false });
        }}
      >
        create
      </button>
      <button
        className="inline text-white bg-stone-500 hover:bg-neutral-500 border border-green-900 rounded-2xl py-1 px-3 my-4 mx-2"
        onClick={() => {
          setCard({ name: "", shown: false });
        }}
      >
        cancel
      </button>
      </div>
    </div>
  );
};

export default CreateFolderCard;
