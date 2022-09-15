import net from 'net';

const logOut = (...args) => {
  if (process.env['NODE_ENV'] !== 'test') {
    console.log('[server]', ...args);
  }
};

export const serve = (host, port) => {
  const server = net.createServer((socket) => {
    logOut('Connected');
    socket.on('data', (data) => {
      const dataStr = data.toString();
      logOut('Got data:', dataStr);
      const lines = dataStr.split('/n');
      const startLine = lines[0];
      const [method, path] = startLine.split(' ');
      if (method == 'GET' && path == '/') {
        const body = `<html>
        <main>
        <h1>Welcome to my site</h1>
        </main>
        </html>`;
        const getRequest = `HTTP/1.1 200 Ok
Content-Length: ${body.length}
Content-Type: text/html; charset=UTF-8
${body}`;
        socket.write(getRequest);
      } else if (method == 'GET' && path == '/post') {
        const json = `[
    {
        "id": "1",
        "name": "latte",
        "breed": "munchkin"
    },
    {
        "id": "2",
        "name": "Norris",
        "breed": "British"
    },
    {
        "id": 3,
        "name": "Ivy",
        "breed": "Maine Coon"
    }
]`;
        const getJSON = `HTTP/1.1 200 Ok
Content-Length: ${json.length}
Content-Type: application/json

${json}`;
        socket.write(getJSON);
      } else if (method == 'POST' && path == '/mail') {
        const getError = `HTTP/1.1 204 No Content
Content-Length: 0
Host: http://localhost:8080/mail
`;
        socket.write(getError);
      } else {
        const newRequest = `HTTP/1.1 404 Not Found
Accept: application/json,text/html
Content-Length: 0
Host: http://localhost:8080/?
`;
        socket.write(newRequest);
      }
    });
    socket.on('end', () => {
      logOut('Disconnected.');
    });
    socket.on('error', (err) => {
      logOut('Received error: ', err);
    });
  });
  server.listen(port, host, () => {
    logOut('Server is up');
  });
  logOut(`Trying to start the server`);
  return server;
};
