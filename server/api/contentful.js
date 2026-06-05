// Server-side API-route der fungerer som et mellemled (proxy) mellem browseren og Contentful.
// Det betyder at vores hemmelige API-nøgler aldrig sendes ud til brugeren, de lever kun på serveren.

export default defineEventHandler(async (event) => {
  // Henter Contentful-legitimationsoplysninger fra miljøvariabler (.env-filen)
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

  // Trækker parametre ud af den indkommende request fra browseren.
  // "contentType" bestemmer hvilken indholds-type vi vil hente (fx "koncerter").
  // "include" styrer hvor mange niveauer af relateret indhold Contentful pakker med (linked entries).
  // "...rest" opsamler evt. ekstra filtre som fx fields.billedtitel=Forside Hero desktop
  const { contentType, include = 2, ...rest } = getQuery(event)

  // Gør de ekstra filtre klar til at sætte på URL'en som query-parametre
  const extraParams = new URLSearchParams(rest).toString()

  // Kalder Contentful's Delivery API og beder om op til 999 poster af den ønskede indholds-type.
  // Svaret sendes direkte tilbage til browseren som JSON.
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=${include}&limit=999${extraParams ? `&${extraParams}` : ''}`
  )
  return res.json()
})