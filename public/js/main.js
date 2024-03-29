document.querySelector('#JoinButton').onclick = joinFunc;
document.getElementById("CreateButton").onclick = createFunc;

function joinFunc() {
    var screen_name=window.localStorage.getItem('name');

    var zoomid = "";
    if (document.getElementById("theInput").value == "") {
        alert("You need to enter a Zoom id!");
        return
    } else {
        zoomid = document.getElementById("theInput").value;
        window.localStorage.setItem('zoomid', zoomid);
    }
    window.location.href='/join/'+ zoomid + '/' + screen_name;
}

function createFunc() {
    const id = document.getElementById("theInput").value;
    if (id=="") {
        alert("Must enter a Zoom ID to begin Realms session.");
        return
    } else {
        document.location.href = '/create/' + id;
    }
}