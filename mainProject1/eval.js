const audiodata=new Audio();
let refsrc="";
let testsrc="";
function Evaluation(refsr,testsr){
   
    refsrc=refsr;
    testsrc=testsr;
    document.getElementById("pp").innerHTML="<button onclick='playdata()'>click</button>";
//alert(srcdata);
}

function playdata(){
const audio1=new Audio(refsrc);
//audiodata.src=refsrc;
audio1.play();
}