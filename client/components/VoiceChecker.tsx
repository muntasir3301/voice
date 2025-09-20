import api from "@/utils/axiosConfig";
import { useState, useRef, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { MutableRefObject } from "react";

interface VoicePlayerProps {
  audioUrl: string;
  audioLength: number;
  setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
  sentence_id: number;
  audioChunks:MutableRefObject<Blob[]>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMsg:  React.Dispatch<React.SetStateAction<string>>;
}

declare global {
  interface Window {
    currentAudio?: HTMLAudioElement | null;
  }
}

const VoiceChecker = ({audioChunks, audioUrl, setAudioUrl, audioLength, sentence_id, setErrorMsg, setSuccessMsg, setGetNewSentence}: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [user, setUser] = useState<{id: number, ref_code: number}>();
  const [saveLoading, setSaveLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  
  const togglePlay = () => {
    if (!audioUrl) return;

    // Stop any other audio globally
      if (window.currentAudio && window.currentAudio !== audioRef.current) {
            window.currentAudio.pause();
            window.currentAudio.currentTime = 0;

            window.dispatchEvent(new Event("audioStopped"));
        }


    if (!audioRef.current) {
      // const audioSrc = `data:${voice?.contentType};base64,${voice?.audio}`;
      audioRef.current = new Audio(audioUrl);

      // Update progress
      audioRef.current.ontimeupdate = () => {
        if (!audioRef.current) return;
        setProgress(audioRef.current!.currentTime / audioRef?.current?.duration);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);

        if (window.currentAudio === audioRef.current) {
            window.currentAudio = null;
        }
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // stopCurrentAudio();
      audioRef.current.play();

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


  const handleSaveVoice=()=>{
    if(!user) return;
    setSaveLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", new Blob(audioChunks.current, { type: "audio/webm" }), "voice.webm");

    formData.append("user_id", (user.id).toString());
    formData.append("sentence_id", sentence_id.toString());
    formData.append("ref_code", (user.ref_code).toString());
    formData.append("length", audioLength.toString());

    api.post('/voices', formData)
    .then(()=>{
      setSuccessMsg("Voice Successfully Added");
      setGetNewSentence(true);
    })
    .catch(()=> setErrorMsg("Something worng! Reload the page and try again!"))
    .finally(()=> {setAudioUrl(null); setSaveLoading(false)});
  }


  return (
    <>
    <hr className="mt-5"/>
    
    <section className="flex gap-6 items-center justify-between mt-5">
      <div className="w-full py-2 px-4 my-2 bg-gray-100 rounded shadow flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? <FaPause/> : <FaPlay/>}
        </button>

        <div className="flex-1">
          <div className="h-2 bg-gray-300 rounded overflow-hidden mb-1">
            <div className="h-2 bg-blue-500" style={{ width: `${progress * 100}%` }}></div>
          </div>
          <div className="text-xs text-gray-700 flex justify-between">
            <span>{formatTime(progress * audioLength)}</span>
            <span>{formatTime(audioLength)}</span>
          </div>
        </div>
      </div>

        <div className="flex items-center gap-2">
            <div>
              <button onClick={handleSaveVoice} className="bg-green-600 px-4 py-1.5 text-white rounded text-[13px]">
                   {saveLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save'}
              </button>
            </div>
            <div><button onClick={() => { setAudioUrl(null);}} className="bg-red-600 px-4 py-1.5 text-white rounded text-[13px]">Cancel</button></div>
        </div>
    </section>
    </>
    
  );
};

export default VoiceChecker;