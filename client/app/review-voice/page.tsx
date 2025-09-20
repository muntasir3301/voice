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
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!user) return;

    api.get(`/voice-data/${user.ref_code}`)
    .then((res)=>{
      setVoiceData(res.data);
    })
    .catch((err)=> console.log(err))
    .finally(()=> setLoading(false))

  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);


  const handleAcceptVoice=(id: number, sentence_id: number)=>{
    if(!user) return;

    api.post('/voice-data/accept', {id, user_id: user.id, ref_code: user.ref_code, sentence_id})
    .then((res)=> {
      setVoiceData(res.data);
    })
    .catch((err)=> console.log(err))
  }

  const handleRejectVoice=(id: number, voice_id: number, sentence_id: number, user_id: number)=>{
    api.post('/voice-data/reject', {id, voice_id, sentence_id, user_id})
    .then((res)=> {
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
        <TableHeader className="bg-primary/40">
          <TableRow>
            <TableHead className="w-[2%] text-center text-black">S.no</TableHead>
            <TableHead className="w-[8%] text-black">Username</TableHead>
            <TableHead className="w-[20%] text-black">Sentence</TableHead>
            <TableHead className="w-[30%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

        {
          loading ? 
            Array.from({ length: 10 }).map((ele, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="w-full h-6 my-1"/>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-6"/>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-6"/>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-6"/>
                    </TableCell>
                  </TableRow>
              ))
              :
            voiceData.length > 0 ? voiceData.map((data, i) => (
              <TableRow key={i+48512} className={`${i%2==1 && "bg-primary/10"}`}>
              <TableCell className="text-center">{data.sentence_id}</TableCell>
              <TableCell>{data.user.username}</TableCell>
              <TableCell>{data.sentence.text}</TableCell>
              <TableCell className="text-center">

                {/* Voice Player  */}
                <div className="flex gap-10">
                  <VoicePlayer id={data.id} voice_id={data.voice_id} length={data.length}/>
                    <div className="flex items-center gap-2">
                      <div><button onClick={()=> handleAcceptVoice(data.id, data.sentence_id)} className="bg-green-600 px-4 py-1.5 text-white rounded text-[13px]">Accept</button></div>
                      <div><button onClick={()=> handleRejectVoice(data.id, data.voice_id, data.sentence_id, data.user_id)} className="bg-red-600 px-4 py-1.5 text-white rounded text-[13px]">Reject</button></div>
                    </div>
                </div>

                </TableCell>
              </TableRow>
            ))
            :
           <h2 className="text-xl w-60 pl-5 py-6">No voice found</h2>
        }
        </TableBody>
      </Table>
     </section>
   </>
  );
}
