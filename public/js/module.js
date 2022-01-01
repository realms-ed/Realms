const client = ZoomMtgEmbedded.createClient();

let meetingSDKElement = document.getElementById('meetingSDKElement');

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

    var xhr = new XMLHttpRequest();
    var url = "https://realms-ed.herokuapp.com/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.signaturess);
            client.join({
                signature: json.signature,
                meetingNumber: 123456789,
                userName: "Ray",
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
        "meetingNumber": 123456789,
        "role": 0
      });
    xhr.send(data);
}