export const updateMessageHTML = (location) => {
  return `
  <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Upstash Geolocation - Update Message</title>
        <meta name="description" content="Azion Template Upstash Geolocation" />
        <style>
            *, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: 'Roboto', sans-serif;}h1 {margin: 0;padding: 0;}a {color: inherit;display: block;border-radius: .25rem;background: transparent;border: 1px solid #363636ff;transition: background .2s, border .2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, .15);border: 1px solid #36363626;}p {margin: 0;opacity: .6;font-size: .8rem;line-height: 1.5;max-width: 40ch;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 6rem 0;flex-direction: column;width: 80vw;}.content::after {content: "";left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: "Inter var experimental", "Inter var", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: .7rem;margin-top: .7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {display: flex;justify-content: center;gap: 10px;}.content-info {display: flex;flex-direction: column;gap: 15px;margin-top: 10px;align-items: center;}.content-info h2 {color: #ef6537;font-weight: 900;}.content-info textarea {border: 0;border-radius: 8px;padding: 10px;font-size: 12pt;}.content-actions {padding: 10px 0;}.content-actions button {cursor: pointer;outline: none;padding: 10px 15px;background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;}@media only screen and (min-width: 576px) {section {padding: 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}}
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
                <div class="content-info">
                    <h2>Enter your new greeting message for the ${location} location.</h2>
                    <form action="#" id="form-update">
                        <textarea id="form-message" name="form-message" rows="4" cols="50" maxlength="280" placeholder="Write your message here... (up to 280 characters)"></textarea>
                    </form>
                    <div class="content-actions">
                        <button onclick="submitForm()">Update Message</button>
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

            async function submitForm() {
                let formData = {
                    message: document.getElementById("form-message").value.substring(0, 280)
                };

                let response = await fetch("/api/message", {
                    method: 'PUT',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                let responseJson = await response.json();

                if (response?.status !== 200) {
                    alert("Something went wrong, check the console for more details");
                    console.log(responseJson);
                } else {
                    alert("Message saved!");
                    document.getElementById("form-message").value = "";
                    window.location.href = "/";
                }
            }
        </script>
    </body>

</html>
    `;
};
