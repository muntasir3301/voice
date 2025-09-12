"use client";
import api from "@/utils/axiosConfig";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import VoicePlayer from "@/components/VoicePlayer";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type VoiceDataType ={
  name: string; userId: string; voiceId: string; length: number;
  sentence: string;
}

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [voiceData, setVoiceData] = useState<VoiceDataType[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [user, setUser] = useState<{id: string; name: string}>();
  const [sentence, setSentence] = useState("");
  const [allSentence, setAllSentence] = useState<{text: string}[]>([]);


  useEffect(() => {
    api.get('/voice-data')
    .then((res)=> setVoiceData(res.data))
    .catch((err)=> console.log(err));


    api.get('/sentence')
    .then((res)=> setAllSentence(res.data))
    .catch((err)=> console.log(err));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const startRecording = async () => {

    if(!user){
      alert("Login to store a voice");
      return;
    }

    if(!sentence){
      alert("Choice a sentence");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      audioChunks.current = [];

      const formData = new FormData();
      formData.append("voice", audioBlob, "recording.webm");

      // Create a temporary audio element
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onloadedmetadata = () => {
          formData.append("length", audio.duration.toString());
          formData.append("userId", user.id);
          formData.append("sentence", sentence);

          api.post('/upload-voice', formData)
          .then((res)=> console.log(res.data))
          .catch((err)=> console.log(err))
          // .finally(()=>  fetchVoices() )

        };
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // const fetchVoice = (id)=>{
  //   console.log(id);
  // }




  return (
    <section className="container py-12">
      <div className="flex justify-between">

        <div className="w-60">
          {/* Select Sentence  */}
              <Select  onValueChange={(value: string) => setSentence(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Sentence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      allSentence?.map((ele, i)=> 
                        <SelectItem key={i+245} value={ele.text}>{ele.text}</SelectItem>
                      )
                    }
                  </SelectGroup>
                  </SelectContent>
              </Select>
        </div>



        {recording ? (
        <button onClick={stopRecording}>Stop</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
      </div>

<br /><br />


    <Table>
      <TableHeader className="bg-gray-200">
        <TableRow>
          <TableHead className="w-[10%]">NO.</TableHead>
          <TableHead className="w-[15%]">Name</TableHead>
          <TableHead className="w-[15%]">Author</TableHead>
          <TableHead className="w-[30%]">Sentence</TableHead>
          <TableHead className="w-[30%]">Listen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {voiceData.map((data, i) => (
        <TableRow key={data.userId}>
          <TableCell>{i+1}</TableCell>
          <TableCell>{user?.name}</TableCell>
          <TableCell>Muntasir</TableCell>
          <TableCell>{data.sentence}</TableCell>
          <TableCell className="text-center">
            {/* Voice Player  */}
            <VoicePlayer voiceId={data.voiceId} length={data.length}/>
          </TableCell>
        </TableRow>
      ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

    </section>
  );
}
