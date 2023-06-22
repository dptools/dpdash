import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ConfigPage from '../pages/ConfigPage'
import LoginPage from '../pages/LoginPage'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'
import { routes } from './routes'

const Router = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.home}
          element={<Navigate to={routes.login} replace={true} />}
        />
        <Route
          path={routes.login}
          element={<LoginPage setUser={props.setUser} />}
        />

        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout classes={props.classes} theme={props.theme} />
            </AuthenticatedRoute>
          }
        >
          <Route path={routes.configs} element={<ConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
