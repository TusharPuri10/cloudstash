import Bin from "@/components/Bin";
import React, { useEffect } from "react";
import NextNProgress from 'nextjs-progressbar';
import {  useRecoilState } from "recoil";
import { cardState } from "@/atoms/state";
import { useSession} from "next-auth/react";
import Signin from "@/components/Cards/Signin";

export default function App() {
  const { data: session, status } = useSession();
  const [card, setCard] = useRecoilState(cardState);

  useEffect(() => {

    //Signin Card
    if (session && session.user) {
      setCard({name: "", shown: false})
    }
    else {
      setCard({name: "signin", shown: true})
    }

    //UploadFile Card

  }, [session])
  return (
    <div className="relative z-0" style={{backgroundColor: "#0D1F23", height: "100vh"}}>
        <NextNProgress color='#FFB000'/>
        {/* Area to add files and folders */}
        <div className="-z-10 h-screen">
          
          <Bin/>
        </div>
        {/* Area to show cards */}
        {card.name === "signin" && <Signin/>}
        
    </div>
  );
}
