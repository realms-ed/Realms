const client = ZoomMtgEmbedded.createClient();

let meetingSDKElement = document.getElementById('meetingSDKElement');

//var url = "http://localhost:4000/";
var url = window.location.href
console.log(url)

client.init({
  debug: true,
  zoomAppRoot: meetingSDKElement,
  language: 'en-US',
  customize: {
    meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
    toolbar: {
      buttons: [
        {
          text: 'Custom Button',
          className: 'CustomButton',
          onClick: () => {
            console.log('custom button');
          }
        }
      ]
    }
  }
});

export function joinFunc() {    

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

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.signature);
            client.join({
                signature: json.signature,
                meetingNumber: zoomid,
                userName: screen_name,
                apiKey: "NRF1ny_0Sz2VWOlYb7szcg",
                passWord: "",
                success: (success) => {
                  console.log(success)
                },
                error: (error) => {
                  console.log(error)
                }
              })
        }
    };
    var data = JSON.stringify({
        "meetingNumber": zoomid,
        "role": 0
      });
    xhr.send(data);
}