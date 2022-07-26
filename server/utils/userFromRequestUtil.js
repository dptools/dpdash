export const userFromRequest = (req) => {
  const { user, session: { role, display_name, icon, userAccess }} = req
  
  return {
    uid: user,
    name: display_name,
    role, 
    icon,
    userAccess
  }
}
