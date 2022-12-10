import * as helpers from './helpers'

function postProcessDataFactory(mapEntries) {
  return new Map(Object.entries(mapEntries))
}

export { postProcessDataFactory }
