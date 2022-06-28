import basePathConfig from '../../server/configs/basePathConfig';
import { routes } from '../routes/routes'
const basePath = basePathConfig || '';

const fetchStudiesAdmin = async () => {
  const res = await window.fetch(`${basePath}/api/v1/search/studies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.json();
}

const fetchStudies = async () => {
  const res = await window.fetch(`${basePath}/api/v1/studies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.json();
}

const fetchSubjects = async () => {
  const userAccess = await window.fetch(`${basePath}/api/v1/studies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  });
  if (userAccess.status !== 200) {
    throw new Error(userAccess.statusText);
  }
  const studiesJson = await userAccess.json();
  const studies = studiesJson ? studiesJson : [];
  const subjectsResponse = await window.fetch(`${basePath}/api/v1/subjects?q=${JSON.stringify(studies)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
  })
  if (subjectsResponse.status !== 200) {
    throw new Error(subjectsResponse.statusText);
  }
  return subjectsResponse.json();
};

const fetchUsers = async () => {
  const res = await window.fetch(`${basePath}/api/v1/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.json()
};

const fetchUsernames = async () => {
  const res = await window.fetch(`${basePath}/api/v1/search/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  });
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.json()
}

const fetchStudyDetails = async () => {
  const res = await window.fetch(`${routes.basePath}/api/v1/study-details`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })

  return res.json()
}

const createStudyDetails = async (body) => {
  const res = await window.fetch(`${routes.basePath}/api/v1/study-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const deleteStudyDetails = async (id) => {
  const res = await window.fetch(`${routes.basePath}/api/v1/study-details/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

export { 
  fetchStudies,
  fetchStudiesAdmin, 
  fetchSubjects, 
  fetchUsers, 
  fetchUsernames, 
  fetchStudyDetails, 
  deleteStudyDetails,
  createStudyDetails
};
