export const sleep = async (delay: string) => {
  return new Promise((resolve) => {
    setTimeout(resolve, parseFloat(delay) * 1000)
  })
}
