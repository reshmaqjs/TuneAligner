var duration="";
function stTolist(strg){
   duration="";
   var list=strg.replace(/'/g, '');
   list = list.replace(/\[/g, '');
   list = list.replace(/\]/g, '');
   list=list.split(",");
   var seqdata="", note="";
   for(i=0;i<list.length -1 ;i=i+3){
        note=list[i]+list[i+1];
        note=note.replace(/ /g, '');
        if(note=="--"){
            note="-";
        }
    seqdata=seqdata+" "+note;
    duration=duration+" "+list[i+2];
   }
   seqdata=seqdata.split(" ");
   seqdata=seqdata.filter(item => item !== null && item.trim() !== "");

    return seqdata;
}


function resultPlay(reff,testt){
    var ref=reff;
    var tes=testt;
    var reftimes=document.getElementById("reftimes").innerText;
    var testtimes=document.getElementById("testtimes").innerText;
    document.getElementById("reftimes").innerText="";
    document.getElementById("testtimes").innerText="";
    reftimes=reftimes.replace(/\[/g, '');
    reftimes=reftimes.replace(/\]/g, '');
    testtimes=testtimes.replace(/\]/g, '');
    testtimes=testtimes.replace(/\[/g, '');
    reftimes=reftimes.split(",");
    testtimes=testtimes.split(",");
    reftimes=reftimes.filter(item => item !== null && item.trim() !== "");
    testtimes=testtimes.filter(item => item !== null && item.trim() !== "");
    ref=stTolist(ref);

    var refduration=duration.split(" ");
    refduration=refduration.filter(item => item !== null && item.trim() !== "");
    var rt=0;
    for(i=0;i<refduration.length;i++){
        if(refduration[i]=="-"){
            refduration[i]=0;
        }
        else{
            refduration[i]=parseFloat( reftimes[rt]);
            rt++;
        }
       }

    tes=stTolist(tes);
    

    var testduration=duration.split(" ");
    testduration=testduration.filter(item => item !== null && item.trim() !== "");
    tt=0;
    for(i=0;i<testduration.length;i++){
        if(testduration[i]=="-"){
            testduration[i]=0;
        }
        else{
            testduration[i]=parseFloat( testtimes[tt]);
            tt++;
        }
       }

    var k=0;
    var flagerr=0;// note have no error
    var flagnoerr=0;// note have no error
    var reflinkdur="0";
    var testlinkdur="0";
    var reffnew="<label id='refresult"+k+"'>";
    var testtnew="<label id='testresult"+k+"'>";
    //***********for link do not consider the label with k=0*******
    for (i=0;i<ref.length;i++){
        if(ref[i]==tes[i]){
            if(flagerr==1 && flagnoerr==0 && i!=0){
                k=k+1;
                reflinkdur=reflinkdur+" "+refduration[i];
                testlinkdur=testlinkdur+" "+testduration[i];
                reffnew=reffnew+"</label><label id='refresult"+k+"'>";
                testtnew=testtnew+"</label><label id='testresult"+k+"'>";
                flagerr=0;
                flagnoerr=1;
            }
            reffnew=reffnew+"<font color='blue'>"+" "+ref[i]+"</font>";
            testtnew=testtnew+"<font color='blue'>"+" "+tes[i]+"</font>";
            flagerr=0;
            flagnoerr=1;
        }
        else{
            if(flagerr==0 && flagnoerr==1 && i!=0){
                k=k+1;
                reflinkdur=reflinkdur+" "+refduration[i-1];
                testlinkdur=testlinkdur+" "+testduration[i-1];
                reffnew=reffnew+"</label><label id='refresult"+k+"'>";
                testtnew=testtnew+"</label><label id='testresult"+k+"'>";
                flagerr=1;
                flagnoerr=0;
            }
            reffnew=reffnew+"<font color='green'>"+" "+ref[i]+"</font>";
            testtnew=testtnew+"<font color='red'>"+" "+tes[i]+"</font>";
            flagerr=1;
            flagnoerr=0;
        }
    }
    reffnew="<b>"+reffnew+"</b></label>";
    testtnew="<b>"+testtnew+"</b></label><br>";
    reflinkdur=reflinkdur.split(" ");
    reflinkdur=reflinkdur.filter(item => item !== null && item.trim() !== "");
    testlinkdur=testlinkdur.split(" ");
    testlinkdur=testlinkdur.filter(item => item !== null && item.trim() !== "");    
    
    document.getElementById('newrf').innerHTML=reffnew;
    document.getElementById('newts').innerHTML=testtnew;
    //+" "+k+" "+testlinkdur.length
    //link ref string with ref audio
    for(i=0;i<reflinkdur.length;i++){
       id1="refresult"+i;
       document.getElementById(id1).addEventListener('click', createEventListenerRef(reflinkdur[i]));
       }
//link test string with test audio
    for(i=0;i<testlinkdur.length;i++){
        id="testresult"+i;
        
       document.getElementById(id).addEventListener('click',createEventListenerTest(testlinkdur[i]));
    }
    }

    function createEventListenerRef(t) {
        return async function() {
            document.getElementById("refalignplay").innerHTML="<button>Play</button><br>"+t;
        };
    }
    function createEventListenerTest(t) {
        return async function() {
            document.getElementById("testalignplay").innerHTML="<button>Play</button><br>"+t;
        };
    }