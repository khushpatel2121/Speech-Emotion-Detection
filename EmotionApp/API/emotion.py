from flask import Flask, request, jsonify
import numpy as np
import librosa
from tensorflow.keras.models import load_model
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) 

# Load your trained model
model = load_model('emotion_recognition_model.h5')

# Define function for feature extraction
def extract_feature(file_path, sample_rate=22050):
    audio, sr = librosa.load(file_path, sr=sample_rate)
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    mel = librosa.feature.melspectrogram(y=audio, sr=sr)
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)
    tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(audio), sr=sr)
    
    features = np.hstack([
        np.mean(mfccs, axis=1), 
        np.mean(chroma, axis=1), 
        np.mean(mel, axis=1), 
        np.mean(contrast, axis=1), 
        np.mean(tonnetz, axis=1)
    ])
    
    return features

# Define route for handling audio files
@app.route('/predict', methods=['POST'])
def predict():
    # Get the audio file from the request
    audio_file = request.files['audio']
    
    # Save the audio file temporarily
    temp_path = 'temp_audio.wav'
    audio_file.save(temp_path)
    
    # Extract features from the audio file
    features = extract_feature(temp_path)
    
    # Preprocess features
    features = features.reshape(1, -1, 1)  # Add batch dimension and reshape for the model input
    
    # Make predictions using the loaded model
    predictions = model.predict(features)
    
    # Get the predicted emotion label
    emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad']  # Adjust based on your training labels
    predicted_emotion = emotion_labels[np.argmax(predictions)]
    
    # Delete temporary audio file
    os.remove(temp_path)
    
    # Return the predicted emotion
    return jsonify({'emotion': predicted_emotion})

if __name__ == '__main__':
    app.run(debug=True)
