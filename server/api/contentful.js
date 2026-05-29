export default defineEventHandler(async (event) => {

  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

  const { contentType, include = 2 } = getQuery(event)
 
  const res = await fetch(`https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=${include}&limit=999`)
  return res.json()
})