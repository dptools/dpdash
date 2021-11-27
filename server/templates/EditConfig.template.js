import basePathConfig from '../configs/basePathConfig';
const serialize = require('serialize-javascript');

const basePath = basePathConfig || '';

export default (user, goal, id) => {
  var userState = {
    "uid": user,
    "goal": goal,
    "config": id
  };
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
				<title>Edit Configuration - DPdash</title>
				<script>
					window.USER = ${serialize(userState, {isJSON: true})}
                    window.SUBJECT = ${serialize(null, {isJSON: true})}
                    window.GRAPH = ${serialize(null, {isJSON: true})}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/editConfig.min.js"></script>
			</body>
		</html>
	`;
};
