import librosa
import librosa.display
import matplotlib.pyplot as plt
def main():
    # Load audio file
    audio_path = 'A4.mp3'
    y, sr = librosa.load(audio_path)

    # Calculate onset strength
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)

    # Find onset events
    onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)

    # Compute pitch
    pitch, _ = librosa.core.piptrack(y=y, sr=sr)

    # Take the pitch with the maximum magnitude as the estimated pitch
    pitch_sequence = pitch.max(axis=0)

    # Print pitch sequence from one onset to the next onset or end of audio
    print("Onset\tStart Time (s)\tEnd Time (s)\tPitch Sequence (Hz)")
    for i, onset_frame in enumerate(onset_frames[:-1]):
        start_time = librosa.frames_to_time(onset_frame, sr=sr)
        next_onset_frame = onset_frames[i + 1]
        end_time = librosa.frames_to_time(next_onset_frame, sr=sr)
        
        pitch_sequence_between_onsets = pitch_sequence[onset_frame:next_onset_frame]
        
        print(f"{i+1}\t{start_time:.2f}\t\t{end_time:.2f}\t\t{pitch_sequence_between_onsets}")

    # For the last onset to the end of audio
    last_onset_frame = onset_frames[-1]
    start_time = librosa.frames_to_time(last_onset_frame, sr=sr)
    end_time = librosa.get_duration(y=y, sr=sr)
    
    pitch_sequence_between_onsets = pitch_sequence[last_onset_frame:]
    
    print(f"{len(onset_frames)}\t{start_time:.2f}\t\t{end_time:.2f}\t\t{pitch_sequence_between_onsets}")

if __name__ == "__main__":
    main()


#results****************

# Onset	Start Time (s)	End Time (s)	Pitch Sequence (Hz)
# 1	0.07		0.19		[2667.8057 2668.3555 2668.2478 2668.5654 2667.6653]
# 2	0.19		0.30		[2666.4688 2667.244  2667.5862 2667.8555 2667.966 ]
# 3	0.30		0.46		[2667.835  1767.2015 1766.9116 1766.9055 1766.6713 1767.4244 1766.8385]
# 4	0.46		0.58		[1766.9468 1767.6064 1766.5858 1767.0227 1766.8822]
# 5	0.58		0.77		[440.36456 440.32306 440.35544 440.36795 440.33603 440.36172 440.3747
#  440.34973]
# 6	0.77		0.81		[1766.7661 1766.0422]
# 7	0.81		0.95		[1766.7662 1766.8307 1766.5281 1766.8046 1767.0552 1767.0737]
# 8	0.95		1.07		[1767.1504 1767.3436 1766.925  1767.3611 2667.2913]
# 9	1.07		1.21		[2667.3616 1767.1342 2667.4119 2667.2537 2667.1165 2667.0527]
# 10	1.21		1.37		[2667.196  2667.4685 2667.8044 2667.384  2667.7585 2667.5308 2667.1267]
# 11	1.37		1.58		[2667.02   2666.998  1767.128  1767.1045 1767.2754 1767.138  1766.9196
#  1766.9617 1767.2522]
# 12	1.58		1.70		[1766.9269 1766.9154 1766.9008 1766.8563 1766.897 ]
# 13	1.70		1.93		[1767.0151 1766.6647 1765.6953 1766.7489 1766.1683 2667.3086 2667.814
#  2667.0195 2667.1    2666.7693]
# 14	1.93		2.23		[1768.487  3121.7969 3122.6545 1768.432  1767.5167 1768.0238 1767.8604
#  1767.1807 1767.7341 3122.1006 3122.794  3122.6123 3122.52  ]
# 15	2.23		2.30		[1767.0421 1766.9946 1767.7007]
# 16	2.30		2.40		[1767.1201 1766.8784 1766.2714 1765.7535 1765.8121]

