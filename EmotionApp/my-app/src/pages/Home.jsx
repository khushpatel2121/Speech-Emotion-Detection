import React,{useState,useEffect} from "react";
import styled from "styled-components";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Recording from "../components/Recording";


const Container = styled.div`
  display: flex;
`;

const Left = styled.div`
  flex: 1;
  height: 100vh;
  width: 50vw;
  background-color: #ffff80;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px;
`;

const Title = styled.h1`
  color: #00215e;
  font-family: "Reddit Mono", monospace;
  font-weight: 700;
  font-optical-sizing: auto;
  font-size: 2rem;
  background-color: transparent;
`;

const Description = styled.p`
color: #00215e;
  font-family: "Reddit Mono", monospace;
`;

const Arrow = styled.div`
margin-top: 20px;
display: flex;
align-items: center;
gap: 20px;

`;

const Icon = styled.div`
    color: #00215e;
    font-size: 40px;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.5);
    }

`;

const Right = styled.div`
  flex: 1;
    height: 100vh;  
    width: 50vw;
   
`;

const Top = styled.div`
width: 100%;
height: 50vh;
background-color:#F4EFE4;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
user-select: none;

`;

const Small = styled.div`
    font-size: 0.8rem;
    color: #333;
    font-family: "Reddit Mono", monospace;
    font-weight: 400;
    background-color: transparent;
`;



const Bottom = styled.div`
 background-color: #00215e;
 width: 100%;
height: 50vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content:start;
gap: 20px;
padding: 30px;
`;

const Result = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 20px;
`;


const Title2 = styled.h2`
    margin: 0;
    font-size: 1.5rem;
    color:#ffff80;
    font-family: "Reddit Mono", monospace;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
`;

const Emotion = styled.div`
color:white;
  font-family: "Reddit Mono", monospace;
    font-size: 2rem;   
`

const Description2 = styled.p`
color:white;
  font-family: "Reddit Mono", monospace;
    font-size: 1rem;    
    width: 70%;
`;

const Details = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

`;



const Home = () => {

  const [audioUrl, setAudioUrl] = useState(null);
  const [emotionDetected, setEmotionDetected] = useState("Waiting...");


  useEffect(() => {
    // Cleanup the previous audio URL when the component unmounts
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleRecordingComplete = (url) => {
    // Set the audio URL when recording is complete
    setAudioUrl(url);
  };

  


  const handleApiResponse = (emotion) => {
    setEmotionDetected(emotion);
  };


  return (
    <>
      <Container>
        <Left>
          <Title>Emotion Detection WebApp</Title>
          <Description>
            The WebApp is a speech emotion detection web application that
            utilizes advanced machine learning models to analyze and interpret
            emotions conveyed through speech. The model behind the WebApp has
            been carefully trained on the TESS dataset, a collection of
            professionally recorded speech samples from the University of
            Toronto, covering a wide spectrum of emotions.
          </Description>
          <Description>
            The WebApp model employs deep learning techniques and neural
            network architectures to capture subtle patterns and features within
            speech data. Trained on the TESS dataset, comprising high-quality
            recordings of actors depicting various emotions such as happiness,
            sadness, anger, fear, disgust, and surprise, the model has been
            refined to accurately recognize and classify these emotional cues
            with high precision.
          </Description>
          <Arrow>
          <Description>Get Started:Press Record and know how you feel</Description>
          <Icon>
            
            <ArrowOutwardIcon />
          </Icon>
          </Arrow>
        </Left>
        <Right>
          <Top>
         <Title>Press Record</Title>
            <Small>A Small clip is prefered</Small>
            <Recording onRecordingComplete={handleRecordingComplete} onApiResponse={handleApiResponse} />
          </Top>
          <Bottom>
          <Details>
            <Title2>Results</Title2>
            
          </Details>
            <Result>
                <Title2>Emotion Detected:</Title2>
                <Emotion>{emotionDetected}.</Emotion>
                {audioUrl && (
              <audio controls>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
            </Result>
          </Bottom>
        </Right>
      </Container>
    </>
  );
};

export default Home;
