
export const blockHTML = (blockedUntil) => {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Blocked</title>
      <meta name="description" content="KV Starter Kit - Blocked Page" />
      <meta http-equiv="refresh" content="10">
      <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
      <style>
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            font-weight: normal;
        }
        body {
            padding: 0;
            margin: 0;
            background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;
            color: #ffffff;
            font-family: "Roboto", sans-serif;
        }
        h1 {
            margin: 0 0 2rem 0;
            padding: 0;
        }
        p {
            margin: 0;
            opacity: 0.8;
            font-size: 12pt;
            line-height: 2;
        }
        button {
            outline: none;
            cursor: pointer;
            border: none;
            background-color: transparent;
        }
        section {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
        }
        .header {
            margin-right: auto;
        }
        .content {
            align-items: center;
            color: #ffffff;
            margin: 40vh 0;
            text-align: center;
            width: 80vw;
        }
        
        .content span {
            color: #fdba74;
        }
      </style>
  
  </head>
  
  <body>
      <section>
          <div class="content">
              <div class="brand">
                  <h1>Blocked!</h1>
                  <p>
                      Your IP is blocked until: <span>${new Date(Number(blockedUntil)).toLocaleString()}</span>.
                  </p>
                  <p>
                      Current time: <span id="current-time">${new Date().toLocaleString()}</span>.
                  </p>
              </div>
          </div>
      </section>
  </body>

  <script type="application/javascript" defer>
    window.onload = () => {
        function updateTime() {
            const timeSpan = document.querySelector('#current-time');
            timeSpan.textContent = new Date().toLocaleString();
        }

        updateTime();
        setInterval(updateTime, 1000);
    };
  </script>

  </html>`;
};