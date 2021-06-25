const fetchReport = async ({ id }) => {
  const res = await window.fetch(`/api/v1/reports/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
  });
  if (!res.ok) {
    throw Error(res.statusText);
  }
  const { report } = await res.json();
  return {
    charts: report.charts,
    reportName: report.reportName,
  };
};

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

const parseValueLabels = ({
  valueLabels,
  data,
}) => {
  return data.map((entry) => {
    let newEntry = entry;
    valueLabels.forEach((valueLabel) => {
      const valueLabelValuesArray = valueLabel.value.toString().split(',');
      valueLabelValuesArray.forEach((valueLabelValue) => {
        if (valueLabelValue.includes('-')) {
          const rangeArray = valueLabelValue.split('-');
          if (rangeArray.length !== 2 || 
            Number.isNaN(Number.parseFloat(rangeArray[0])) || 
            Number.isNaN(Number.parseFloat(rangeArray[1]))) {
            throw Error(`Error parsing ${valueLabelValue}`)
          }
          const numberToCompare = Number.parseFloat(entry.value);
          if (!Number.isNaN(numberToCompare) && 
            numberToCompare >= Number.parseFloat(rangeArray[0]) &&
            numberToCompare <= Number.parseFloat(rangeArray[1])) {
            newEntry = { ...entry, value: valueLabel.label };
          }
        } else if (valueLabelValue === entry.value.toString()) {
          newEntry = { ...entry, value: valueLabel.label };
        }

      })
    })
    return newEntry;
  });
};

const fetchDataForChart = async ({ 
  chartType,
  varName,
  assessment,
  variables,
  studies,
  studySingle,
  valueLabels,
}) => {
  let data = [];
  if (['bar', 'study-line'].includes(chartType)) {
    const body = {
      assessment,
      varName,
    };
    await Promise.all(studies.map(async (study) => {
      const statsForStudy = await queryApi({ study, body });
      data.push(...statsForStudy.enrollmentsList);
      return Promise.resolve();
    }));
  } else if (chartType === 'category-line') { 
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
  data = data.map((entry) => {
    let newEntry = entry;
    if (entry.value === null) {
      newEntry = { ...entry, value: 'No data' };
    }
    return newEntry;
  });
  if (Array.isArray(valueLabels) && valueLabels.length > 0) {
    data = parseValueLabels({ valueLabels, data });
  }
  return data;
};

export { fetchDataForChart, fetchReport };
