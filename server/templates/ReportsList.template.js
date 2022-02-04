import basePathConfig from '../configs/basePathConfig';
const serialize = require('serialize-javascript');

const basePath = basePathConfig || '';

export default ({ uid, name, role, icon }) => {
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <link rel="stylesheet" href="${basePath}/css/react-virtualized.css" />
        <link rel="stylesheet" href="${basePath}/css/admin.css" />
				<title>Reports - DPdash</title>
				<script>
					window.USER = ${serialize({ uid, name, role, icon }, {isJSON: true})}
					window.SUBJECT = ${serialize(null, {isJSON: true})}
					window.GRAPH = ${serialize(null, {isJSON: true})}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/reportsList.min.js"></script>
			</body>
		</html>
	`;
};
