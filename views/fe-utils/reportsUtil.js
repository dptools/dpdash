const queryApi = async ({
  study,
  body,
}) => {
  const enrollmentRes = await window.fetch(`/api/v1/studies/${study}/enrollment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  });
  if (!enrollmentRes.ok) {
    throw Error(enrollmentRes.statusText);
  }
  return enrollmentRes.json();
}

const fetchDataForChart = async ({ 
  reportType,
  varName,
  assessment,
  variables,
  studies,
  studySingle,
  valueLabels,
}) => {
  let data = [];
  if (['bar', 'study-line'].includes(reportType)) {
    const body = {
      assessment,
      varName,
    };
    await Promise.all(studies.map(async (study) => {
      const statsForStudy = await queryApi({ study, body });
      data.push(...statsForStudy.enrollmentsList);
      return Promise.resolve();
    }));
  } else if (reportType === 'category-line') { 
    await Promise.all(variables.map(async (variable) => {
      const body = {
        assessment,
        varName: variable,
      };
      const statsForVariable = await queryApi({ study: studySingle, body });
      data.push(...statsForVariable.enrollmentsList);
      return Promise.resolve();
    }));
  } else throw Error('Report type not yet supported');
  if (Array.isArray(valueLabels) && valueLabels.length > 0) {
    data = data.map((entry) => {
      let newEntry = entry;
      valueLabels.forEach((valueLabel) => {
        if (valueLabel.value.toString() === entry.value.toString()) {
          newEntry = { ...entry, value: valueLabel.label };
        }
      })
      return newEntry;
    })
  }
  return data;
};

export { fetchDataForChart };
