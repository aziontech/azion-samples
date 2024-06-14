export const indexHTML = () => {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Drizzle + TiDB Sample</title>
      <meta name="description" content="Drizzle + TiDB Sample" />
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
                  </div>
              </div>
              <div class="content-info">
                  <div class="instructions">
                      <h4>This is an example for creating, retrieving, updating and deleting items in a TiDB table called "posts", using Drizzle as ORM.</h4>
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
                  return;
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
                return;
            }
            element.parentElement.parentElement.parentElement.remove();
            alert("You've successfully deleted your post from your TiDB table!")
          }
  
          async function updateItem(id) {
              const post = document.getElementById(\`text-post-\${id}\`).value;
              if(post?.length < 1){
                alert("Please your post must have at least 2 characters!");
                return;
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
              alert("You've successfully updated your post in your TiDB table!")
          }
  
      </script>
  </body>
  
  </html>
    `;
};
