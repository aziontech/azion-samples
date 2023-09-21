import "./assets/main.css";
import azionLogo from "./assets/azion.svg";
import reactLogo from "./assets/react.svg";

function App() {
  return (
    <section>
      <div class="header">
        <img src={azionLogo} width="100" height="24" />
      </div>
      <div class="content">
        <img src={reactLogo} height="120" />
      </div>
      <div class="footer">
        <a href="https://www.azion.com/en/documentation/" target="_blank">
          <h1>Docs</h1>
          <p>
            Besides providing structure, it allows interactions to occur with the surface of the element, thus enabling it to have states.
          </p>
        </a>
        <a href="https://medium.com/aziontech" target="_blank">
          <div>
            <h1>Medium</h1>
            <p>
              Dive deep into our platform's use cases on Medium and join a community where developers connect, collaborate, and innovate.
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
  );
}

export default App;
