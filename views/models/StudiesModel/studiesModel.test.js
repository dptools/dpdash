import StudiesModel from '.'

describe('Studies Model', () => {
  it('Creates a list of options from a list of studies', () => {
    const studies = ['study1', 'study2', 'study3']
    const options = StudiesModel.dropdownSelectOptions(studies)

    expect(options).toEqual([
      { value: 'study1', label: 'study1' },
      { value: 'study2', label: 'study2' },
      { value: 'study3', label: 'study3' },
    ])
  })
})
