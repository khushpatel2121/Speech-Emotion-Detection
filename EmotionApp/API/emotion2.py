from flask import Flask , request , jsonify
import numpy as np 
import librosa
from tensorflow.keras.models import load_model
import os 

app = Flask(__name__)

model = load_model('/Users/khushpatel/Desktop/ML Projects/Emotion Detection/EmotionApp/API/new_model.h5')

def extract_feature2(file_path, sample_rate=22050):
    audio, sr = librosa.load(file_path, sr=sample_rate)
    
    # Calculate Zero Crossing Rate
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y=audio).mean()
    
    # Calculate Chroma_stft
    chroma_stft = librosa.feature.chroma_stft(y=audio, sr=sr)
    
    # Calculate MFCC
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    
    # Calculate RMS value
    rms = librosa.feature.rms(y=audio).mean()
    
    # Calculate MelSpectrogram
    mel_spectrogram = librosa.feature.melspectrogram(y=audio, sr=sr)
    
    features = np.hstack([
        zero_crossing_rate,
        np.mean(chroma_stft, axis=1),
        np.mean(mfccs, axis=1),
        rms,
        np.mean(mel_spectrogram, axis=1)
    ])
    
    return features

@app.route('/predict',methods=['POST'])
def predict():
    audio_file = request.files['audio']
    
    temp_path = 'temp_audio.wav'
    audio_file.save(temp_path)
    
    
    feature = extract_feature2(temp_path)
    
    feature = feature.reshape(1,-1,1)
    
    predictions = model.predict(feature)
    
    
    emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad'] 
    predicted_emotion = emotion_labels[np.argmax(predictions)]
    
    os.remove(temp_path)
    
    return jsonify({'emotion':predicted_emotion})

if __name__ == '__main__':
    app.run(port=8800)
    
    