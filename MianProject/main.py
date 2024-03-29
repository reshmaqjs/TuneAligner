from flask import Flask, render_template, request, send_from_directory, url_for
from flask_wtf import FlaskForm
from wtforms import FileField,SubmitField
from werkzeug.utils import secure_filename
import os
import subprocess
from wtforms.validators import InputRequired
from flask_wtf.file import FileAllowed
import wave
import numpy as np
from scipy.fft import fft
import librosa
from app.getNoteTimeSequence import Make_Note_Time_Sequence
from app.pitchDetector import segment_audio_and_detect_pitch 
from app.SequenceAligner import AlignBest
app =Flask(__name__)
app.config['SECRET_KEY']='supersecretkey'
app.config['UPLOAD_FOLDER']='static/files'

class UploadFileForm(FlaskForm):
    file1=FileField("File",validators=[InputRequired(),FileAllowed(['wav', 'mp3'],'Only WAV or MP3 files allowed.')])
    file2=FileField("File",validators=[InputRequired(),FileAllowed(['wav', 'mp3'],'Only WAV or MP3 files allowed.')])
    submit_process = SubmitField("Process Files")
    submit=SubmitField("Evaluate")
# class Backpage(FlaskForm):
#     submit=SubmitField("Back")


def mp3_to_wav(mp3_path):
    wav_path = os.path.splitext(mp3_path)[0] + '.wav'
    subprocess.call(['ffmpeg', '-i', mp3_path, wav_path])
    return wav_path

@app.route('/',methods=['GET','POST'])
@app.route('/home',methods=['GET','POST'])

def home():
    refFlag=0
    testFlag=0
    form=UploadFileForm()
    if form.validate_on_submit():
        file1=form.file1.data
        filename1 = secure_filename(file1.filename)
        file2=form.file2.data
        filename2 = secure_filename(file2.filename)
        if filename1.endswith('.mp3'):
            filename1='ref.mp3'
            refFlag=1
        else:
            filename1='ref.wav'
        file1.save(os.path.join(os.path.abspath(os.path.dirname(__file__)),app.config['UPLOAD_FOLDER'],secure_filename(filename1)))
        if filename2.endswith('.mp3'):
            filename2='test.mp3'
            testFlag=1
        else:
            filename2='test.wav'
        file2.save(os.path.join(os.path.abspath(os.path.dirname(__file__)),app.config['UPLOAD_FOLDER'],secure_filename(filename2)))
        print(refFlag,",",testFlag)
        refseq,testseq,AlignedRefSeq,AlignedTestSeq,percentscore=evaluate(refFlag,testFlag)
        refalignNotes,testalinNotes=Findnotes(AlignedRefSeq,AlignedTestSeq)
        data = {'refseq': refseq, 'testseq': testseq,'AlignedRefSeq':AlignedRefSeq,'AlignedTestSeq':AlignedTestSeq,'refalignNotes':refalignNotes,'testalinNotes':testalinNotes,'percentscore':percentscore}
        return render_template('second.html',data=data)
    return render_template('index.html',form=form)
# @app.route('/secondpage',methods=['GET','POST'])
# def seondpage():
#     backform=Backpage(data)
#     if backform.validate_on_submit():
#             return render_template('index.html',form=form)
#     return render_template('second.html',data=data,form=backform) 



def Findnotes(aref,atest):
    a_refnote = [i[0]+str(i[1]) for i in aref]
    a_testnote= [ i[0]+str(i[1]) for i in atest]
    return a_refnote,a_testnote
def evaluate(rf,tf):
    audio_file_path_ref="ref.wav"
    audio_file_path_test="test.wav"
    if(rf==1):
        audio_file_path_ref='ref.mp3'
    if(tf==1):
        audio_file_path_test='test.mp3'
    # Load the audio file
    static_folder = os.path.join(os.path.dirname(__file__), 'static/files')
    file_path1 = os.path.join(static_folder, audio_file_path_ref)
    file_path2 = os.path.join(static_folder, audio_file_path_test)
    y1, sr1 = librosa.load(file_path1, sr=None)
    y2, sr2 = librosa.load(file_path2, sr=None)

    onsettime_ref,segment_pitches_ref,duration_ref = segment_audio_and_detect_pitch(y1,sr1)
    onsettime_test,segment_pitches_test,duration_test = segment_audio_and_detect_pitch(y2,sr2)

    print("Onset time sequence:", onsettime_ref)
    print("Segment pitch sequence:", segment_pitches_ref)

    print("Onset time sequence:", onsettime_test)
    print("Segment pitch sequence:", segment_pitches_test)
    note_time_sequence_ref=Make_Note_Time_Sequence(segment_pitches_ref,onsettime_ref,duration_ref)
    note_time_sequence_test=Make_Note_Time_Sequence(segment_pitches_test,onsettime_test,duration_test)
    print(" ")
    print(" ")
    print("note_time_sequence_ref   ",note_time_sequence_ref)
    print("note_time_sequence_test   ",note_time_sequence_test)
    print(" ")
    print(" ")
    ref_align_seq,test_align_seq,percentOfMatch=AlignBest(note_time_sequence_ref,note_time_sequence_test)
    return note_time_sequence_ref,note_time_sequence_test,ref_align_seq,test_align_seq,percentOfMatch

if __name__=='__main__':
    app.run(
        host='127.0.0.1',
        port=5001,
        debug=True
    )