var url = window.location.href;
window.zoomid = url.split('/')[4];
window.screen_name = url.split('/')[5];
window.current_status = "understand";

function understand() {
    window.current_status = "understand"
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgb(14, 255, 94))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 30px rgba(94, 255, 0, 1))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0));';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    fetch('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status, {method: 'POST'})

}
function question() {
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0)))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgb(255, 196, 0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 30px rgb(255, 196, 0))';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    window.current_status = "question";
    fetch('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status, {method: 'POST'})

}

function x() {
    document.getElementById("bolt").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("bolt").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['-webkit-filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0))';
    document.getElementById("question").style['filter'] = 'drop-shadow(0px 0px 0px rgb(0,0,0));';
    document.getElementById("x").style['-webkit-filter'] = 'drop-shadow(0px 0px 30px rgba(255, 68, 68, 1))';
    document.getElementById("x").style['filter'] = 'drop-shadow(0px 0px 30px rgba(255, 68, 68, 1))';
    window.current_status = "dont_understand";
    fetch('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status, {method: 'POST'})

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

var worker = new Worker('../../js/student_worker.js');
worker.onmessage = function() {
    try {
        fetch('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status, {method: 'POST'}).catch(err => console.error("Err" + err));
        console.log('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status)
    } catch(err) {
        console.log(err);
    }
}