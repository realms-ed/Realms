var url = window.location.href;
window.zoomid = url.split('/')[4];
window.screen_name = url.split('/')[5];
window.current_status = "hunky dory";

$(window).load(function() {
    $("#green_glow").click(function(){
        alert("it works!");
     });
});

var worker = new Worker('../../js/student_worker.js');
worker.onmessage = function() {
    fetch('/update/'+window.zoomid+'/'+window.screen_name+'/'+window.current_status, {method: 'POST'})
    console.log("emmitted")
}