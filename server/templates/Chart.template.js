import serialize from 'serialize-javascript';

import basePathConfig from '../configs/basePathConfig'

const basePath = basePathConfig || ''

export default (user) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <link rel='stylesheet' href='${basePath}/css/charts.css' />
        <title>Charts - DPDash</title>
        <script>
          window.USER = ${serialize(user, {isJSON: true})}
          window.SUBJECT = ${serialize(null, {isJSON: true})}
          window.GRAPH = ${serialize(null, {isJSON: true})}
        </script>
      </head>
      <body>
        <div id='charts'></div>
        <script src='${basePath}/js/chart.min.js'>
        </script>
      </body>
    </html>
  `
}
