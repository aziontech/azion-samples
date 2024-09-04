fetch('https://example.com/delete-item/' + id, {
    method: 'DELETE',
   })
   .then(res => res.text()) // or res.json()
   .then(res => console.log(res))