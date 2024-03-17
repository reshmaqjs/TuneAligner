

import wave
import numpy as np
from scipy.fft import fft
import librosa

def detect_pitch(segment):
    # Calculate the Fast Fourier Transform (FFT)
    spectrum = fft(segment)

    # Calculate the frequency axis
    frame_rate = 44100  # Sample rate (can be adjusted accordingly)
    frequencies = np.fft.fftfreq(len(spectrum), d=1/frame_rate)

    # Find the index of the peak frequency
    peak_index = np.argmax(np.abs(spectrum))

    # Get the corresponding frequency (pitch)
    pitch = np.abs(frequencies[peak_index])

    return pitch 

def segment_audio_and_detect_pitch(audio_file_path):
    # Load the audio file
    y, sr = librosa.load(audio_file_path, sr=None)

    # Detect onsets
    onsets = librosa.onset.onset_detect(y=y, sr=sr)
    onset_times = librosa.frames_to_time(onsets, sr=sr)
    sampleSize=len(y)
    duration=librosa.get_duration(y=y, sr=sr)
    actual_onset_Times=[]
    # Segment audio at onsets and calculate pitch for each segment
    onsets=[]
    for i in onset_times:
        frame=int(sampleSize*i/duration)
        onsets.append(frame)
        
    segment_pitches = []
    k=0
    for i in range(len(onsets)):
        if (onset_times[i] > onset_times[k]+0.3) or i==0:         
            start_sample = 0 if i == 0 else onsets[i]
            end_sample = int((len(y)+onsets[i])/2) if i == len(onsets) - 1 else int((onsets[i+1]+onsets[i])/2)
            segment = y[start_sample:end_sample]
            pitch = detect_pitch(segment)
            segment_pitches.append(int(pitch))
            actual_onset_Times.append(onset_times[i])
            k=i
         
    return actual_onset_Times, segment_pitches

# Example usage:
audio_file_path = "A4.mp3"
onsettime,segment_pitches = segment_audio_and_detect_pitch(audio_file_path)

print("Onset time sequence:", onsettime)
print("Segment pitch sequence:", segment_pitches)


#successfully determined the pitch sequence

#Onset time sequence: [0.034829931972789115, 1.3467573696145125, 1.6602267573696146, 2.380045351473923]
#Segment pitch sequence: [435, 440, 438, 430]
