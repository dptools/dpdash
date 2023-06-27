import { useLocation, useNavigate, useParams } from 'react-router-dom'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    return (
      <Component
        params={params}
        location={location}
        navigate={navigate}
        {...props}
      />
    )
  }

  return Wrapper
}
