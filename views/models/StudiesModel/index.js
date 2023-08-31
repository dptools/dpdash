const StudiesModel = {
  dropdownSelectOptions: (studies) =>
    studies.map((study) => ({ value: study, label: study })),
}

export default StudiesModel
