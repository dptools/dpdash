import basePathConfig from '../configs/basePathConfig';
const serialize = require('serialize-javascript');

const basePath = basePathConfig || '';

export default (message) => {
  var userState = {
    "message": message,
  };
  return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
                <link rel='stylesheet' href='${basePath}/css/register.css' />
                <title>Reset Password - DPdash</title>
            </head>
                <script>
                    window.USER = ${serialize(userState, {isJSON: true})}
                    window.SUBJECT = ${serialize(null, {isJSON: true})}
                    window.GRAPH = ${serialize(null, {isJSON: true})}
                </script>
            <body>
                <div id = "main"></div>
                <script src="${basePath}/js/reset.min.js">
                </script>
            </body>
        </html>
    `;
};
