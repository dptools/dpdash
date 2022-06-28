import basePathConfig from '../configs/basePathConfig'
const serialize = require('serialize-javascript');

const basePath = basePathConfig || ''

export default (user) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <link rel='stylesheet' href='${basePath}/css/study_details.css' />
        <title>Study Details - DPDash</title>
        <script>
          window.USER = ${serialize(user, {isJSON: true})}
          window.SUBJECT = ${serialize(null, {isJSON: true})}
          window.GRAPH = ${serialize(null, {isJSON: true})}
        </script>
      </head>
      <body>
        <div id='study_details'></div>
        <script src='${basePath}/js/studyDetails.min.js'>
        </script>
      </body>
    <html>
  `
}
