import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import MbtiSelector from "../components/mbtiSelector";
import Footer from "../components/Footer";
import AnswerList from "@/components/AnswerList";
import TempAnswerList from "@/components/tempAnswerList";

export default function Compare() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [firstMbti, setFirstMbti] = useState("");
  const [secondMbti, setSecondMbti] = useState("");
  const questionCollection = collection(db, "questions");
  const [question, setQuestion] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const formattedDate = new Date(currentDate.getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
          setFirstMbti(userDoc.data().mbti);
          setSecondMbti(userDoc.data().interestedMbti);
        }
      }
    }

    fetchUser();
  }, [session]);

  const getQuestion = async () => {
    const q = query(questionCollection, where("date", "==", formattedDate));
    const results = await getDocs(q);

    setQuestion(results.docs[0].data());
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const goPrevious = async () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);

    setCurrentDate(previousDate);
  };

  const goNext = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setCurrentDate(nextDate);
  };

  useEffect(() => {
    getQuestion();
  }, [currentDate]);

  return (
    <>
      <Layout whichPage={"compare"}>
        {isLoggedIn ? (
          <>
            <div className="flex flex-col">
              <div className="flex flex-col items-center p-5 border ">
                <div className="flex flex-row items-center justify-center w-full">
                  {currentDate.toISOString().split("T")[0] == "2023-06-01" ? (
                    <div className="p-0 m-0 mr-6"></div>
                  ) : (
                    <button className="p-0 m-0 mr-2" onClick={goPrevious}>
                      ◀
                    </button>
                  )}

                  <div className="text-sm text-center text-gray-600 whitespace-normal">
                    {question.date}
                  </div>
                  {currentDate.toISOString().split("T")[0] ==
                  new Date().toISOString().split("T")[0] ? (
                    <div className="p-0 m-0 ml-6"> </div>
                  ) : (
                    <>
                      <button className="p-0 m-0 ml-2" onClick={goNext}>
                        ▶
                      </button>
                    </>
                  )}
                </div>
                <div className="text-2xl font-bold">" {question.content} "</div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col items-center w-full p-2 border border-3 basis-1/2">
                  <div className="flex flex-col items-center justify-center w-3/4 mx-3">
                    <div className="flex items-center">
                      <img src={`/images/MBTIcharacters/${firstMbti}.png`} className="w-8" />
                      <div className="mb-2 text-xl font-bold">{firstMbti}</div>

                      <img src={`/images/MBTIcharacters/${firstMbti}.png`} className="w-8" />
                    </div>
                    <MbtiSelector defaultMbti={firstMbti} setDefaultMbti={setFirstMbti} />
                  </div>

                  <div className="w-full">
                    <AnswerList mbti={firstMbti} date={formattedDate} />
                  </div>
                </div>
                <div className="flex flex-col items-center w-full p-2 border border-3 basis-1/2">
                  <div className="flex flex-col items-center justify-center w-3/4 mx-3">
                    <div className="flex items-center">
                      <img src={`/images/MBTIcharacters/${secondMbti}.png`} className="w-8" />
                      <div className="mb-2 text-xl font-bold">{secondMbti}</div>

                      <img src={`/images/MBTIcharacters/${secondMbti}.png`} className="w-8" />
                    </div>
                    <MbtiSelector defaultMbti={secondMbti} setDefaultMbti={setSecondMbti} />
                  </div>
                  <div className="w-full">
                    <AnswerList mbti={secondMbti} date={formattedDate} />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-full mb-10">
              <img
                src="/images/Ambers.png"
                alt="로그인 전 이미지"
                style={{
                  maxWidth: "30%",
                  height: "auto",
                  maxHeight: "auto",
                  display: "block",
                  transform: "translateY(10%)",
                }}
              />
              <div
                className="w-full mt-5 text-center basis-1/2 "
                style={{
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#",
                  whiteSpace: "nowrap",
                }}
              >
                로그인 해주세요!
              </div>
              <div
                className="w-full mt-1 mb-1 text-center basis-1/2 textAlign:'center'"
                style={{
                  marginLeft: "-17%",
                  display: "block",
                  fontWeight: "regular",
                  marginRight: "-17%",
                  fontSize: "14px",
                  color: "#6D6E71",
                  whiteSpace: "nowrap",
                }}
              >
                로그인하여 당신의 이야기를 들려주세요!
              </div>
            </div>
          </>
        )}
      </Layout>
      <Footer />
    </>
  );
}
