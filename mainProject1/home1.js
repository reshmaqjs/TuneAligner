
let mediaRecorder;
let chunks = [];
const refinputDiv=document.getElementById("refWindow");
const tesinputDiv=document.getElementById("tesWindow");
const refinputDiv2=document.getElementById("refWindow2");
const tesinputDiv2=document.getElementById("tesWindow2");
const audio=new Audio();
//declare variables to store source of reference and test audios
var refaudiosource="";
var testaudiosource="";
// call process recording of reference audio
function printrefrecord(){
   refinputDiv.innerHTML="<br><button id='refRecording' onclick='Recordref()'>Start</button><br><br><button id='stopref'  onclick='refstop()'>Stop</button>";
}
// call process uploading of reference audio
function printrefupload(){
   refinputDiv.innerHTML='<input type="file" name="inputfileref" id="uploadref" accept=".mp3, .wav" onchange="handlerefSelect(event)"><br><button id="bt1" onclick="playref()">Play</button><br><br>';
   refinputDiv2.innerHTML="";
   }
// call process recording of test audio
function printtesrecord(){
     tesinputDiv.innerHTML="<br><button id='tesRecording' onclick='Recordtest()'>Start</button><br><br><button id='stoptest'  onclick='teststop()'>Stop</button>";
   }
// call process uploading of test audio
function printtesupload(){
    tesinputDiv.innerHTML='<input type="file" name="inputfiletest" id="uploadtest" accept=".mp3, .wav" onchange="handletestSelect(event)"><br><button id="bt2" onclick="playtest()">Play</button><br><br>';
    tesinputDiv2.innerHTML="";
   }

//update value of refaudiosource when upload reference file
   function handlerefSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          audioSrc = e.target.result;
          refaudiosource=audioSrc;
          playButton.disabled = false;
        };
        reader.readAsDataURL(file);
      }
    }

//update value of testaudiosource when upload test file
    function handletestSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          audioSrc = e.target.result;
          testaudiosource=audioSrc;
          playButton.disabled = false;
        };
        reader.readAsDataURL(file);
      }
    }

//play uploaded reference audio
function playref()  {
   const audioref=document.getElementById("uploadref");
   const audioFileref = audioref.files[0];
   if (!audioFileref) {
      alert('Please select an audio file.');
      return;
  }
  const audioFileReader = new FileReader();

    audioFileReader.onload = function (e) {
        const audioData = e.target.result;

        // Initialize audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Decode audio data
        audioContext.decodeAudioData(audioData, function (decodedBuffer) {
            // Store the decoded audio data in a variable
            const audioBuffer = decodedBuffer;

            // Play the stored audio data
            playAudio(audioBuffer);
        });
    };

    audioFileReader.readAsArrayBuffer(audioFileref);

}

//play uploaded test audio
function playtest()  {
   const audiotest=document.getElementById("uploadtest");
   const audioFiletest = audiotest.files[0];
   if (!audioFiletest) {
      alert('Please select an audio file.');
      return;
  }
  const audioFileReader = new FileReader();

    audioFileReader.onload = function (e) {
        const audioData = e.target.result;

        // Initialize audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Decode audio data
        audioContext.decodeAudioData(audioData, function (decodedBuffer) {
            // Store the decoded audio data in a variable
            const audioBuffer = decodedBuffer;

            // Play the stored audio data
            playAudio(audioBuffer);
        });
    };

    audioFileReader.readAsArrayBuffer(audioFiletest);

}
function playAudio(buffer) {
   // Create a buffer source
   audioSource = audioContext.createBufferSource();
   audioSource.buffer = buffer;

   // Connect the buffer source to the audio context's destination (speakers)
   audioSource.connect(audioContext.destination);

   // Start playing the audio
   audioSource.start();
}

//Record refernce audio
async function Recordref(){
   refinputDiv2.innerHTML="<audio id='audioElementref' controls></audio>";
   const audioElement = document.getElementById('audioElementref');  
   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
   mediaRecorder = new MediaRecorder(stream);

   mediaRecorder.ondataavailable = function(event) {
     chunks.push(event.data);
   };

   mediaRecorder.onstop = function() {
     const audioBlob = new Blob(chunks, { type: 'audio/wav' });
     chunks = [];
     const audioUrl = URL.createObjectURL(audioBlob);
     audioElement.src = audioUrl;

    //update value of refaudiosource when record reference audio
     refaudiosource=audioElement.src;
   };

   mediaRecorder.start();
   startButton.disabled = true;
   stopButton.disabled = false;
   mediaRecorder.addEventListener('dataavailable', event => {
   audioChunks.push(event.data);
    });
}
function refstop(){
   mediaRecorder.stop();
   startButton.disabled = false;
   stopButton.disabled = true;
   
}

//Record test audio
async function Recordtest(){
   tesinputDiv2.innerHTML="<audio id='audioElementtest' controls></audio>";
   const audioElement = document.getElementById('audioElementtest');  
   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
   mediaRecorder = new MediaRecorder(stream);

   mediaRecorder.ondataavailable = function(event) {
     chunks.push(event.data);
   };

   mediaRecorder.onstop = function() {
     const audioBlob = new Blob(chunks, { type: 'audio/wav' });
     chunks = [];
     const audioUrl = URL.createObjectURL(audioBlob);
     audioElement.src = audioUrl;
     //update value of testaudiosource when record test audio
     testaudiosource=audioElement.src;
   };

   mediaRecorder.start();
   startButton.disabled = true;
   stopButton.disabled = false;
}
function teststop(){
   mediaRecorder.stop();
   startButton.disabled = false;
   stopButton.disabled = true;
}


function evaluaterefTest(){
  //var valuedata=refaudiosource+"  "+testaudiosource;
  const audioDataUrl1 = encodeURIComponent(refaudiosource);
  const audioDataUrl2 = encodeURIComponent(testaudiosource);
  window.location.href = `Result.html?audioDataUrl1=${audioDataUrl1}&audioDataUrl2=${audioDataUrl2}`;
 // Evaluation(refaudiosource,testaudiosource);
  // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //  alert(refaudiosource+"  "+testaudiosource);

  //  audio.src=refaudiosource;
  //  fetch(audio.src)
  // .then(response => response.arrayBuffer())
  // .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  // .then(audioBuffer => {
  //   // Create a source node
  //   const source = audioContext.createBufferSource();
  //   source.buffer = audioBuffer;

  //   // Connect the source to a gain node for volume control
  //   const gainNode = audioContext.createGain();
  //   source.connect(gainNode);
  //   gainNode.connect(audioContext.destination);

  //   // Adjust volume if necessary
  //   gainNode.gain.value = 0.5; // Example volume adjustment

  //   // Play the audio
  //   source.start();
  //   const filterNode = audioContext.createBiquadFilter();
  //   filterNode.type = "lowpass";
  //   filterNode.frequency.value = 1000; // Adjust cutoff frequency
  //   gainNode.connect(filterNode);
  //   filterNode.connect(audioContext.destination);
  // })
  // .catch(error => {
  //   console.error('Error loading audio file:', error);
  // });

  //  const source = audioCtx.createMediaElementSource(audio);

  //  const filter = audioCtx.createBiquadFilter();
  //  filter.type = 'lowpass';
  //  filter.frequency.value = 1000; // Adjust this value to find the right balance
   
  //  // Connect the nodes: source -> filter -> destination
  //  source.connect(filter);
  //  filter.connect(audioCtx.destination);
  //  audio.play();
}