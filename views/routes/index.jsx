import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import AccountPage from '../pages/AccountPage'
import AdminPage from '../pages/AdminPage'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'
import ChartsPage from '../pages/ChartsPage'
import ConfigPage from '../pages/ConfigPage'
import EditChartPage from '../pages/EditChartPage'
import EditConfigPage from '../pages/EditConfigPage'
import GraphPage from '../pages/GraphPage'
import HomePage from '../pages/HomePage'
import MainLayout from '../layouts/MainLayout'
import NewChartPage from '../pages/NewChartPage'
import NewConfigPage from '../pages/NewConfigPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import RegisterPage from '../pages/RegisterPage'
import ViewChartPage from '../pages/ViewChartPage'
import SignInPage from '../pages/SignInPage'

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
          element={<SignInPage classes={props.classes} />}
        />
        <Route
          path={routes.register}
          element={<RegisterPage classes={props.classes} />}
        />
        <Route
          path={routes.resetpw}
          element={<ResetPasswordPage classes={props.classes} />}
        />
        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout classes={props.classes} theme={props.theme} />
            </AuthenticatedRoute>
          }
        >
          <Route path={routes.dashboard()} element={<GraphPage />} />
          <Route path={routes.configs} element={<ConfigPage />} />
          <Route path={routes.main} element={<HomePage />} />
          <Route
            path={routes.userAccount}
            element={
              <AccountPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route path={routes.admin} element={<AdminPage />} />
          <Route path={routes.charts} element={<ChartsPage />} />
          <Route path={routes.newChart} element={<NewChartPage />} />
          <Route path={routes.editChartPage} element={<EditChartPage />} />
          <Route path={routes.viewChartPage} element={<ViewChartPage />} />
          <Route path={routes.editConfigPage} element={<EditConfigPage />} />
          <Route path={routes.newConfiguration} element={<NewConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
