"use client";
import api from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import VoiceUi from "@/components/VoiceUi";
import Link from "next/link";


export type SentenceType = {
  id: number;
  text: string;
  count: number
};


export type UserType ={
  id: number; //
  username: string; //
  role: string; // 
  total: number; //
  accept: number; // 
  ref_code: number; //
}

export default function VoiceRecorder() {
  const [user, setUser] = useState<UserType>();
  const [userData, setUserData] = useState<UserType>();
  const [sentenceData, setSentenceData] = useState<SentenceType | null>(null)


  // const getSentence =(data: UserType)=>{
  //   // console.log("tore koira hoibo")
  //   let myData;
  //   if(getNewSentence){
  //     myData = profileData;
  //   }else{
  //     myData = data;
  //   }

  //   if(!myData) return
  //     api.get(`/sentence/${user.id}`)
  //     .then((val)=>{
  //       console.log({...user, ...myData, ...val.data}, "johfu ")
  //       setUserData({...user, ...myData, ...val.data})
  //     })
  //     .catch((err)=> console.log(err))
  //     .finally(()=> setGetNewSentence(true))
  // }

  
  // useEffect(()=>{
  //   if(!getNewSentence) return;
  //   getSentence(profileData!);
    
  // },[getNewSentence])

  useEffect(() => {
    if(!user) return;

    api.get(`/users/user-profile/${user.id}`)
    .then((res)=>{
        setUserData({...user, ...res.data});
    })
    .catch((err)=> console.log(err))



    api.get(`/sentence/${user.id}`)
    .then((res)=>{
      setSentenceData(res.data);
      if(res.data===""){
        alert("All voices might already be added, or none are available. Please try again or contact the admin.")
      }
    })
    .catch((err)=> console.log(err))
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);


  return (
   <>
     {
      user ?
         <VoiceUi userData={userData!} setSentenceData={setSentenceData} sentenceData={sentenceData!}/>
         :
         <section className="flex items-center pt-8 pb-12 dark:bg-gray-50 dark:text-gray-800">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-40 h-40 dark:text-gray-400">
                <path fill="currentColor" d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
                <rect width="176" height="32" x="168" y="320" fill="currentColor"></rect>
                <polygon fill="currentColor" points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"></polygon>
                <polygon fill="currentColor" points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"></polygon>
              </svg>
              <div>
                <p className="text-2xl mb-2">Looks like our you are not a login user.</p>
                <p className="text-sm">Please login to add a voice</p>
              </div>
              <Link href="/login">
                  <button  className="px-6 text-sm py-2 rounded bg-orange-600 text-white dark:text-gray-50">Login Now!</button>
              </Link>
            </div>
          </section>
     }
   </>
  );
}
