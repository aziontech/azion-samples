const API_URL = 'https://api.azion.net/'
const API_PATH = 'api/v3/'
fetch(API_URL + API_PATH + 'tasks', {
 headers: {
   'Accept': 'application/json',
   'Content-Type': 'application/json'
 },
 method: 'patch',
 body: JSON.stringify( { task: task } )
})