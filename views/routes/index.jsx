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
import LoginPage from '../pages/LoginPage'
import MainPage from '../pages/MainPage'
import MainLayout from '../layouts/MainLayout'
import NewChartPage from '../pages/NewChartPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import RegisterPage from '../pages/RegisterPage'
import ViewChartPage from '../pages/ViewChartPage'

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
        <Route path={routes.register} element={<RegisterPage />} />
        <Route path={routes.resetpw} element={<ResetPasswordPage />} />
        <Route
          path={routes.dpdashboard}
          element={
            <GraphPage
              user={props.user}
              classes={props.classes}
              theme={props.theme}
            />
          }
        />
        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout classes={props.classes} theme={props.theme} />
            </AuthenticatedRoute>
          }
        >
          <Route path={routes.configs} element={<ConfigPage />} />
          <Route
            path={routes.main}
            element={
              <MainPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
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
          <Route path={routes.charts} element={<ChartsPage />} />
          <Route path={routes.newChart} element={<NewChartPage />} />
          <Route path={routes.editChartPage} element={<EditChartPage />} />
          <Route path={routes.viewChartPage} element={<ViewChartPage />} />
          <Route
            path={routes.admin}
            element={
              <AdminPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path={routes.editConfigPage}
            element={
              <EditConfigPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
