import Bin from "@/components/Bin";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import Router from "next/router";


export default function App() {

  return (
    <div className="relative" style={{backgroundColor: "#0D1F23", height: "100vh"}}>
        <Bin/>
        
    </div>
  );
}
