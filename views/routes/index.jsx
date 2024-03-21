import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import AccountPage from '../pages/AccountPage'
import AdminPage from '../pages/AdminPage'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'
import ChartsPage from '../pages/ChartsPage'
import EditChartPage from '../pages/EditChartPage'
import EditConfigPage from '../pages/EditConfigPage'
import GraphPage from '../pages/GraphPage'
import HeroLayout from '../layouts/HeroLayout'
import MainLayout from '../layouts/MainLayout'
import NewChartPage from '../pages/NewChartPage'
import NewConfigPage from '../pages/NewConfigPage'
import ParticipantsPage from '../pages/ParticipantsPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import RegistrationPage from '../pages/RegistrationPage'
import ViewChartPage from '../pages/ViewChartPage'
import SignInPage from '../pages/SignInPage'
import ConfigurationsPage from '../pages/ConfigurationsPage'
import DashboardPage from '../pages/DashboardPage'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeroLayout />}>
          <Route
            path={routes.home}
            element={<Navigate to={routes.signin} replace={true} />}
          />
          <Route path={routes.signin} element={<SignInPage />} />
          <Route path={routes.register} element={<RegistrationPage />} />
          <Route path={routes.resetpw} element={<ResetPasswordPage />} />
        </Route>

        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout />
            </AuthenticatedRoute>
          }
        >
          <Route path={routes.dashboard()} element={<GraphPage />} />
          <Route path={routes.studyDashboard()} element={<GraphPage />} />
          <Route
            path={routes.configurations}
            element={<ConfigurationsPage />}
          />
          <Route path={routes.userAccount} element={<AccountPage />} />
          <Route path={routes.main} element={<DashboardPage />} />
          <Route path={routes.participants} element={<ParticipantsPage />} />
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
