"use client";
import { useState, useRef, useEffect } from "react";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [voices, setVoices] = useState<{ id: string; contentType: string; audio: string }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const fetchVoices = async () => {
    // const res = await fetch("http://localhost:5000/voices");
    const res = await fetch("https://server-mu-ochre-55.vercel.app/voices");
    const data = await res.json();
    setVoices(data);
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

      // await fetch("http://localhost:5000/upload-voice", {
      await fetch("https://server-mu-ochre-55.vercel.app/upload-voice", {
        method: "POST",
        body: formData,
      });

      fetchVoices(); // refresh list after upload
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <div className="py-12">
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
    </div>
  );
}
