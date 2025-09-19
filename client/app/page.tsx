"use client";
import api from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceUi from "@/components/VoiceUi";

export type UserType ={
  id: number;
  sentence_id: number;
  username: string;
  role: string;
  count: number;
  accept: number;
  ref_code: number;
  text: string;
}

type VoiceDataType ={
  name: string;
  user_id: string;
  voice_id: string;
  sentence_id: string;
  length: number;
  user: {username: string};
  sentence: {text: string}
}

export default function VoiceRecorder() {
  const [voiceData, setVoiceData] = useState<VoiceDataType[]>([]);
  const [user, setUser] = useState<UserType>();
  const [userData, setUserData] = useState<UserType>();

  useEffect(() => {
    if(!user) return;

    api.get(`/users/user-profile/${user.id}`)
    .then((res)=>{
      api.get(`/sentence/${res.data.sentence_id}`)
      .then((val)=>{
        setUserData({...user, ...res.data, ...val.data})
        console.log({...user, ...res.data, ...val.data}, "my johfu")

      })
      .catch((err)=> console.log(err))
    })
    .catch((err)=> console.log(err))

    console.log(user)

    api.get(`/voice-data/${user.ref_code}`)
    .then((res)=>{
      setVoiceData(res.data);

    })
    .catch((err)=> console.log(err));

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
    <Header/>
  

    <VoiceUi userData={userData!}/>

      
    <section className="container py-12 min-h-[55vh]">
      <h2 className="text-2xl border-l-[3px] pl-3 mb-4 border-primary">Review a voice</h2>
      {/* Statics  base on the user role */}
      <Table className="border">
        <TableHeader className="bg-gray-300 text-black">
          <TableRow>
            <TableHead className="w-[2%] text-center">S.no</TableHead>
            <TableHead className="w-[8%]">Username</TableHead>
            <TableHead className="w-[20%]">Sentence</TableHead>
            <TableHead className="w-[30%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {voiceData?.map((data, i) => (
          <TableRow key={i+48512} className={`${i%2==1 && "bg-gray-100"}`}>
            <TableCell className="text-center">{data.sentence_id}</TableCell>
            {/* <TableCell>{data.sentence}</TableCell> */}
            <TableCell>{data.user.username}</TableCell>
            <TableCell>{data.sentence.text}</TableCell>
            <TableCell className="text-center">
              {/* Voice Player  */}
              <VoicePlayer voiceId={data.voice_id} length={data.length}/>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
     </section>

     <Footer/>
   </>
  );
}
