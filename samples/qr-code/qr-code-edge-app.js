async function handleRequest(request) {
  var html = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" href="data:;base64,=">
      <title>Qr code edge app </title>
      <script type="text/javascript" src="https://unpkg.com/qrcode-generator@1.4.4/qrcode.js">   
        
        </script>
    <body style="background-color:#333;display: flex; flex-flow:column; gap:16px; justify-content: center;align-items: center;height: 100vh;">
      <form action="" >
          <label for="qrcode">
              <input required onchange="handleSubmit()" type="text" name="qrcode" id="qrcode" />
          </label>
      </form>
      <div id="placeHolder"></div>    
    </body>
    
    <script>
      const handleSubmit = ()=>{
          const typeNumber = 4;
          const errorCorrectionLevel = 'L';
          const qrcodeSize = 8;
          const qrCodeFactory = qrcode(typeNumber, errorCorrectionLevel);
          
          const qrcodeField = document.getElementById('qrcode')
          qrCodeFactory.addData(qrcodeField.value);
          qrCodeFactory.make();
          
          document.getElementById('placeHolder').innerHTML = qrCodeFactory.createImgTag(8);
      }
  
      document.querySelector("form").addEventListener("submit", function(event){
          event.preventDefault();
  
          handleSubmit();
      });
    </script>
  </html>`;

return new Response(html, {
  headers: {
    "content-type": "text/html;charset=UTF-8",
  },
})
}

addEventListener("fetch", event => {
event.respondWith(handleRequest(event.request))
})
