async function handleRequest(request) {
    // You can either retrieve your .wasm file through fetch, for instance :
    // let wasmResponse = await fetch("http://somedomain/yourfile.wasm")
    // or embed the binary in the code, as shown below.
    const wasmCode = new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 7, 13, 1, 9, 105, 110, 99, 114, 101,
        109, 101, 110, 116, 0, 0, 10, 9, 1, 7, 0, 32, 0, 65, 1, 106, 11,
    ]);

    const wasmModule = new WebAssembly.Module(wasmCode);
    const wasmInstance = new WebAssembly.Instance(wasmModule);
    const increment = wasmInstance.exports.increment;
    let value = 0;

    if (request.headers.has("value")) {
        let number = request.headers.get("value");
        if (!isNaN(number)) {
            value = parseInt(number);
        }
    }
    let incremented = increment(value);
    return new Response(
        "incrementing " + value + " we have " + incremented
    );
}
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});