use base64::prelude::*;
use js_sys;
use js_sys::JsString;
use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use web_sys::{FetchEvent, Response};
use yew::Properties;
use yew::prelude::*;
use yew::LocalServerRenderer;
use std::cmp::PartialEq;


#[derive(Properties, Clone, PartialEq)]
struct AppProperties {
    name: String,
    now: JsString,
}

#[function_component]
fn App(prop: &AppProperties) -> Html {
    
    html! {
        <html>
            <head>
                <title>{ "Rust Wasm on The Edge!" }</title>
            </head>
            <style>
                { "*, *::before, *::after {box-sizing: border-box;margin: 0;font-weight: normal;}body {padding: 0;margin: 0;background: linear-gradient(180deg, transparent, #1e1e1e) #221f1e;color: #ffffff;font-family: 'Roboto', sans-serif;}h1 {margin: 0;padding: 0;}a {color: inherit;display: block;border-radius: 0.25rem;background: transparent;border: 1px solid #363636ff;transition: background 0.2s, border 0.2s;padding: 1.5rem;text-decoration: none;margin-right: 0;margin-bottom: 1.5rem;max-width: 320px;text-align: center;}a:last-child {margin-right: 0;}a:hover {background: rgba(180, 185, 188, 0.15);border: 1px solid #36363626;}p {margin: 0;opacity: 0.6;font-size: 0.8rem;line-height: 1.5;max-width: 40ch;}section {display: flex;flex-direction: column;justify-content: space-between;align-items: center;padding: 2rem;}.header {margin-right: auto;}.content {display: flex;align-items: center;color: #ffffff;margin: 5rem 0;flex-direction: column;width: 80vw;}.content::after {content: '';left: 50%;position: absolute;filter: blur(45px);transform: translateZ(0);background: conic-gradient(from 180deg at 50% 50%, #502e2233 0deg, #502e2233 55deg, #502e2233 120deg, #502e2233 160deg, transparent 360deg);width: 240px;height: 180px;z-index: -1;}.content span {font-weight: 500;font-size: 2rem;font-family: 'Inter var experimental', 'Inter var', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;}.footer {display: flex;flex-direction: column;justify-content: space-between;}.footer h1 {font-weight: 500;font-size: 1.2rem;margin-bottom: 0.7rem;margin-top: 0.7rem;}.brand {display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 15px;}.brand-image {display: flex;justify-content: center;gap: 10px;}.content-info {display: flex;flex-direction: column;gap: 20px;margin-top: 20px;align-items: center;}.content-info h2 {color: #ef6537;font-weight: 900;font-size: 24pt;text-align: center;}.content-info .instructions {display: flex;justify-content: center;}.content-info .instructions h4 {font-size: 14pt;text-align: center;}.content-info .instructions span {color: #ef6537;font-weight: 500;font-size: 14pt;}.content-actions {padding: 10px 0;}.content-actions button {cursor: pointer;outline: none;padding: 10px 15px;background-color: #ef6537;border: 0;border-radius: 7px;font-size: 11pt;}@media only screen and (min-width: 576px) {section {padding: 6rem;min-height: calc(100vh - 15rem);}.footer {flex-direction: row;}a {margin-right: 2.5rem;margin-bottom: 0;text-align: left;}}" }
            </style>
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
                        <svg width="200px" height="200px" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m47.781 31.608-1.343-.832a18.57 18.57 0 0 0-.038-.391l1.154-1.077a.46.46 0 0 0-.153-.771l-1.476-.552a16.798 16.798 0 0 0-.115-.381l.92-1.279a.462.462 0 0 0-.3-.727l-1.557-.253c-.06-.118-.123-.234-.187-.35l.654-1.435a.46.46 0 0 0-.437-.654l-1.579.055a12.482 12.482 0 0 0-.25-.302l.363-1.539a.461.461 0 0 0-.556-.556l-1.538.362c-.1-.084-.2-.167-.303-.25l.055-1.578a.46.46 0 0 0-.654-.437l-1.435.654a16.712 16.712 0 0 0-.35-.188l-.253-1.556a.462.462 0 0 0-.726-.301l-1.28.92a14.31 14.31 0 0 0-.38-.115l-.552-1.476a.461.461 0 0 0-.771-.154l-1.077 1.156c-.13-.014-.26-.028-.391-.038l-.832-1.344a.462.462 0 0 0-.786 0l-.832 1.344c-.13.01-.261.024-.391.038l-1.077-1.155a.464.464 0 0 0-.771.153l-.552 1.476c-.128.037-.255.076-.38.116l-1.28-.921a.46.46 0 0 0-.727.3l-.254 1.557c-.117.061-.233.124-.35.188l-1.434-.654a.46.46 0 0 0-.654.436l.055 1.58c-.102.082-.203.165-.303.25l-1.538-.363a.464.464 0 0 0-.557.556l.363 1.539c-.085.1-.168.2-.25.302l-1.579-.055a.462.462 0 0 0-.437.654l.654 1.436c-.063.115-.126.231-.187.35l-1.556.252a.462.462 0 0 0-.301.727l.92 1.279c-.04.126-.078.253-.115.38l-1.476.553a.462.462 0 0 0-.153.771l1.155 1.077c-.015.13-.028.26-.039.391l-1.343.832a.462.462 0 0 0 0 .786l1.343.831c.011.131.024.262.039.392l-1.155 1.077a.462.462 0 0 0 .153.771l1.476.552c.037.128.076.255.116.38l-.921 1.28a.462.462 0 0 0 .301.726l1.556.253c.061.118.123.235.188.35l-.655 1.435a.462.462 0 0 0 .437.654l1.579-.055c.082.103.165.203.25.303l-.363 1.539a.46.46 0 0 0 .557.555l1.538-.362c.1.085.201.167.303.249l-.055 1.58a.461.461 0 0 0 .654.436l1.435-.654c.115.064.232.127.35.188l.253 1.555a.461.461 0 0 0 .727.302l1.279-.922c.126.04.253.08.38.116l.552 1.476a.46.46 0 0 0 .771.153l1.078-1.155c.13.015.26.028.391.04l.832 1.343a.463.463 0 0 0 .786 0l.831-1.344c.131-.011.262-.024.392-.039l1.077 1.155a.46.46 0 0 0 .77-.153l.553-1.476c.127-.036.254-.076.38-.116l1.28.922a.463.463 0 0 0 .726-.302l.254-1.556c.117-.06.233-.124.349-.187l1.435.654a.461.461 0 0 0 .654-.437l-.055-1.58c.102-.08.203-.163.303-.248l1.538.362a.46.46 0 0 0 .556-.555l-.362-1.539c.084-.1.167-.2.249-.303l1.58.055a.46.46 0 0 0 .436-.654l-.654-1.435c.064-.115.126-.232.187-.35l1.556-.253a.46.46 0 0 0 .301-.726l-.92-1.28a17.5 17.5 0 0 0 .115-.38l1.476-.552a.46.46 0 0 0 .153-.771l-1.155-1.077c.014-.13.027-.261.039-.392l1.343-.831a.462.462 0 0 0 0-.786zM38.79 42.752a.952.952 0 0 1 .399-1.861.952.952 0 0 1-.4 1.861zm-.457-3.087a.866.866 0 0 0-1.028.666l-.477 2.226A11.649 11.649 0 0 1 32 43.597c-1.76 0-3.43-.39-4.929-1.087l-.477-2.225a.866.866 0 0 0-1.028-.667l-1.965.422a11.68 11.68 0 0 1-1.016-1.197h9.561c.108 0 .18-.02.18-.118v-3.382c0-.099-.072-.118-.18-.118H29.35V33.08h3.024c.276 0 1.476.079 1.86 1.613.12.471.384 2.006.564 2.497.18.551.912 1.652 1.692 1.652h4.764a.977.977 0 0 0 .173-.017c-.33.449-.693.874-1.083 1.27l-2.01-.431zm-13.223 3.04a.952.952 0 0 1-.399-1.861.95.95 0 0 1 .398 1.862zm-3.627-14.707a.95.95 0 1 1-1.737.771.95.95 0 1 1 1.737-.771zm-1.115 2.643 2.047-.91a.868.868 0 0 0 .44-1.145l-.421-.953h1.658v7.474h-3.345a11.714 11.714 0 0 1-.38-4.466zm8.983-.726v-2.203h3.948c.204 0 1.44.236 1.44 1.16 0 .767-.948 1.043-1.728 1.043h-3.66zM43.7 31.898c0 .292-.011.581-.033.868h-1.2c-.12 0-.168.08-.168.197v.551c0 1.298-.732 1.58-1.373 1.652-.61.068-1.288-.256-1.371-.63-.36-2.025-.96-2.458-1.908-3.206 1.176-.746 2.4-1.848 2.4-3.323 0-1.593-1.092-2.596-1.836-3.088-1.044-.688-2.2-.826-2.512-.826H23.285a11.684 11.684 0 0 1 6.545-3.694l1.463 1.535c.331.346.88.36 1.225.028l1.638-1.566a11.71 11.71 0 0 1 8.009 5.704l-1.121 2.532a.869.869 0 0 0 .44 1.145l2.159.958c.037.383.056.77.056 1.163zM31.294 19.093a.95.95 0 0 1 1.344.031.952.952 0 0 1-.032 1.346.949.949 0 0 1-1.343-.032.953.953 0 0 1 .031-1.345zm11.123 8.951a.95.95 0 1 1 1.737.772.95.95 0 1 1-1.737-.772z" fill="#fff"/></svg>
                        <h1>{ "Hello, world!!! How are you, "} {&prop.name} {"?"}</h1>
                        <h3>{ "The time now is: " }{ &prop.now }</h3>
                    </div>
                    <div class="footer">
                        <a href="https://www.azion.com/en/documentation/" target="_blank">
                            <h1>{ "Docs" }</h1>
                            <p>
                            { "Besides providing structure, it allows interactions to occur with the surface of the element, thus enabling it to have states."}
                            </p>
                        </a>
                        <a href="https://medium.com/aziontech" target="_blank">
                            <div>
                                <h1>{ "Medium" }</h1>
                                <p>{ "Dive deep into our platform's use cases on Medium and join a community where developers connect, collaborate, and innovate." }</p>
                            </div>
                        </a>
                        <a href="https://twitter.com/aziontech" target="_blank">
                            <div>
                                <h1>{ "X (formerly Twitter)" }</h1>
                                <p>{ "Explore our features in-depth and find out what's new on our platform." }</p>
                            </div>
                        </a>
                        <a href="https://discord.gg/Yp9N7RMVZy" target="_blank">
                            <div>
                                <h1>{ "Discord" }</h1>
                                <p>{ "A space for developers to connect, get involved and collaborate." }</p>
                            </div>
                        </a>
                    </div>
                </section>
            </body>
        </html>
    }
}

#[wasm_bindgen(js_name = fetch_listener)]
pub async fn listener(event: &FetchEvent) -> Response {

    let name = event
        .request()
        .headers()
        .get("X-Name")
        .ok()
        .flatten()
        .unwrap_or(String::from("John Smith"));

    let renderer = LocalServerRenderer::<App>::with_props(AppProperties {
        name,
        now: js_sys::Date::new_0().to_json()
    });

    let body = renderer.render().await;

    let response = Response::new_with_opt_str(Some(body.as_str())).unwrap();

    response.headers().set("Content-Type", "text/html").unwrap();

    response
}

