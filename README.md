# Speech Emotion Recognition Models

This project centers around building machine learning models for speech emotion recognition using two datasets - TESS Dataset and CREMA-D Dataset. The models are trained to recognize emotions such as anger, disgust, fear, happiness, neutral, and sadness from audio samples.

## Datasets Used:
1. **TESS Dataset**: The Toronto Emotional Speech Set (TESS) contains a collection of short, semantically neutral, and emotionally spoken sentences. It includes seven emotions: anger, disgust, fear, happiness, pleasant surprise, sadness, and neutral. Each emotion is represented by a different speaker. The dataset consists of 2800 audio files, each lasting approximately 3.5 seconds.
   
2. **CREMA-D Dataset**: The Crowd-Sourced Emotional Multimodal Actors Dataset (CREMA-D) contains over 7,000 labeled samples of spontaneous and acted emotion. It includes a wide range of emotional expressions such as anger, disgust, fear, happiness, neutral, and sadness. The dataset consists of audio recordings by 91 actors, performing 12 sentences with different emotional expressions.

## Model Architecture:

### Feature Extraction:
- **Mel-Frequency Cepstral Coefficients (MFCCs)**: MFCCs are commonly used in speech processing tasks as they capture the characteristics of the human voice. They are extracted from the audio signals to represent the spectral envelope of the audio.

### Data Processing:
- **Normalization**: The extracted MFCCs are normalized to ensure that the features have a similar scale, which helps in improving the convergence of the models during training.
- **Padding**: Since the audio samples may have varying lengths, padding is applied to ensure that all samples have the same length, thus enabling batch processing during training.

### Neural Network Model:
- **Architecture**: The neural network model consists of multiple dense layers with activation functions such as ReLU (Rectified Linear Unit) and softmax at the output layer.
- **Training**: The model is trained using backpropagation and optimization techniques such as stochastic gradient descent (SGD) or Adam optimizer. The loss function used is typically categorical cross-entropy, suitable for multi-class classification tasks.

### Convolutional Neural Network (CNN) Model:
- **Architecture**: The CNN model is designed to extract spatial and temporal features from the audio spectrograms. It typically consists of convolutional layers followed by pooling layers to reduce dimensionality and extract important features.
- **Training**: Similar to the neural network model, the CNN model is trained using backpropagation and optimization techniques. The model is trained on the spectrogram representations of the audio samples.

## Evaluation Metrics:
- **Accuracy**: Accuracy is used to measure the overall performance of the models in correctly predicting the emotions from the audio samples.
- **Confusion Matrix**: Confusion matrix provides insights into the classification performance by showing the true positives, true negatives, false positives, and false negatives for each class.

## Contributors:
- [Your Name]
- [Any other contributors]

## License:
This project is licensed under the [License Name] License - see the [LICENSE](LICENSE) file for details.
