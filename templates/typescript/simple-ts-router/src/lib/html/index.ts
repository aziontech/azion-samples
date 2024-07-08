export const indexHTML = () => {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Azion Edge</title>
      <meta name="description" content="Simple Typescript" />
      <style>
      *, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: "Roboto", sans-serif;}h1 {margin: 0;padding: 0;}a {color: inherit;display: block;border-radius: 0.25rem;background: transparent;border: 1px solid #363636ff;transition: background 0.2s, border 0.2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, 0.15);border: 1px solid #36363626;}p {margin: 0;opacity: 0.6;font-size: 0.8rem;line-height: 1.5;max-width: 40ch;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 6rem 0;flex-direction: column;width: 80vw;}.content::after {content: "";left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: "Inter var experimental", "Inter var", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: 0.7rem;margin-top: 0.7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {display: flex;justify-content: center;gap: 10px;}.content-info {display: flex;flex-direction: column;gap: 20px;margin-top: 20px;align-items: center;}.content-info h2 {color: #ef6537;font-weight: 900;font-size: 24pt;text-align: center;}.content-info .instructions {display: flex;justify-content: center;}.content-info .instructions h4 {font-size: 14pt;text-align: center;}.content-info .instructions span {color: #ef6537;font-weight: 500;font-size: 14pt;}.content-actions {padding: 10px 0;}.content-actions button {cursor: pointer;outline: none;padding: 10px 15px;background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;}@media only screen and (min-width: 576px) {section {padding: 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}}
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
                    <div style="width: 100px; height: 100px;">
                        <svg height="100" viewBox="0 0 640 640" width="100" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h640v640h-640z" fill="#017acb"/>
                        <path d="m307.3 237h30.7v53h-83v235.8l-2.2.6c-3 .8-42.5.8-51-.1l-6.8-.6v-235.7h-83v-53l26.3-.3c14.4-.2 51.4-.2 82.2 0s69.8.3 86.8.3zm234.3 263.8c-12.2 12.9-25.3 20.1-47.1 26-9.5 2.6-11.1 2.7-32.5 2.6s-23.1-.1-33.5-2.8c-26.9-6.9-48.6-20.4-63.4-39.5-4.2-5.4-11.1-16.6-11.1-18 0-.4 1-1.3 2.3-1.9s4-2.3 6.2-3.6 6.2-3.7 8.9-5.1 10.5-6 17.3-10.1 13-7.4 13.7-7.4 2 1.4 3 3.1c6 10.1 20 23 29.9 27.4 6.1 2.6 19.6 5.5 26.1 5.5 6 0 17-2.6 22.9-5.3 6.3-2.9 9.5-5.8 13.3-11.6 2.6-4.1 2.9-5.2 2.8-13 0-7.2-.4-9.2-2.4-12.5-5.6-9.2-13.2-14-44-27.6-31.8-14.1-46.1-22.5-57.7-33.8-8.6-8.4-10.3-10.7-15.7-21.2-7-13.5-7.9-17.9-8-38-.1-14.1.2-18.7 1.7-23.5 2.1-7.2 8.9-21.1 12-24.6 6.4-7.5 8.7-9.8 13.2-13.5 13.6-11.2 34.8-18.6 55.1-19.3 2.3 0 9.9.4 17 .9 20.4 1.7 34.3 6.7 47.7 17.4 10.1 8 25.4 26.8 23.9 29.3-1 1.5-40.9 28.1-43.5 28.9-1.6.5-2.7-.1-4.9-2.7-13.6-16.3-19.1-19.8-32.3-20.6-9.4-.6-14.4.5-20.7 4.7-6.6 4.4-9.8 11.1-9.8 20.4.1 13.6 5.3 20 24.5 29.5 12.4 6.1 23 11.1 23.8 11.1 1.2 0 26.9 12.8 33.6 16.8 31.2 18.3 43.9 37.1 47.2 69.5 2.4 24.4-4.5 46.7-19.5 62.5z" fill="#fff"/></svg>
                    </div>
                  </div>
              </div>
              <div class="content-info">
                  <div class="instructions">
                    <h4>Template Simple Typescript Router!</h4>
                  </div>
                  <h2 id="info-message"></h2>
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
