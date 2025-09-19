import api from "@/utils/axiosConfig";
import { useState, useRef, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface VoicePlayerProps {
  voiceId: string;
  length: number; 
}

declare global {
  interface Window {
    currentAudio?: HTMLAudioElement | null;
  }
}

const VoicePlayer = ({voiceId, length }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voice, setVoice] = useState<{contentType: string; record: string} | undefined>();

  // useEffect(()=>{

  //   api.get(`/voices/${voiceId}`)
  //   .then((res)=> setVoice(res.data))
  // },[])


  
  // const togglePlay = () => {

    
  //   // api.get(`/voices/${voiceId}`)
  //   api.get(`/voices/2`)
  //   .then((res)=> {
  //     console.log(res.data);
  //     setVoice(res.data)
  //   })

  //   if (!voice) return;

  //   // Stop any other audio globally
  //     if (window.currentAudio && window.currentAudio !== audioRef.current) {
  //           window.currentAudio.pause();
  //           window.currentAudio.currentTime = 0;

  //           window.dispatchEvent(new Event("audioStopped"));
            
  //       }


  //   if (!audioRef.current) {
  //     const audioSrc = `data:${voice?.contentType};base64,${voice?.record}`;
  //     audioRef.current = new Audio(audioSrc);


  //     // Update progress
  //     audioRef.current.ontimeupdate = () => {
  //       setProgress(audioRef.current!.currentTime / length);
  //     };

  //     audioRef.current.onended = () => {
  //       setIsPlaying(false);
  //       setProgress(0);

  //       if (window.currentAudio === audioRef.current) {
  //           window.currentAudio = null;
  //       }
  //     };
  //   }

  //   if (isPlaying) {
  //     audioRef.current.pause();
  //   } else {
  //   //   stopCurrentAudio();
  //     audioRef.current.play();

  //     window.currentAudio = audioRef.current; 
  //   }
  //   setIsPlaying(!isPlaying);
  // };


  const togglePlay = async () => {
  if (!audioRef.current) {
    try {
      const res = await api.get(`/voices/${voiceId}`);
      const voiceData = res.data;
      setVoice(voiceData);

      const audioSrc = `data:${voiceData.contentType};base64,${voiceData.record}`;
      audioRef.current = new Audio(audioSrc);

      audioRef.current.ontimeupdate = () => {
        setProgress(audioRef.current!.currentTime / length);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        if (window.currentAudio === audioRef.current) {
          window.currentAudio = null;
        }
      };
    } catch (err) {
      console.error(err);
      return;
    }
  }

  // Stop any other audio globally
  if (window.currentAudio && window.currentAudio !== audioRef.current) {
    window.currentAudio.pause();
    window.currentAudio.currentTime = 0;
    window.dispatchEvent(new Event("audioStopped"));
  }

  if (isPlaying) {
    audioRef.current?.pause();
  } else {
    audioRef.current?.play();
    window.currentAudio = audioRef.current;
  }

  setIsPlaying(!isPlaying);
};



  // Convert seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };


  useEffect(() => {
  const handleAudioStopped = () => {
    if (audioRef.current && audioRef.current !== window.currentAudio) {
      setIsPlaying(false);
      setProgress(0);
    }
  };
  window.addEventListener("audioStopped", handleAudioStopped);
  return () => window.removeEventListener("audioStopped", handleAudioStopped);
}, []);


  return (
   <div className="flex gap-10">
     <div className="w-full py-2 px-4 my-2 bg-gray-100 rounded shadow flex items-center gap-4">
      <div className="flex-1">
        <div className="h-2 bg-gray-300 rounded overflow-hidden mb-1">
          <div
            className="h-2 bg-blue-500"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-700 flex justify-between">
          <span>{formatTime(progress * length)}</span>
          <span>{formatTime(length)}</span>
        </div>
      </div>

      <button
        onClick={togglePlay}
        className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? <FaPause/> : <FaPlay/>}
      </button>
    </div>

    <div className="flex items-center gap-2">
        <div><button onClick={()=> console.log("hi")} className="bg-green-600 px-4 py-1.5 text-white rounded text-[13px]">Accept</button></div>
        <div><button onClick={() =>console.log("hi")} className="bg-red-600 px-4 py-1.5 text-white rounded text-[13px]">Reject</button></div>
    </div>
   </div>


  );
};

export default VoicePlayer;
