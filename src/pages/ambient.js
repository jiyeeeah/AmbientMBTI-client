import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Main from "./main-page";
import Footer from "../components/Footer";
import Layout from "@/components/Layout";
import Today from "@/pages/today";
import HorizonAnswerList from "@/components/HorizonAnswerList";

export default function Home() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnsweredToday, setIsAnsweredToday] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-between">
        <Layout whichPage={"ambient"}>
          <h1 className="my-2 ml-2 text-2xl font-extrabold text-left">
            주변 MBTI들의 답변을 둘러볼까요? 🧐
          </h1>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
            <HorizonAnswerList range={1} />
          </div>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-right">
            <HorizonAnswerList range={2} />
          </div>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
            <HorizonAnswerList range={3} />
          </div>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-right">
            <HorizonAnswerList range={4} />
          </div>
        </Layout>
        <Footer />
      </div>
    </>
  );
}
