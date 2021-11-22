import basePathConfig from '../configs/basePathConfig';
var serialize = require('serialize-javascript');

const basePath = basePathConfig || '';

export default (user, name, icon, mail, role, message) => {
  var userState = {
    "uid": user,
    "name": name,
    "icon": icon,
    "mail": mail,
    "role": role,
    "message": message
  };
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
				<title>Configurations - DPdash</title>
				<link rel="stylesheet" href="${basePath}/css/config.css" />
				<script>
					window.USER = ${serialize(userState, {isJSON: true})}
                    window.SUBJECT = ${JSON.stringify(null)}
                    window.GRAPH = ${JSON.stringify(null)}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/config.min.js"></script>
			</body>
		</html>
	`;
};
