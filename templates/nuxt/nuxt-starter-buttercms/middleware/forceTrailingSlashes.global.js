/**
 * Enables Vue router to force trailing slashes
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const redirects = [
    {
      from: '^(\\/[^\\?]*[^\\/])(\\?.*)?$',
    }
  ]
  const redirect = redirects.find((r) => {
    const re = new RegExp(r.from)
    return re.test(to.path)
  })
  if(redirect){
    return navigateTo({ path: to.path + "/" })
  }
})