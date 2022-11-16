const getContent = (ctx: string) => {
  const paragraph = ctx?.split('<p>')[1] || ''
  return paragraph?.split('</p>')[0] || ''
}

export default getContent