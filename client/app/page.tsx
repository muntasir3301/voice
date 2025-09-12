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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MdKeyboardVoice, MdSend } from "react-icons/md";


type VoiceDataType ={
  name: string;
  userId: string;
  voiceId: string;
  sentenceId: string;
  length: number;
  sentence: string;
}

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [voiceData, setVoiceData] = useState<VoiceDataType[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [user, setUser] = useState<{id: string; name: string}>();
  const [selectSentence, setSelectSentence] = useState("");
  const [currentSentence, setCurrentSentence] = useState<{text: string, _id: string}[]>([]);


  useEffect(() => {
    api.get('/voice-data')
    .then((voice)=>{
      api.get('/sentence')
      .then((res)=>{
          const restOfTheSentence = res.data.filter(
              (ele: {_id: string}) => !voice.data.find((item: {sentenceId: string}) => item.sentenceId === ele._id)
            );
            setCurrentSentence(restOfTheSentence)
          })
          .catch((err)=> console.log(err)); 

          setVoiceData(voice.data)
      })
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

    if(!selectSentence){
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
        const {_id, text:sentence }  = JSON.parse(selectSentence);
        
        audio.onloadedmetadata = () => {
          formData.append("length", audio.duration.toString());
          formData.append("userId", user.id);
          formData.append("sentence", sentence);
          formData.append("sentenceId", _id);

         


          api.post('/upload-voice', formData)
          .then((res)=>{
             const newVoice = {
                name: user.name,
                userId: user.id,
                voiceId: res.data._id,
                sentenceId: _id,
                length: audio.duration,
                sentence
              }
            setVoiceData([...voiceData, newVoice]);
            const newSentence = currentSentence.filter((ele: {_id: string})=> ele._id !== _id)
            setCurrentSentence(newSentence);
          })
          .catch((err)=> console.log(err))
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


  if(!user){
    return <h2 className="py-20 container text-red-500">Login To Add a Voice ....</h2>
  }


  return (
   <>

     <section className="container py-12">
      <div className="flex justify-between items-center">
        <div className="w-60">
          {/* Select Sentence  */}
              <Select  onValueChange={(value: string) => setSelectSentence(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Sentence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      currentSentence?.map((ele, i)=> 
                        <SelectItem key={i+245} value={JSON.stringify(ele)}>{ele.text}</SelectItem>
                      )
                    }
                  </SelectGroup>
                  </SelectContent>
              </Select>
        </div>

        <div>
          {recording ? (
            <button className="flex gap-1 items-center border py-2 px-4 text-sm bg-blue-400 text-white rounded" onClick={stopRecording}>
              <MdSend className="text-xl"/>
              <div>Stop Record</div>
            </button>
          ) : (
            <button className="flex gap-1 items-center border py-2 px-4 text-sm bg-blue-500 text-white rounded" onClick={startRecording}>
              <MdKeyboardVoice className="text-xl"/>
              <div>Start Record</div>
            </button>
          )}
        </div>
      </div>

      <br />

      <Table className="border">
        <TableHeader className="bg-gray-300 text-black">
          <TableRow>
            <TableHead className="w-[5%] text-center">NO.</TableHead>
            <TableHead className="w-[15%]">Name</TableHead>
            <TableHead className="w-[15%]">Author</TableHead>
            <TableHead className="w-[35%]">Sentence</TableHead>
            <TableHead className="w-[30%]">Listen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {voiceData.map((data, i) => (
          <TableRow key={i+48512} className={`${i%2==1 && "bg-gray-100"}`}>
            <TableCell className="text-center">{i+1}</TableCell>
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
      </Table>

     </section>


   </>
  );
}
