export const indexHTML = () => {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Prisma Accelerate</title>
      <meta name="description" content="Azion Template Prisma Accelerate" />
      <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
      <style>
          *, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: "Roboto", sans-serif;}h1 {margin: 0;padding: 0;}a:not(#doclink) {color: inherit;display: block;border-radius: 0.25rem;background: transparent;border: 1px solid #363636ff;transition: background 0.2s, border 0.2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, 0.15);border: 1px solid #36363626;}p {margin: 0;opacity: 0.6;font-size: 0.8rem;line-height: 1.5;max-width: 40ch;}button {outline: none;cursor: pointer;border: none;background-color: transparent;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 6rem 0;flex-direction: column;width: 80vw;}.content::after {content: "";left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: "Inter var experimental", "Inter var", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: 0.7rem;margin-top: 0.7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {} .brand-image img {height: 2.8rem} .content-info {display: flex;flex-direction: column;gap: 20px;margin-top: 20px;align-items: center;min-width: 300px;}.content-info h2 {color: #ef6537;font-weight: 900;font-size: 24pt;text-align: center;}.content-info .instructions {max-width: 95%;display: flex;justify-content: center;}.content-info .instructions h4 {font-size: 14pt;text-align: center;}.content-info .instructions span {color: #ef6537;font-weight: 500;font-size: 14pt;}ol {padding: 0;margin: 0;max-width: 700px;position: relative;}ol::before {content: '';width: 0.5rem;height: 100%;position: absolute;top: 0;left: 8%;background: #3F51B5;z-index: -1;}li {padding: 0.5rem 1.5rem 1rem;border-radius: 1.5rem;background: #3F51B5;}.list-content {display: flex;flex-direction: row;justify-content: space-between;gap: 15px;min-width: 90%;}.list-content textarea {background-color: transparent;font-size: 13pt;color: #fff;border: 0;min-width: 80%;resize: none;}.list-content div.actions {display: flex;}div.control button {background: #ef6537;padding: 10px 12px;border-radius: 10px;display: flex;justify-content: center;gap: 5px;color: #fff;font-size: 13pt;}div.control .icons {width: 20px;height: 20px;}div.control .icons:hover {color: #fff;}div.actions button {font-size: 16pt;color: #fff;}.icons {display: block;height: 18px;width: 18px;color: #fff;}.icons:hover {color: #afacac;font-weight: bold;}li+li {margin-top: 1rem;}::marker {font-weight: 600;color: #ef6537;font-size: 1.8rem;}textarea::placeholder {color: #dfdddd;}@media only screen and (min-width: 576px) {section {padding: 3rem 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a:not(#doclink) {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}.content-info .instructions {max-width: 60%;}.list-content {min-width: 600px;}} #doclink{color:inherit}
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
                    <svg fill="none" height="98" viewBox="1.372 -.18543865 324.553 128.18543865" width="250" xmlns="http://www.w3.org/2000/svg">
                        <g fill="#0c344b">
                            <path d="m199.202 85.75h8.638v-31.662h-8.638zm-.367-39.847c0-2.813 1.567-4.219 4.701-4.219 3.133 0 4.701 1.406 4.701 4.219 0 1.341-.392 2.384-1.175 3.13-.784.746-1.959 1.118-3.526 1.118-3.134 0-4.701-1.416-4.701-4.248z"/>
                            <path clip-rule="evenodd" d="m164.253 67.483c2.786-2.36 4.178-5.767 4.178-10.223 0-4.286-1.307-7.51-3.922-9.672-2.615-2.16-6.433-3.242-11.456-3.242h-13.225v41.404h8.779v-14.727h3.767c5.135 0 9.095-1.179 11.879-3.54zm-12.757-3.653h-2.889v-12.29h3.993c2.398 0 4.158.49 5.282 1.472 1.123.982 1.685 2.502 1.685 4.56 0 2.038-.67 3.591-2.011 4.658s-3.36 1.6-6.06 1.6z" fill-rule="evenodd"/>
                            <path d="m194.62 53.748c-.774-.17-1.746-.255-2.917-.255-1.964 0-3.781.543-5.451 1.628a11.908 11.908 0 0 0 -3.98 4.291h-.424l-1.275-5.324h-6.542v31.662h8.638v-16.114c0-2.549.769-4.532 2.307-5.948 1.54-1.416 3.687-2.124 6.444-2.124 1.001 0 1.85.095 2.549.283zm40.245 30.02c2.257-1.7 3.385-4.172 3.385-7.42 0-1.567-.273-2.917-.821-4.05-.547-1.133-1.398-2.133-2.549-3.002-1.151-.868-2.964-1.802-5.438-2.803-2.775-1.114-4.573-1.955-5.394-2.521s-1.233-1.236-1.233-2.011c0-1.378 1.275-2.067 3.824-2.067 1.434 0 2.841.217 4.219.65 1.378.436 2.861.992 4.447 1.672l2.605-6.23c-3.606-1.661-7.316-2.492-11.13-2.492-4.003 0-7.093.769-9.273 2.308-2.183 1.539-3.273 3.714-3.273 6.527 0 1.643.26 3.026.78 4.149.518 1.124 1.349 2.12 2.493 2.988 1.14.869 2.931 1.813 5.365 2.832 1.699.718 3.059 1.345 4.079 1.883 1.019.539 1.737 1.02 2.153 1.445.415.425.622.977.622 1.657 0 1.812-1.567 2.718-4.702 2.718-1.529 0-3.299-.255-5.309-.764-2.012-.51-3.819-1.142-5.424-1.898v7.137a22.275 22.275 0 0 0 4.56 1.373c1.624.312 3.587.468 5.891.468 4.492 0 7.867-.85 10.123-2.55zm37.604 1.982h-8.638v-18.493c0-2.284-.383-3.998-1.146-5.14-.766-1.142-1.969-1.714-3.612-1.714-2.208 0-3.813.812-4.814 2.436s-1.501 4.295-1.501 8.015v14.896h-8.638v-31.662h6.599l1.161 4.05h.482c.849-1.454 2.077-2.592 3.681-3.413 1.605-.821 3.446-1.232 5.523-1.232 4.739 0 7.948 1.549 9.629 4.645h.764c.85-1.473 2.101-2.615 3.753-3.427s3.516-1.218 5.593-1.218c3.587 0 6.302.921 8.142 2.761 1.841 1.841 2.761 4.791 2.761 8.85v20.646h-8.666v-18.493c0-2.284-.383-3.998-1.146-5.14-.766-1.142-1.969-1.714-3.612-1.714-2.114 0-3.695.756-4.744 2.266-1.047 1.511-1.571 3.908-1.571 7.193z"/>
                            <path clip-rule="evenodd" d="m318.222 81.445 1.671 4.305h6.032v-21.099c0-3.776-1.133-6.589-3.398-8.439-2.266-1.85-5.523-2.776-9.771-2.776-4.436 0-8.477.954-12.121 2.861l2.86 5.834c3.417-1.53 6.391-2.294 8.921-2.294 3.285 0 4.928 1.605 4.928 4.814v1.388l-5.494.17c-4.739.17-8.283 1.053-10.635 2.648-2.35 1.596-3.525 4.074-3.525 7.434 0 3.21.873 5.683 2.619 7.42 1.747 1.737 4.139 2.605 7.18 2.605 2.473 0 4.479-.354 6.017-1.062 1.539-.708 3.035-1.977 4.489-3.809zm-4.22-10.252 3.342-.113v2.605c0 1.908-.6 3.437-1.799 4.588-1.198 1.152-2.799 1.728-4.8 1.728-2.794 0-4.191-1.218-4.191-3.653 0-1.7.613-2.964 1.841-3.795 1.227-.83 3.096-1.284 5.607-1.36zm-218.269 30.336-57.479 17c-1.756.52-3.439-.999-3.07-2.77l20.534-98.34c.384-1.838 2.926-2.13 3.728-.427l38.02 80.736c.717 1.523-.101 3.319-1.733 3.801zm9.857-4.01-44.022-93.482v-.002a7.062 7.062 0 0 0 -6.019-4.022c-2.679-.156-5.079 1.136-6.433 3.335l-47.744 77.33a7.233 7.233 0 0 0 .084 7.763l23.338 36.152c1.391 2.158 3.801 3.407 6.306 3.407.71 0 1.424-.1 2.126-.308l67.744-20.036a7.424 7.424 0 0 0 4.66-4.028 7.264 7.264 0 0 0 -.04-6.11z" fill-rule="evenodd"/>
                        </g>
                    </svg>
                  </div>
              </div>
              <div class="content-info">
                  <div class="instructions">
                      <h4>This is an example for creating, retrieving, updating and deleting items with Prisma ORM and Accelerate.</h4>
                  </div>
                  <div class="control">
                      <button id="btn-new-post" onclick="createItemElement()">
                            <i class="icons" data-lucide="message-square-plus"></i>
                            Create new post!
                        </button>
                  </div>
                  <div class="list">
                      <ol reversed id="posts"></ol>
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
      <script src="https://unpkg.com/lucide@latest"></script>
      <script type="application/javascript" defer>
  
          window.onload = async function () {
              try {
                  await getMessage();
              } catch (error) {
                  alert("Something went wrong, check the console for more details");
                  console.log(error?.message);
              }
          }
  
          async function getMessage() {
  
              let response = await fetch("/api/posts", {
                  method: 'GET',
                  headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                  }
              })
              let responseJson = await response.json();
  
              if (response?.status !== 200) {
                  alert("Something went wrong, check the console for more details");
                  console.log(responseJson);
              }
              const { results } = responseJson;
              if (results?.length === 0) {
                  createItemElement();
                  return
              }
              let listBody = ""
              const items = results.forEach(item => {
                  let id = item?.id;
                  listBody += \`<li><div class=\"list-content\"><textarea class=\"textarea-post\" disabled type=\"text\" id=\"text-post-\${id}\">\${item?.message}</textarea><div class=\"actions\"><button id=\"btn-post-save-\${id}\" style=\"display: none;\" onclick=\"updateItem('\${id}')\"><i class=\"icons\" data-lucide="save"></i></button><button onclick=\"onEditElement(this, '\${id}')\"><i class=\"icons\" data-lucide="pencil"></i></button><button onclick=\"deleteItem(this, '\${id}')\"><i class=\"icons\" data-lucide="trash"></i></button></div></div></li>\`
              })
              document.getElementById("posts").innerHTML = listBody;
              lucide.createIcons();
              autoRowText();
          }
  
          function onEditElement(element, id) {
              document.getElementById(\`text-post-\${id}\`).removeAttribute('disabled');
              document.getElementById(\`text-post-\${id}\`).focus();
              document.getElementById(\`btn-post-save-\${id}\`).style.display = 'block';
          }
  
          function autoRowText() {
              const tx = document.getElementsByClassName("textarea-post");
              for (let i = 0; i < tx.length; i++) {
                  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
                  tx[i].addEventListener("input", (event) => onChangeInputTextArea(event), false);
              }
          }
  
          function onChangeInputTextArea(event) {
            const el = event?.target;
            el.style.height = "5px";
            el.style.height = (el.scrollHeight) + "px";
          }

          function createItemElement() {
              const posts = document.getElementById("posts");
              const id = 'new-post';
              const items = posts.innerHTML;
              posts.innerHTML = \`<li><div class=\"list-content\"><textarea oninput="onChangeInputTextArea(event)" placeholder=\"Enter your new post...\" type=\"text\" id=\"text-new-post\"></textarea><div class=\"actions\"><button id=\"btn-post-save-\${id}\" onclick=\"saveNewPost()\"><i class=\"icons\" data-lucide="save"></i></button><button onclick=\"cancelNewPost(this)\"><i class=\"icons\" data-lucide="x-circle"></i></button></div></div></li>\${items}\`
              lucide.createIcons();
              document.getElementById("btn-new-post").setAttribute('disabled', true);
              document.getElementById("text-new-post").focus();
          }
  
  
          function cancelNewPost(target) {
              target.parentElement.parentElement.parentElement.remove();
              document.getElementById("btn-new-post").removeAttribute('disabled');
          }
  
          async function saveNewPost() {
              const post = document.getElementById('text-new-post').value;

              if(post?.length < 1){
                alert("Please your post must have at least 2 characters!");
                return
              }
  
              let response = await fetch("/api/posts", {
                  method: 'POST',
                  headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ post })
              });
  
              let responseJson = await response.json();
  
              if (response?.status !== 200) {
                  alert("Something went wrong, check the console for more details");
                  console.log(responseJson);
                  return
              } 
              await getMessage();
              document.getElementById("btn-new-post").removeAttribute('disabled');
              alert("You have successfully saved your post to your database!")
          }
  
          async function deleteItem(element, id) {
            let response = await fetch(\`/api/posts/\${id}\`, {
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            let responseJson = await response.json();

            if (response?.status !== 200) {
                alert("Something went wrong, check the console for more details");
                console.log(responseJson);
            }
            element.parentElement.parentElement.parentElement.remove();
            alert("You've successfully deleted your post from your Prisma!")
          }
  
          async function updateItem(id) {
              const post = document.getElementById(\`text-post-\${id}\`).value;
              if(post?.length < 1){
                alert("Please your post must have at least 2 characters!");
                return
              }
  
              let response = await fetch(\`/api/posts/\${id}\`, {
                  method: 'PUT',
                  headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ post })
              });
  
              let responseJson = await response.json();
  
              if (response?.status !== 200) {
                  alert("Something went wrong, check the console for more details");
                  console.log(responseJson);
                  return
              }
              await getMessage();
              alert("You've successfully updated your post in your Prisma DB table!")
          }
  
      </script>
  </body>
  
  </html>
    `;
};
