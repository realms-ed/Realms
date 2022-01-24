const client = ZoomMtgEmbedded.createClient();

let meetingSDKElement = document.getElementById('meetingSDKElement');

var url = window.location.href
//var url = "http://:4000/"
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

var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json.signature);
        client.join({
            signature: json.signature,
            meetingNumber: window.zoomid,
            userName: window.name,
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
    "meetingNumber": window.zoomid,
    "role": 0
  });
xhr.send(data);