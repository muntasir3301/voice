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

type VoiceDataType ={
  id: number;
  name: string;
  user_id: number;
  voice_id: number;
  sentence_id: number;
  length: number;
  user: {username: string};
  sentence: {text: string}
}

export default function VoiceRecorder() {
  const [voiceData, setVoiceData] = useState<VoiceDataType[]>([]);
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    if(!user) return;

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


  const handleAcceptVoice=(id: number)=>{
    if(!user) return;

    api.post('/voice-data/accept', {id, user_id: user.id, ref_code: user.ref_code})
    .then((res)=> {
      setVoiceData(res.data);
    })
    .catch((err)=> console.log(err))
  }

  const handleRejectVoice=(id: number, voice_id: number)=>{
    api.post('/voice-data/reject', {id, voice_id})
    .then((res)=> {
      console.log(res.data); 
      setVoiceData(res.data);
    })
    .catch((err)=> console.log(err))
  }


  return (
   <>
    <section className="container pt-12 pb-16">
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

            <div className="flex gap-10">
                <VoicePlayer id={data.id} voice_id={data.voice_id} length={data.length}/>

                <div className="flex items-center gap-2">
                  <div><button onClick={()=> handleAcceptVoice(data.id)} className="bg-green-600 px-4 py-1.5 text-white rounded text-[13px]">Accept</button></div>
                  <div><button onClick={()=> handleRejectVoice(data.id, data.voice_id)} className="bg-red-600 px-4 py-1.5 text-white rounded text-[13px]">Reject</button></div>
                </div>
            </div>

            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
     </section>
   </>
  );
}
