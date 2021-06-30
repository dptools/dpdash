import basePathConfig from '../configs/basePathConfig';

const basePath = basePathConfig || '';

export default ({ user, report }) => {
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <link rel="stylesheet" href="${basePath}/css/react-virtualized.css" />
        <link rel="stylesheet" href="${basePath}/css/admin.css" />
				<title>Reports - DPdash</title>
				<script>
					window.USER = ${JSON.stringify(user)}
          window.REPORT = ${JSON.stringify(report)}
					window.SUBJECT = ${JSON.stringify(null)}
					window.GRAPH = ${JSON.stringify(null)}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/editReport.min.js"></script>
			</body>
		</html>
	`;
};
