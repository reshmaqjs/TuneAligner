
let recorder;
let audioChunks = [];

async function startRecordTest (){
  document.getElementById("rec2").innerHTML="<button id='stopRecordtest' onclick='stopTestRecord()'>Stop Recording</button>"

  audioChunks = []
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);
  blb=""
  recorder.ondataavailable = e => {
               audioChunks.push(e.data);
               if (recorder.state == "inactive") {
                   const blob = new Blob(audioChunks, { type: 'audio/wav' });
                   
                    blb=blob;
                    document.getElementById("rec2").innerHTML="<button id='startRecordnew' onclick='startRecordTest()'>Start Recording</button><button id='downld' onclick=' DounloadFile()'>Download</button>";

               }
           };

           recorder.start();
           document.getElementById('startRecord').disabled = true;
           document.getElementById('stopRecord').disabled = false;
       };

       function stopTestRecord() {
           recorder.stop();
           document.getElementById('startRecord').disabled = false;
           document.getElementById('stopRecord').disabled = true;
        };
      function  DounloadFile(){
        sendTestAudio(blb);
      }
       const sendTestAudio = async (audioBlob) => {
        const url = URL.createObjectURL(audioBlob);
        
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'recorded_audio.wav'; // Set the download filename
        document.body.appendChild(link); // Append the link to the document body
        link.click(); // Simulate a click event to trigger the download
        URL.revokeObjectURL(url);
       };

