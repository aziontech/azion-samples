// Import the Buffer class from the 'buffer' module in Node.js
import { Buffer } from 'node:buffer';

// Define a function named 'myWorker' that takes an event as an argument
export default function myWorker(event) {
  // Create a new Buffer instance 'buf1' from the string "x"
  var buf1 = Buffer.from("x");
  // Create a new Buffer instance 'buf2' from the string "y"
  var buf2 = Buffer.from("x");
  // Compare 'buf1' and 'buf2' using Buffer.compare method
  // This method returns a number indicating whether 'buf1' is equal to 'buf2'
  var a = Buffer.compare(buf1, buf2);

  // In this case, it'll return 0, because they're equal
  console.log(a);

  // Now, let's swap the values of 'buf1' and 'buf2'
  buf1 = Buffer.from("y");
  buf2 = Buffer.from("x");
  // Compare 'buf1' and 'buf2' again
  a = Buffer.compare(buf1, buf2);

  // Here it returns 1
  console.log(a);

  // The function returns a new Response object with the string "Testing buffer polyfills"
  return new Response("Testing polyfills");
}