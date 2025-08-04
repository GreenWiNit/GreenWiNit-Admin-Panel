export async function throwResponseStatusThenChaining(response: Response) {
  if (response.ok) {
    return response
  }

  return response
    .clone()
    .json()
    .then((body) => {
      throw new Error(body.message || `HTTP ${response.status}: ${response.statusText}`)
    })
}
