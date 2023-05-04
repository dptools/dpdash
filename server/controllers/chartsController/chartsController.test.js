import {
  createChart,
  createLabel,
  createRequestWithUser,
  createResponse,
  createSiteData,
  createSubject,
  createUser,
} from '../../../test/fixtures'
import chartsListPage from '../../templates/Chart.template'
import editChartPage from '../../templates/EditChart.template'
import newChartPage from '../../templates/NewChart.template'
import viewChartPage from '../../templates/ViewChart.template'
import chartsController from '.'
import { userFromRequest } from '../../utils/userFromRequestUtil'
import BarChartService from '../../services/BarChartService'
import BarChartTableService from '../../services/BarChartTableService'
import SubjectModel from '../../models/SubjectModel'
import { DEFAULT_CHART_FILTERS } from '../../constants'

jest.mock('../../services/BarChartService')
jest.mock('../../services/BarChartTableService')

const consoleError = console.error

describe('chartsController', () => {
  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = consoleError
  })

  describe(chartsController.index, () => {
    describe('when successful', () => {
      it('renders the charts list page', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = userFromRequest(request)

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.send).toHaveBeenCalledWith(chartsListPage(user))
      })
    })

    describe('when unsuccessful', () => {
      it('returns a 500 error with the error message', async () => {
        const request = {}
        const response = createResponse()

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
          message: "Cannot read properties of undefined (reading 'role')",
        })
      })
    })
  })

  describe(chartsController.new, () => {
    describe('when successful', () => {
      it('renders the new chart page', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = userFromRequest(request)

        await chartsController.new(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.send).toHaveBeenCalledWith(newChartPage(user))
      })
    })

    describe('when unsuccessful', () => {
      it('returns a 500 error with the error message', async () => {
        const request = {}
        const response = createResponse()

        await chartsController.new(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
          message: "Cannot read properties of undefined (reading 'role')",
        })
      })
    })
  })

  describe(chartsController.edit, () => {
    describe('when successful', () => {
      const chartId = 10
      const request = createRequestWithUser({ params: { chart_id: chartId } })
      const response = createResponse()
      const user = userFromRequest(request)
      const chart = createChart({ id: chartId })

      it('renders the edit chart page', async () => {
        request.app.locals.dataDb.findOne.mockResolvedValueOnce(chart)

        await chartsController.edit(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.send).toHaveBeenCalledWith(
          editChartPage(user, { chart_id: chartId })
        )
      })
    })

    describe('when unsuccessful', () => {
      it('returns a 500 error with the error message', async () => {
        const request = {}
        const response = createResponse()

        await chartsController.edit(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
          message: "Cannot read properties of undefined (reading 'chart_id')",
        })
      })
    })
  })

  describe(chartsController.show, () => {
    const chart = createChart()
    const mockCreateChart = jest.fn()
    const mockCsvTableData = jest.fn()
    const mockWebsiteTableData = jest.fn()
    const mockSubjects = [createSubject()]
    const mockDataBySite = [createSiteData()]
    const mockLabels = [createLabel()]
    const mockLegend = []
    const request = createRequestWithUser({
      params: { chart_id: chart.id },
    })
    const response = createResponse()
    const user = userFromRequest(request)

    beforeEach(() => {
      BarChartService.mockImplementationOnce(() => {
        return {
          createChart: mockCreateChart,
          legend: () => mockLegend,
        }
      })
      BarChartTableService.mockImplementationOnce(() => {
        return {
          csvTableData: mockCsvTableData,
          websiteTableData: mockWebsiteTableData,
        }
      })
      jest
        .spyOn(SubjectModel, 'allForAssessment')
        .mockResolvedValueOnce(mockSubjects)
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('returns the view chart page', async () => {
      const chartOwner = createUser()
      const graphTable = { tableColumns: [], tableRows: [] }
      const studyTotals = {
        [mockSubjects[0].study]: {
          count: 2,
          targetValue: 2,
        },
      }
      mockCreateChart.mockResolvedValueOnce({
        dataBySite: mockDataBySite,
        labels: mockLabels,
        studyTotals,
      })
      mockWebsiteTableData.mockReturnValueOnce(graphTable)
      request.app.locals.dataDb.findOne.mockResolvedValueOnce(chart)
      request.app.locals.appDb.findOne.mockResolvedValueOnce(chartOwner)

      await chartsController.show(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.send).toHaveBeenCalledWith(
        viewChartPage(user, {
          chart_id: chart.id,
          dataBySite: mockDataBySite,
          labels: mockLabels,
          title: chart.title,
          description: chart.description,
          legend: mockLegend,
          studyTotals,
          filters: DEFAULT_CHART_FILTERS,
          chartOwner,
          graphTable,
        })
      )
    })
  })
})
