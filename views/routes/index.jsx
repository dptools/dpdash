import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'

import { routes } from './routes'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'
import HeroLayout from '../layouts/HeroLayout'
import MainLayout from '../layouts/MainLayout'
import AccountPage from '../pages/AccountPage'
import AdminPage from '../pages/AdminPage'
import AdminCheck from '../pages/AdminPage/AdminCheck'
import ChartsPage from '../pages/ChartsPage'
import ConfigurationsPage from '../pages/ConfigurationsPage'
import DashboardPage from '../pages/DashboardPage'
import EditChartPage from '../pages/EditChartPage'
import EditConfigPage from '../pages/EditConfigPage'
import GraphPage from '../pages/GraphPage'
import NewChartPage from '../pages/NewChartPage'
import NewConfigPage from '../pages/NewConfigPage'
import ParticipantsPage from '../pages/ParticipantsPage'
import RegistrationPage from '../pages/RegistrationPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import SignInPage from '../pages/SignInPage'
import StudiesPage from '../pages/StudiesPage'
import ViewChartPage from '../pages/ViewChartPage'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeroLayout />}>
          <Route
            path={routes.home}
            element={<Navigate to={routes.signin} replace />}
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
          <Route
            path={routes.admin}
            element={
              <AdminCheck>
                <AdminPage />
              </AdminCheck>
            }
          />
          <Route path={routes.charts} element={<ChartsPage />} />
          <Route path={routes.newChart} element={<NewChartPage />} />
          <Route path={routes.editChartPage} element={<EditChartPage />} />
          <Route path={routes.viewChartPage} element={<ViewChartPage />} />
          <Route path={routes.editConfigPage} element={<EditConfigPage />} />
          <Route path={routes.newConfiguration} element={<NewConfigPage />} />
          <Route path={routes.studies} element={<StudiesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
