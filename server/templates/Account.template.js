import basePathConfig from '../configs/basePathConfig';
const serialize = require('serialize-javascript');

const basePath = basePathConfig || '';

export default (user, name, icon, mail, role) => {
  var userState = {
    "uid": user,
    "name": name,
    "icon": icon,
    "mail": mail,
    "role": role
  };
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
                <link rel='stylesheet' href='${basePath}/css/account.css' />
				<title>Account - DPdash</title>
				<script>
					window.USER = ${serialize(userState, {isJSON: true})}
                    window.SUBJECT = ${serialize(null, {isJSON: true})}
                    window.GRAPH = ${serialize(null, {isJSON: true})}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/account.min.js"></script>
			</body>
		</html>
	`;
};
