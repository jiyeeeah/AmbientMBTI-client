import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import { format } from "date-fns";
import UserCalendar from "@/components/UserCalendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase/index.js";
import { useRouter } from 'next/router';
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

const userCollection = collection(db, "users");

const AnotherUser = ({ userId }) => {
  const { data } = useSession();
  // const [user, setUser] = useState(null);
  const [anotherUserId, setanotherUserId] = useState();
  const [anotherUser, setAnotherUser] = useState();

  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  //팔로잉
  const [ following, setFollowing ] = useState();

  const getAnotherUser = async (id) => {
      const userRef = doc(userCollection, id);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      setAnotherUser(userData);
      setanotherUserId(userRef.id);
      setFollowing(Boolean(
        anotherUser.followerId &&
        anotherUser.followerId.find((i) => i === userId)
      ));
  };
    

  useEffect(() => {
    getAnotherUser();
  }, [userId]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  // 팔로잉 구현
  // useEffect(() => {
  // }, [anotherUser]);

  const handleFollowing = () => {
    updateFollowing();
    updateFollower();
  };
  
  const updateFollowing = async () => {
    const userRef = doc(userCollection, data.user.id);
    const profiledUserRef = doc(userCollection, profiledUserId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    if (!following){
      const updatedFollowingId = userData.followingId.filter(
        (id) => id !== profiledUserId
      );
      await setDoc(userRef, { followingId: updatedFollowingId});
      setFollowing(!following);
    }else {
      const updatedFollowingId = [...userData.followingId || [], profiledUserRef.id];
      await setDoc(userRef, { followingId: updatedFollowingId });
      setFollowing(!following);
      
    }
  };

  const updateFollower = async () => {
    const userRef = doc(userCollection, data.user.id);
    const profiledUserRef = doc(userCollection, profiledUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

    if(!following) {
      const updatedFollwerID = profiledUserData.followerId.filter(
        (id) => id !== data.user.id
      );
      await setDoc(profiledUserRef, { followerId: updatedFollwerID});
    }else {
      const updatedFollwerID = [...profiledUserData.followerId || [], userRef.id];
      await setDoc(profiledUserRef, { followerId: updatedFollwerID });
      
    }      
    setFollowerNum(profiledUserData.followerId.length);

  };


  return (
    <>
      <Layout>
        <div className="flex flex-row h-full">
          <div className="w-full h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-4xl font-bold text-primary p-3">
              's page
            </h1>
            <div className="relative">
              <UserProfile profiledUserId={userId} />
              <div className="m-0 absolute bottom-2 right-2">
                {following ? (
                  <button onClick={handleFollowing} className="bg-neutral-100 m-0 p-1 rounded-xl">
                    <p className="font-semibold">팔로잉 취소</p>
                  </button>
                ) : (
                  <button onClick={handleFollowing} className="bg-neutral-100 m-0 p-1 rounded-xl">
                    <p className="font-semibold">팔로우</p>
                  </button>
                )}
              </div>
            </div>
          </div>
          <UserCalendar handleDatePopup={handleDatePopup} bgColor={bgColor}/>
        </div>
      </Layout>
    </>
  );
};

export default AnotherUser;