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


export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [voices, setVoices] = useState<{ id: string; contentType: string; audio: string }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [sentence, setSentence] = useState("");

  const fetchVoices = async () => {
    api.get('/voices')
    .then((res)=> setVoices(res.data))
    .catch((err)=> console.log(err));
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  const startRecording = async () => {
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

      console.log(sentence);
 // Create a temporary audio element
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  audio.onloadedmetadata = () => {
    console.log("Duration:", audio.duration, "seconds");
  };

      api.post('/upload-voice', formData)
      .then((res)=> console.log(res.data))
      .catch((err)=> console.log(err));

      fetchVoices();
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <section className="container py-12">
      <div className="flex justify-between">

        <div className="w-60">
          {/* Select t-Shirt Size  */}
              <Select  onValueChange={(value: string) => setSentence(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Sentence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="one">Sentence One</SelectItem>
                    <SelectItem value="two">Sentence Two</SelectItem>
                    <SelectItem value="three">Sentence three</SelectItem>
                    <SelectItem value="four">Sentence Four</SelectItem>
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

      <h2 className="">Saved Voices</h2>
      {voices.map((voice) => (
        <div key={voice.id}>
          <audio
            controls
            src={`data:${voice.contentType};base64,${voice.audio}`}
          />
        </div>
      ))}
    </section>
  );
}
