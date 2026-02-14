export const logout = (req, res, next) => {
  res.clearCookie('connect.sid')

  req.logout(function (err) {
    if (err) return next(err)

    req.session.destroy(function (sessionError) {
      if (sessionError) return next(sessionError)
    })
  })
}
