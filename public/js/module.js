export function joinFunc() {
    var xhr = new XMLHttpRequest();
    var url = "https://localhost:4000/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);;
        }
    };
    var data = JSON.stringify({
        "meetingNumber": 123456789,
        "role": 0
      });
    xhr.send(data);
}