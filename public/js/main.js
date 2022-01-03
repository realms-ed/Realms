import {joinFunc} from '/js/module.js';

window.join = joinFunc

document.querySelector('#JoinButton').addEventListener('click', joinMeeting);
document.getElementById("CreateButton").onclick = createFunc;

window.addEventListener('beforeunload', function (e) {
    fetch('/leave/'+zoomid+'/'+screen_name, {method: 'POST'})
});

function joinMeeting()
{
    var screen_name="";
    if (document.getElementById("NameInput").value == "") {
        screen_name = "Guest";
    } else {
        screen_name = document.getElementById("NameInput").value;
    }

    var zoomid = "";
    if (document.getElementById("theInput").value == "") {
        alert("You need to enter a Zoom id!");
        return
    } else {
        zoomid = document.getElementById("theInput").value;
        console.log(zoomid);
    }

    window.location.href='/join/'+ zoomid + '/' + screen_name;
}

function createFunc() {
    const id = document.getElementById("theInput").value;
    if (id=="") {
        alert("Must enter a Zoom ID to begin Realms session.");
        return
    } else {
        document.location.href = '/host/' + id;
    }
}
