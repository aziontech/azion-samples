export const indexHTML = (location, metadata) => {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Upstash Geolocation</title>
      <meta name="description" content="Azion Template Upstash Geolocation" />
      <style>
      *, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: "Roboto", sans-serif;}h1 {margin: 0;padding: 0;}a {color: inherit;display: block;border-radius: 0.25rem;background: transparent;border: 1px solid #363636ff;transition: background 0.2s, border 0.2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, 0.15);border: 1px solid #36363626;}p {margin: 0;opacity: 0.6;font-size: 0.8rem;line-height: 1.5;max-width: 40ch;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 6rem 0;flex-direction: column;width: 80vw;}.content::after {content: "";left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: "Inter var experimental", "Inter var", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: 0.7rem;margin-top: 0.7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {display: flex;justify-content: center;gap: 10px;}.content-info {display: flex;flex-direction: column;gap: 20px;margin-top: 20px;align-items: center;}.content-info h2 {color: #ef6537;font-weight: 900;font-size: 24pt;text-align: center;}.content-info .instructions {max-width: 95%;display: flex;justify-content: center;}.content-info .instructions h4 {font-size: 14pt;text-align: center;}.content-info .instructions span {color: #ef6537;font-weight: 500;font-size: 14pt;}.content-actions {padding: 10px 0;}.content-actions button {cursor: pointer;outline: none;padding: 10px 15px;background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;}@media only screen and (min-width: 576px) {section {padding: 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}.content-info .instructions {max-width: 60%;}}
      </style>
  
  </head>
  
  <body>
      <section>
          <div class="header">
              <div style="width: 100px; height: 24px;">
                  <svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M68.8751 0L64.3906 23.4146H87.711L92.1955 0H68.8751ZM72.5179 4.42392H86.8522L84.0623 18.9907H69.728L72.5179 4.42392Z"
                          fill="#F3652B"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M60.0001 0L55.6094 23.4146H59.9992L64.3899 0H60.0001Z" fill="#F3652B"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M24.3824 0L0.654522 19.9761L0 23.4146H3.41853L21.7987 7.94855L18.8361 23.4146H23.3197L27.8049 0H24.3824Z"
                          fill="#F3652B"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M115.516 0L113.526 10.3871L117.148 14.8895L120 0H115.516ZM96.6798 0L92.1953 23.4146H96.6815L99.755 7.36298L112.711 23.4146H115.516L116.069 20.5482L99.4841 0H96.6798Z"
                          fill="#F3652B"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M32.2893 0L31.4419 4.42401H46.9283L28.4682 19.9674L27.8047 23.4146H51.125L51.9724 18.9906H36.4861L54.9502 3.44385L55.6096 0H32.2893Z"
                          fill="#F3652B"></path>
                  </svg>
              </div>
          </div>
          <div class="content">
              <div class="brand">
                  <div class="brand-image">
                      <svg height="40" viewBox="0 0 1631 472" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M0.421875 412.975C78.5269 491.079 205.16 491.079 283.265 412.975C361.369 334.87 361.369 208.237 283.265 130.132L247.909 165.487C306.488 224.066 306.488 319.041 247.909 377.619C189.331 436.198 94.3559 436.198 35.7769 377.619L0.421875 412.975Z"
                              fill="#00E9A3"></path>
                          <path
                              d="M71.1328 342.264C110.185 381.316 173.501 381.316 212.554 342.264C251.606 303.212 251.606 239.895 212.554 200.843L177.199 236.198C196.725 255.724 196.725 287.382 177.199 306.909C157.672 326.435 126.014 326.435 106.488 306.909L71.1328 342.264Z"
                              fill="#00E9A3"></path>
                          <path
                              d="M353.974 59.421C275.869 -18.6835 149.236 -18.6835 71.1315 59.421C-6.97352 137.526 -6.97352 264.159 71.1315 342.264L106.486 306.909C47.9085 248.33 47.9085 153.355 106.486 94.777C165.065 36.198 260.04 36.198 318.618 94.777L353.974 59.421Z"
                              fill="#00E9A3"></path>
                          <path
                              d="M283.264 130.132C244.212 91.08 180.894 91.08 141.842 130.132C102.789 169.185 102.789 232.501 141.842 271.553L177.197 236.198C157.671 216.672 157.671 185.014 177.197 165.487C196.723 145.961 228.381 145.961 247.908 165.487L283.264 130.132Z"
                              fill="#00E9A3"></path>
                          <path
                              d="M353.974 59.421C275.869 -18.6835 149.236 -18.6835 71.1315 59.421C-6.97352 137.526 -6.97352 264.159 71.1315 342.264L106.486 306.909C47.9085 248.33 47.9085 153.355 106.486 94.777C165.065 36.198 260.04 36.198 318.618 94.777L353.974 59.421Z"
                              fill="white" fill-opacity="0.8"></path>
                          <path
                              d="M283.264 130.132C244.212 91.08 180.894 91.08 141.842 130.132C102.789 169.185 102.789 232.501 141.842 271.553L177.197 236.198C157.671 216.672 157.671 185.014 177.197 165.487C196.723 145.961 228.381 145.961 247.908 165.487L283.264 130.132Z"
                              fill="white" fill-opacity="0.8"></path>
                          <path
                              d="M588.112 264.179C588.112 289.108 570.321 301.466 553.276 301.466C534.739 301.466 522.381 288.362 522.381 267.588V169.364H483.815V273.554C483.815 312.865 506.188 335.131 538.361 335.131C562.864 335.131 580.122 322.24 587.58 303.916H589.284V333H626.678V169.364H588.112V264.179ZM660.335 394.364H698.9V307.219H700.498C706.571 319.151 719.248 335.876 747.373 335.876C785.939 335.876 814.809 305.301 814.809 251.395C814.809 196.849 785.086 167.233 747.267 167.233C718.396 167.233 706.358 184.598 700.498 196.423H698.261V169.364H660.335V394.364ZM698.154 251.182C698.154 219.435 711.791 198.874 736.613 198.874C762.288 198.874 775.498 220.713 775.498 251.182C775.498 281.864 762.075 304.236 736.613 304.236C712.004 304.236 698.154 282.929 698.154 251.182ZM971.167 212.616C965.841 184.918 943.681 167.233 905.329 167.233C865.912 167.233 839.065 186.622 839.172 216.878C839.065 240.741 853.767 256.509 885.194 263.007L913.106 268.866C928.127 272.169 935.159 278.241 935.159 287.51C935.159 298.696 923.014 307.112 904.69 307.112C887.005 307.112 875.5 299.442 872.197 284.74L834.591 288.362C839.385 318.405 864.633 336.196 904.797 336.196C945.706 336.196 974.576 314.996 974.683 283.994C974.576 260.663 959.555 246.388 928.66 239.676L900.748 233.71C884.129 229.982 877.524 224.229 877.63 214.747C877.524 203.668 889.775 195.997 905.862 195.997C923.653 195.997 933.028 205.692 936.011 216.452L971.167 212.616ZM1082.19 169.364H1049.92V130.159H1011.35V169.364H988.125V199.193H1011.35V290.173C1011.14 320.962 1033.51 336.089 1062.49 335.237C1073.46 334.918 1081.02 332.787 1085.18 331.402L1078.68 301.253C1076.55 301.786 1072.18 302.744 1067.39 302.744C1057.69 302.744 1049.92 299.335 1049.92 283.781V199.193H1082.19V169.364ZM1155.54 336.303C1181.21 336.303 1196.55 324.264 1203.58 310.521H1204.86V333H1241.94V223.483C1241.94 180.23 1206.67 167.233 1175.46 167.233C1141.05 167.233 1114.63 182.574 1106.1 212.403L1142.11 217.517C1145.95 206.331 1156.81 196.743 1175.67 196.743C1193.57 196.743 1203.37 205.905 1203.37 221.991V222.631C1203.37 233.71 1191.76 234.243 1162.89 237.332C1131.14 240.741 1100.78 250.223 1100.78 287.084C1100.78 319.257 1124.32 336.303 1155.54 336.303ZM1165.55 307.964C1149.46 307.964 1137.96 300.614 1137.96 286.445C1137.96 271.636 1150.85 265.457 1168.11 263.007C1178.23 261.622 1198.47 259.065 1203.48 255.017V274.3C1203.48 292.517 1188.77 307.964 1165.55 307.964ZM1404.05 212.616C1398.72 184.918 1376.56 167.233 1338.21 167.233C1298.79 167.233 1271.94 186.622 1272.05 216.878C1271.94 240.741 1286.65 256.509 1318.07 263.007L1345.99 268.866C1361.01 272.169 1368.04 278.241 1368.04 287.51C1368.04 298.696 1355.89 307.112 1337.57 307.112C1319.88 307.112 1308.38 299.442 1305.08 284.74L1267.47 288.362C1272.26 318.405 1297.51 336.196 1337.68 336.196C1378.58 336.196 1407.46 314.996 1407.56 283.994C1407.46 260.663 1392.43 246.388 1361.54 239.676L1333.63 233.71C1317.01 229.982 1310.4 224.229 1310.51 214.747C1310.4 203.668 1322.65 195.997 1338.74 195.997C1356.53 195.997 1365.91 205.692 1368.89 216.452L1404.05 212.616ZM1471.93 237.119C1471.93 213.469 1486.63 199.832 1507.3 199.832C1527.54 199.832 1539.47 212.723 1539.47 234.776V333H1578.04V228.81C1578.04 189.286 1555.66 167.233 1521.68 167.233C1496.54 167.233 1480.56 178.632 1472.99 197.169H1471.08V114.818H1433.36V333H1471.93V237.119Z"
                              fill="white"></path>
                      </svg>
                      <span>Geolocation</span>
                  </div>
              </div>
              <div class="content-info">
                  <div class="instructions">
                    <h4>Based on your location, you are close to the <span>${metadata?.geoip_region_name}</span> Edge and to customize the message below, click the <span>Update Message</span> button.</h4>
                  </div>
                  <h2 id="info-message"></h2>
                  <p>Region: ${metadata?.geoip_region}</p>
                  <p>City: ${metadata?.geoip_city}</p>
                  <div class="content-actions">
                      <button onclick="window.location.href='/update-message'">Update Message</button>
                  </div>
              </div>
          </div>
          <div class="footer">
              <a href="https://www.azion.com/en/documentation/" target="_blank">
                  <h1>Docs</h1>
                  <p>
                      Besides providing structure, it allows interactions to occur with the surface of the element, thus
                      enabling it to have states.
                  </p>
              </a>
              <a href="https://medium.com/aziontech" target="_blank">
                  <div>
                      <h1>Medium</h1>
                      <p>
                          Dive deep into our platform's use cases on Medium and join a community where developers connect,
                          collaborate, and innovate.
                      </p>
                  </div>
              </a>
              <a href="https://twitter.com/aziontech" target="_blank">
                  <div>
                      <h1>X (formerly Twitter)</h1>
                      <p>Explore our features in-depth and find out what's new on our platform.</p>
                  </div>
              </a>
              <a href="https://discord.gg/Yp9N7RMVZy" target="_blank">
                  <div>
                      <h1>Discord</h1>
                      <p>A space for developers to connect, get involved and collaborate.</p>
                  </div>
              </a>
          </div>
      </section>
      <script type="application/javascript" defer>
  
          window.onload = async function () {
              await getMessage();
          }
  
          async function getMessage() {
              
              let response = await fetch("/api/message", {
                  method: 'GET',
                  headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                  }
              });
  
              let responseJson = await response.json();
  
              if (response?.status !== 200) {
                  alert("Something went wrong, check the console for more details");
                  console.log(responseJson);
              } else {
                  document.getElementById("info-message").innerText = responseJson?.message;
              }
          }
      </script>
  </body>
  
  </html>
    `;
};
