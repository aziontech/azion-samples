import { readFileSync } from 'fs';

export default function myWorker(event) {
  const data = readFileSync('static-html/index.html','utf8')
 
    return new Response(data, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
}

