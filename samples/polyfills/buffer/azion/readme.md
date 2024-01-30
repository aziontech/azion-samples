# Buffer through polyfills

This code sample is JavaScript project that demonstrates the use of the Buffer class from the Node.js buffer module inside an **edge function** through the use of polyfills. 

## How it Works

The main function in this project is myWorker(event). Here's a brief rundown of what it does:

1. It creates two Buffer instances, buf1 and buf2, both initialized with the string "x".

2. It then compares these two buffers using the Buffer.compare method. This method returns a number indicating whether buf1 is equal to buf2. In this case, it'll return 0, because they're equal.

3. The values of buf1 and buf2 are then swapped. buf1 is now "y" and buf2 is "x".

4. buf1 and buf2 are compared again using the Buffer.compare method. This time, it returns 1.

5. Finally, the function returns a new Response object with the string "Testing polyfills".
Usage

