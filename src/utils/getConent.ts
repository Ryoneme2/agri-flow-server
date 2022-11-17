const getContent = (ctx: string) => {
  return ctx?.split('<p>')?.map((v, i) => {
    if (i === 0 || v.startsWith('<img')) return
    if (v.startsWith('<strong>')) return v.split('<strong>')[1].split('<strong>')[0]
    return v.split('</p>')[0]
  }).filter(v => v !== undefined).join('') || ''
}

export default getContent