"use client";
import api from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import VoiceUi from "@/components/VoiceUi";

export type UserType ={
  id: number;
  sentence_id: number;
  username: string;
  role: string;
  total: number;
  accept: number;
  ref_code: number;
  text: string;
}

export default function VoiceRecorder() {
  const [user, setUser] = useState<UserType>();
  const [userData, setUserData] = useState<UserType>();

  useEffect(() => {
    if(!user) return;

    api.get(`/users/user-profile/${user.id}`)
    .then((res)=>{
      api.get(`/sentence/${res.data.sentence_id}`)
      .then((val)=>{
        setUserData({...user, ...res.data, ...val.data})
        // console.log({...user, ...res.data, ...val.data}, "my johfu")
      })
      .catch((err)=> console.log(err))
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
      <VoiceUi userData={userData!}/>
   </>
  );
}
