const getThumbnail = (c: string) => {
  return c.split('src="').map(v => v.split('"')[0]).filter(v => v.startsWith('http') || v.startsWith("data:image"))
}

export default getThumbnail