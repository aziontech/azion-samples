const putMethod = {
    method: 'PUT', // Method itself
    headers: {
     'Content-type': 'application/json; charset=UTF-8' // Indicates the content
    },
    body: JSON.stringify(someData) // We send data in JSON format
   }
   // make the HTTP put request using fetch api
   fetch(url, putMethod)
   .then(response => response.json())
   .then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
   .catch(err => console.log(err)) // Do something with the error