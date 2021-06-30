import basePathConfig from '../configs/basePathConfig';

const basePath = basePathConfig || '';

export default (study, subject, day) => {
  var subjectState = {
    "study": study,
    "subject": subject,
    "day": day
  };
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
				<title>DPdash</title>
				<link rel='stylesheet' href='${basePath}/css/roboto.css'/>
                <link rel='stylesheet' href='${basePath}/css/react-virtualized.css'/>
				<script>
				 	window.USER = ${JSON.stringify(null)}
					window.SUBJECT = ${JSON.stringify(subjectState)}
					window.GRAPH = ${JSON.stringify(null)}
				</script>
			</head>
			<body>
				<div id="main"></div>
				<script src="${basePath}/js/deepdive.min.js"></script>
			</body>
		</html>
	`;
};
