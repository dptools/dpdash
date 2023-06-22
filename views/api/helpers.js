export const handleApiResponse = async (response) => {
  const responseBody = response.headers.get('Content-Length')
    ? await response.json()
    : await Promise.resolve({ error: 'An unknown error occurred' })

  if (!response.ok) throw new Error(responseBody.error)

  return responseBody.data
}
