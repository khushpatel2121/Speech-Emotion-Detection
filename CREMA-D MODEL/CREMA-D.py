import os
import numpy as np
import pandas as pd
import librosa
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Dense, Dropout
from tensorflow.keras import regularizers
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam
from audiomentations import Compose, AddGaussianNoise, TimeStretch, PitchShift, Shift

# Function to extract features from audio files
def extract_feature(file_path, sample_rate=22050):
    audio, sr = librosa.load(file_path, sr=sample_rate)
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    mel = librosa.feature.melspectrogram(y=audio, sr=sr)
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)
    tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(audio), sr=sr)
    
    # Concatenate all features
    features = np.hstack([
        np.mean(mfccs, axis=1), 
        np.mean(chroma, axis=1), 
        np.mean(mel, axis=1), 
        np.mean(contrast, axis=1), 
        np.mean(tonnetz, axis=1)
    ])
    
    return features

# Function to extract emotion label from filename
def parse_filename(filename):
    parts = filename.split('_')
    emotion = parts[2]
    return emotion

# Function to load dataset
def load_dataset(directory, sample_rate=22050, augment=None):
    data = []
    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)
        if file_path.endswith('.wav'):
            audio, sr = librosa.load(file_path, sr=sample_rate)
            if augment:
                augmented_audio = augment(samples=audio, sample_rate=sample_rate)
                original_features = extract_feature(file_path, sample_rate)
                augmented_features = extract_feature(file_path, sample_rate)
                emotion = parse_filename(file)
                data.append([original_features, emotion])
                data.append([augmented_features, emotion])
            else:
                feature = extract_feature(file_path, sample_rate)
                emotion = parse_filename(file)
                data.append([feature, emotion])
    
    df = pd.DataFrame(data, columns=['features', 'label'])
    return df

# Apply data augmentation to the training data
augment = Compose([
    AddGaussianNoise(min_amplitude=0.001, max_amplitude=0.015, p=0.5),
    TimeStretch(min_rate=0.8, max_rate=1.2, p=0.5),
    PitchShift(min_semitones=-4, max_semitones=4, p=0.5),
    Shift(min_shift=-0.5, max_shift=0.5, p=0.5)  # Corrected arguments
])

# Load dataset with augmentation
audio_dir = '/Users/khushpatel/Desktop/ML Projects/Emotion Detection/CREMA-D MODEL/AudioWAV'
df = load_dataset(audio_dir, augment=augment)

# Split data into features and labels
X = np.array(df['features'].tolist())
Y = np.array(df['label'])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Reshape input features for CNN
X_train = X_train.reshape(-1, X_train.shape[1], 1)
X_test = X_test.reshape(-1, X_test.shape[1], 1)

# Convert labels to one-hot encoded vectors
label_encoder = LabelEncoder()
y_train_encoded = to_categorical(label_encoder.fit_transform(y_train))
y_test_encoded = to_categorical(label_encoder.transform(y_test))

# Define the CNN model
model = Sequential()
model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(X_train.shape[1], 1),
                 kernel_regularizer=regularizers.l2(0.01)))
model.add(MaxPooling1D(pool_size=2))
model.add(Conv1D(filters=128, kernel_size=3, activation='relu', kernel_regularizer=regularizers.l2(0.01)))
model.add(MaxPooling1D(pool_size=2))
model.add(Conv1D(filters=256, kernel_size=3, activation='relu', kernel_regularizer=regularizers.l2(0.01)))
model.add(MaxPooling1D(pool_size=2))
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(np.unique(Y)), activation='softmax'))

# Compile the model
optimizer = Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(X_train, y_train_encoded, epochs=100, batch_size=32, validation_data=(X_test, y_test_encoded))

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test_encoded)
print(f'Test Loss: {loss}')
print(f'Test Accuracy: {accuracy}')
