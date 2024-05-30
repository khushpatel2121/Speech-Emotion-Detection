import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components';
import { RecordButton, StopButton } from './Recorder';
import { keyframes ,css} from 'styled-components';
import GIF from '../assets/icons8-audio-wave.gif'
import axios from 'axios';
import audioBufferToWav from 'audiobuffer-to-wav';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const flash = keyframes`
  0% {
    opacity: 1;
    color: #ff6666; // Light red
  }
  50% {
    opacity: 0.5;
    color: #ff0000; // Medium red
  }
  100% {
    opacity: 1;
    color: #990000; // Dark red
  }
`;




const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
  background-color:white;
  color: white;
  font-size: calc(10px + 2vmin);
  background-color:#F4EFE4;
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
  
    margin-bottom: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    
    width:20vw;
  animation: ${props => props.fadeOut ? css`${fadeOut} 0.5s ease-in-out` : css`${fadeIn} 0.5s ease-in-out`};
`;

const Icon = styled.img`

`

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-between;
    gap: 20px;
    margin: 0;
    font-size: 1.5rem;
    font-family: "Reddit Mono", monospace;
    font-weight: 700;
  font-optical-sizing: auto;
  color:black;
  width: 100%;
`;

const Title2 = styled.h2`
    margin: 0;
    font-size: 1rem;
    color: #333;
    font-family: "Reddit Mono", monospace;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
`;

const Timer = styled.div`
`


const Recording = ({ onRecordingComplete, onApiResponse }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const API_URL = 'your_api_endpoint_here';

  // Function to handle recording completion
  const handleRecordingComplete = (file) => {
    setAudioFile(file);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, '0');
    const seconds = String(timeInSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    setIsRecording(true);
    setProgress(0);
    setTimer(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setProgress(0);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current);
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
        const wavBuffer = audioBufferToWav(audioBuffer);
        const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
        const audioFile = new File([wavBlob], 'recording.wav', { type: 'audio/wav' });

        try {
          const formData = new FormData();
          formData.append('audio', audioFile);

          const response = await axios.post(`http://127.0.0.1:5000/predict`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log('Predicted emotion:', response.data.emotion);
          onApiResponse(response.data.emotion);
          console.log(response)
          const audioPreviewURL = URL.createObjectURL(wavBlob);

        // Call onRecordingComplete callback with the audio preview URL and the audio file
        onRecordingComplete(audioPreviewURL, audioFile);
        } catch (error) {
          console.error('Error predicting emotion:', error);
        }
      };
    }
  };



  
  return (
    <div>
       <AppContainer>
      {!isRecording ? (
        <RecordButton onClick={startRecording} />
      ) : (
        <>
          <MessageContainer>
          <Title>
            Recording...
            <Icon src={GIF}/>
          </Title>
          <Title2>
              Start Speaking Now <br />
                <Timer>{formatTime(timer)}</Timer>
            </Title2>
          </MessageContainer>
          <StopButton onClick={stopRecording} />
        </>
      )}
    </AppContainer>
    </div>
  )
}

export default Recording
