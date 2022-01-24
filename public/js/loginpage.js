var req = new XMLHttpRequest();
var url = '/getlogininformation';

req.open('GET',url,true); // set this to POST if you would like
req.addEventListener('load',onLoad);
req.addEventListener('error',onError);

req.send();

function onLoad() {
   var response = this.responseText;
   var parsedResponse = JSON.parse(response);

   // access your data newly received data here and update your DOM with appendChild(), findElementById(), etc...
   var messageToDisplay = parsedResponse['message'];

   // append child (with text value of messageToDisplay for instance) here or do some more stuff
}

function onError() {
  // handle error here, print message perhaps
  console.log('error receiving async AJAX call');
}