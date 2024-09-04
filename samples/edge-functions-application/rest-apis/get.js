var myHeaders = new Headers();
myHeaders.append("Accept", "application/json; version=3");
myHeaders.append("Authorization", "Token [TOKEN VALUE]");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.azionapi.net/digital_certificates/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));