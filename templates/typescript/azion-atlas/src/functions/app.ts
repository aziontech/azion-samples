export const AppPageHandler = async (request: any, extras: any) => {
  const page = `
  <!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Atlas MongoDB Sample</title>
    <meta name="description" content="Azion Template Atlas MongoDB" />
      <style>
      *, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: "Roboto", sans-serif;}h1 {margin: 0;padding: 0;}a {color: inherit;display: block;border-radius: 0.25rem;background: transparent;border: 1px solid #363636ff;transition: background 0.2s, border 0.2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, 0.15);border: 1px solid #36363626;}p {margin: 0;opacity: 0.6;font-size: 0.8rem;line-height: 1.5;max-width: 40ch;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 6rem 0;flex-direction: column;width: 80vw;}.content::after {content: "";left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: "Inter var experimental", "Inter var", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: 0.7rem;margin-top: 0.7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {display: flex;justify-content: center;gap: 10px; align-items: center;}.content-info {display: flex;flex-direction: column;gap: 20px;margin-top: 20px;align-items: center;}.content-info h2 {color: #ef6537;font-weight: 900;font-size: 24pt;text-align: center;}.content-info .instructions {max-width: 95%;display: flex;justify-content: center;}.content-info .instructions h4 {font-size: 14pt;text-align: center;}.content-info .instructions span {color: #ef6537;font-weight: 500;font-size: 14pt;}.content-actions {padding: 10px 0;}.content-actions button {cursor: pointer;outline: none;padding: 10px 15px;background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;}@media only screen and (min-width: 576px) {section {padding: 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}.content-info .instructions {max-width: 60%;}} #users-list button {cursor: pointer;outline: none;margin: 0 0 4px 0; padding: 2px 5px; color: white; background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;} #users-list { padding: 0;} input { display: block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; border: 1px solid black; border-radius: .25rem; }
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
<svg
   width="24.987495mm"
   height="38.862499mm"
   viewBox="0 0 26.987495 42.862499"
   version="1.1"
   id="svg5"
   xml:space="preserve"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="mm"
     showgrid="false" /><defs
     id="defs2" /><g
     inkscape:label="Camada 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(-78.407556,-14.702681)"><image
       width="26.987499"
       height="42.862499"
       preserveAspectRatio="none"
       xlink:href="data:image/png;base64,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
AElFTkSuQmCC
"
       id="image273"
       x="78.407555"
       y="14.702682" /></g>
</svg>
                  <span>MongoDB</span>
                  </div>
              </div>
              <div class="content-info">
                  <div class="instructions">
                    <h4>This is a sample about how to use Altas MongoDB on Edge</h4>
                  </div>
                  <h2 id="info-message"></h2>
                  
                  <div class="form-input">
                    <input id="form-name" placeholder="Name" />
                  </div>
                  <div class="form-input">
                    <input id="form-email" placeholder="Email" />
                  </div>
                  <div class="form-input">
                    <input id="form-username" placeholder="Username" />
                  </div>
                  <div class="content-actions">
                      <button onclick="createUser()">Add new user </button>
                  </div>

                  <div class="instructions">
                    <h4>List of Users</h4>
                  </div>
                  <div class="users">
                    <ul id="users-list">
                      <!-- content here -->
                    </ul>
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
        /** start loading data */
        window.onload = async function () {
          await getUsers();
        }

        /** get list of users */ 
        async function getUsers() {
          const response = await fetch("/api", {
              method: 'GET',
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
              }
          });

          let users = await response.json();

          if (response?.status !== 200) {
            alert("Something went wrong, check the console for more details");
          } else {
            let list = [];
            users.forEach(u => {
              list.push('<li>' + u.name +  \`<button style="margin-left: .5rem" onclick="deleteUser('\${u._id}')"> delete </button>  </li>\`);
            });
            document.getElementById("users-list").innerHTML = list.join('');
          }
        }

        /** create user */
        async function createUser() {
          let form = {
            name: document.getElementById("form-name").value.substring(0, 50),
            email: document.getElementById("form-email").value.substring(0, 50),
            username: document.getElementById("form-username").value.substring(0, 50),
          };

          let response = await fetch("/api", {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
          });

          await getUsers();
        }

        /** delete user */
        async function deleteUser(id) {
          let response = await fetch("/api", {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
          });

          await getUsers();
        }
      </script>
  </body>
  
  </html>
  `;

  return new Response(page, {
    headers: {
      'content-type': 'text/html; charset=UTF-8;',
    },
    status: 200,
  });
};
