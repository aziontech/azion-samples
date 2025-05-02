import Image from "next/image";


export default function Home() {
  return (
    <section>
      <div className="header">
        <Image src="azion.svg" alt="Azion Logo" width={100} height={24} />
      </div>
      <div className="content space-y-6">
        <Image src="next.svg" alt="Next Logo" width={300} height={200} />
        <h1>Next.js (Pages Router) - Node Runtime</h1>
      </div>
      <div className="footer">
        <a
          href="https://www.azion.com/en/documentation/"
          rel="noreferrer"
          target="_blank"
        >
          <h1>Docs</h1>
          <p>
            Besides providing structure, it allows interactions to occur with
            the surface of the element, thus enabling it to have states.
          </p>
        </a>
        <a href="https://medium.com/aziontech" target="_blank" rel="noreferrer">
          <div>
            <h1>Medium</h1>
            <p>
              Dive deep into our platform&apos;s use cases on Medium and join a
              community where developers connect, collaborate, and innovate.
            </p>
          </div>
        </a>
        <a
          href="https://twitter.com/aziontech"
          target="_blank"
          rel="noreferrer"
        >
          <div>
            <h1>X (formerly Twitter)</h1>
            <p>
              Explore our features in-depth and find out what&apos;s new on our
              platform.
            </p>
          </div>
        </a>
        <a
          href="https://discord.gg/Yp9N7RMVZy"
          target="_blank"
          rel="noreferrer"
        >
          <div>
            <h1>Discord</h1>
            <p>
              A space for developers to connect, get involved and collaborate.
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
