export const handleNumberStringInput = (input) => {
  const regex = new RegExp(/^[0-9]+$/)
  return regex.test(input) ? parseFloat(input) : input
}
