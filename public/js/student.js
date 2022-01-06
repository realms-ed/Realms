var url = window.location.href;
window.hash = url.split('/')[4];
window.current_status = "understand";

function understand() {
    window.current_status = "understand"
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgb(14, 255, 94))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 30px rgba(94, 255, 0, 1))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0));';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    fetch('/update/'+window.hash+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));

}
function question() {
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0)))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgb(255, 196, 0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 30px rgb(255, 196, 0))';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    window.current_status = "question";
    fetch('/update/'+window.hash+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));

}

function x() {
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0));';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgba(255, 68, 68, 1))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 30px rgba(255, 68, 68, 1))';
    window.current_status = "dont_understand";
    fetch('/update/'+window.hash+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));

}

function keyparse(e) {
    var key = e.keyCode;
    if (key==37) { question();}
    else if (key == 38) { understand();}
    else if (key == 39) { x();}
}

$(window).load(function() {
    $("#bolt").click(function(){
        understand();
     });
     $("#question").click(function(){
        question();
     });
     $("#x").click(function(){
        x();
     });

     document.addEventListener("keydown", keyparse, false);
});

fetch('/update/'+window.hash+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));

var worker = new Worker('../../js/student_worker.js');
worker.onmessage = function() {
    try {
        fetch('/update/'+window.hash+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));
    } catch(err) {
        console.log(err);
    }
}