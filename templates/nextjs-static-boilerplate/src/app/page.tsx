import Image from "next/image";

export default function Home() {
  return (
    <section>
      <div className="header">
        <Image src="/azion.svg" alt="Azion Logo" width={100} height={24} priority />
      </div>
      <div className="content-global">
        <Image src="/next.svg" alt="Next Logo" width={200} height={48} priority />
        <h1>Welcome to Next.js Static Boilerplate</h1>
        <p className="instructions">
          To get started, open the directory <code>src/app/page.tsx</code> in your project.
          <br />
          <br />
          <strong>Code Challenge:</strong> Tweak the &quot;Welcome to Next.js Static Boilerplate&quot; message above.
        </p>
      </div>
      <div className="footer">
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
              Dive deep into our platform&apos;s use cases on Medium and join a community where developers connect, collaborate, and innovate.
            </p>
          </div>
        </a>
        <a href="https://twitter.com/aziontech" target="_blank">
          <div>
            <h1>X (formerly Twitter)</h1>
            <p>Explore our features in-depth and find out what&apos;s new on our platform.</p>
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
