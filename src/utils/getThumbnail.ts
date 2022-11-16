const getThumbnail = (c: string) => {
  return c.split('src="').map(v => v.split('"')[0])
}

export default getThumbnail