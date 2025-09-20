"use client";
import { useRef, useState } from "react";
import { MdKeyboardVoice, MdSend } from "react-icons/md";
import { UserType } from "@/app/page";
import VoiceChecker from "./VoiceChecker";
import { Skeleton } from "./ui/skeleton";


export default function VoiceUi({userData, setGetNewSentence}: {userData: UserType}) {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [audioLength, setAudioLength] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationId = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startTime = useRef<number>(0);


// const [voice, setVoice] = useState<Blob | null>(null);
const [audioUrl, setAudioUrl] = useState<string | null>(null);
const audioChunks = useRef<Blob[]>([]);

  // Format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const drawBars = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 6;
      const barGap = 4;
      const barCount = Math.floor(canvas.width / (barWidth + barGap));

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] / 2;
        const x = i * (barWidth + barGap);
        const y = canvas.height - value;

        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(x, y, barWidth, value);
      }

      animationId.current = requestAnimationFrame(render);
    };

    render();
  };


let audioBlob;

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyserRef.current = analyser;
  source.connect(analyser);

  mediaRecorderRef.current = new MediaRecorder(stream);
  audioChunks.current = []; // reset
  mediaRecorderRef.current.start();

  setRecording(true);
  setTime(0);
  startTime.current = Date.now();

  const timer = setInterval(() => {
    setTime((Date.now() - startTime.current) / 1000);
  }, 1000);

  drawBars();

  // collect chunks
  mediaRecorderRef.current.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.current.push(event.data);
    }
  };

  // when stop is called
  mediaRecorderRef.current.onstop = () => {
    clearInterval(timer);
    cancelAnimationFrame(animationId.current!);

    audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    // setVoice(audioBlob);
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url); // preview url

    // Get length immediately
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
        setAudioLength(tempAudio.duration); // new state for length
    };
  };
};



  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto p-6 bg-white/70 rounded-xl shadow-lg border">
        <div className=" mb-4 py-2">
          {
            userData ? 
            <h2 className="text-2xl">{userData?.text}</h2>
            :
            <Skeleton className="h-[35px] w-[400px] rounded" />
          }
        </div>
            <div className="flex justify-center">
              <div>
                <div className="w-full h-28 bg-gray-100 rounded-md border border-dashed border-gray-200 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={100}
                    className="w-full h-full"
                    />
                </div>
                {/* Body */}
                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 w-16">{formatTime(time)}</span>
                        <span className="text-sm font-medium text-gray-700">
                        {recording && "🎙️ Recording..."}
                        </span>
                    </div>

                    <div className="flex justify-center">
                        {recording ? (
                            <button className="flex gap-1 items-center border py-2 px-4 text-sm bg-gray-800 text-white rounded" onClick={stopRecording}>
                                <MdSend className="text-xl"/>
                                <div>Stop Recoding</div>
                            </button>
                            ) : (
                            <button className={`flex gap-1 items-center border py-2 px-4 text-sm bg-blue-600 text-white rounded ${audioUrl ? "cursor-not-allowed bg-red-400" : ""}`} disabled={!!audioUrl}  onClick={startRecording}>
                                <MdKeyboardVoice className="text-xl"/>
                                <div>Start Recoding</div>
                            </button>
                        )}
                    </div>
                </div>
                {/* Lister Record */}
                {
                    audioUrl && <VoiceChecker audioChunks={audioChunks} setAudioUrl={setAudioUrl} audioUrl={audioUrl} audioLength={audioLength} sentence_id={userData?.id} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg} setGetNewSentence={setGetNewSentence} />
                }
                <hr className="my-5"/>
                <div className="flex justify-between items-center">
                    {
                      userData ? 
                        <p className="capitalize">Hi {userData?.username} 👋</p>
                      :
                         <Skeleton className="h-[20px] w-[100px] rounded" />
                    }
                    <div>
                      {errorMsg && <h2 className=" text-red-500">Someting Error! Reload & try again!</h2>}
                      {successMsg && <h2 className="text- text-green-500">Successfully Added</h2>}
                    </div>
                  <div className="flex text-xs gap-4 items-center">
                    {
                      userData ? 
                        <>
                          <p>Total: {userData?.total}</p>
                          <p>Accept: {userData?.accept}</p>
                        </>
                        :
                        <Skeleton className="h-[20px] w-[120px] rounded" />
                      }
                  </div>
                </div>
            </div>
            </div>
        </div>
    </section>
  );
}
