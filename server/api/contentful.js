export default defineEventHandler(async (event) => {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

  const { contentType, include = 2, ...rest } = getQuery(event)

  // Byg ekstra parametre (f.eks. fields.billedtitel)
  const extraParams = new URLSearchParams(rest).toString()

  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=${include}&limit=999${extraParams ? `&${extraParams}` : ''}`
  )
  return res.json()
})