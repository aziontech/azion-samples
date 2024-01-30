# Node.js Buffer module through polyfills

This is a JavaScript project that utilizes the Node's fs module to read files synchronously from the file system. The content of the informed file is placed inside the **edge function**, that will run on the edge. 

**Each worker has a max limit of 20 MB**.

## How it works

This function reads the contents of a static HTML file (static-html/index.html) and returns a new Response object with the read data. The response object is configured with a content-type header set to text/html;charset=UTF-8, indicating that the response contains HTML content.

## Usage

To use this project, simply call the myWorker function with an event object. The function will read the static HTML file and return a response object with the file's contents.

```
myWorker(event);
```
