import api from "@/lib/api/api";
import { IWorkspace } from "@/lib/hooks/useAuth";
import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";

let mediaRecorder: MediaRecorder;
let chunks: Blob[] = [];

// Options for getDisplayMedia()
const displayMediaOptions = {
  video: {
    displaySurface: "window",
  },
  audio: false,
};

export interface MicButtonProps {
  workspace: IWorkspace;
}

export function MicButton({ workspace }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const Icon = isRecording ? Mic : MicOff;

  async function startRecording() {
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async function () {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        chunks = [];

        // Post the audio file to the server
        console.log("Uploading audio file to the server...");
        const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
        const formData = new FormData();
        formData.append("audio", file);
        const resUpload = await api.post("/audios", formData);
        console.log("Audio file uploaded to the server:", resUpload);

        // Transcribe the audio file
        console.log("Transcribing audio file...");
        const filename: string = resUpload.data.filename;
        console.log("Filename:", filename);
        const resTranscribe = await api.post("/ai/transcription", {
          filename,
        });
        console.log("Transcription:", resTranscribe);
        const transcript: string = resTranscribe.data.transcript;

        // Take a screenshot
        console.log("Taking screenshot...");
        const screenshotFilename = await takeScreenshot();
        console.log("Screenshot taken:", screenshotFilename);
        if (!screenshotFilename) {
          console.error("Could not take screenshot");
          return;
        }

        // Generate completion
        console.log("Generating completion...");
        const resCompletion = await api.post("/ai/ask-question", {
          prompt: transcript,
          filename: screenshotFilename,
          homeworkId: "clwcboqiw0000gf3guoiaowr1",
        });
        const completion = resCompletion.data.answer;
        console.log("Completion:", resCompletion);

        // Generate the speech
        console.log("Generating speech...");
        api
          .post(
            "/ai/speech",
            {
              text: completion,
            },
            { responseType: "arraybuffer" }
          )
          .then((response) => {
            const blob = new Blob([response.data], { type: "audio/mpeg" });
            const audioURL = URL.createObjectURL(blob);

            const audio = new Audio(audioURL);
            audio.play();
            console.log("Speech generated!");
          })
          .catch((error) => {
            console.error("Error fetching audio:", error);
          });

        setIsRecording(false);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      setIsRecording(false);
    }
  }

  function stopRecording() {
    setIsRecording(false);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }

  async function startCapture() {
    const videoElem = document.getElementById("video") as HTMLVideoElement;
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
    } catch (err) {
      console.error(err);
    }
  }

  function stopCapture() {
    const videoElem = document.getElementById("video") as HTMLVideoElement;
    if (videoElem.srcObject) {
      const tracks = (videoElem.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoElem.srcObject = null;
    }
  }

  async function takeScreenshot(): Promise<string | null> {
    const videoElem = document.getElementById("video") as HTMLVideoElement;
    const canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2d context");
      return null;
    }
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    const filename = await new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Could not create blob from canvas");
          reject("Could not create blob from canvas");
          return;
        }
        const file = new File([blob], "screenshot.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("screenshot", file);
        try {
          const resUpload = await api.post("/screenshots", formData);
          resolve(resUpload.data.filename);
        } catch (error) {
          reject(error);
        }
      }, "image/png");
    });

    return filename as string;
  }

  useEffect(() => {
    startCapture();

    return () => {
      stopCapture();
    };
  }, []);

  return (
    <button
      className="flex items-center justify-center w-fit h-12 p-4 gap-2 rounded-full bg-primary"
      onClick={handleMicClick}
    >
      <Icon size={24} className="text-white" />
      <div className="flex flex-col items-start justify-center">
        <p className="text-white text-lg font-semibold">
          {isRecording ? "Click to stop" : "Click to start"}
        </p>
        <p className="text-white text-sm">
          {isRecording ? "Recording" : "Not recording"}
        </p>
      </div>
      <video id="video" autoPlay style={{ display: "none" }} />
    </button>
  );
}
