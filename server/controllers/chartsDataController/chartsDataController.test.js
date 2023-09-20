import {
  createChart,
  createLabel,
  createRequestWithUser,
  createResponse,
  createSiteData,
  createSubject,
  createUser,
} from '../../../test/fixtures'
import chartsDataController from '.'
import BarChartService from '../../services/BarChartService'
import BarChartTableService from '../../services/BarChartTableService'
import SubjectModel from '../../models/SubjectModel'
import { DEFAULT_CHART_FILTERS } from '../../constants'

jest.mock('../../services/BarChartService')
jest.mock('../../services/BarChartTableService')

const consoleError = console.error

describe('chartsDataController', () => {
  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = consoleError
  })

  describe(chartsDataController.show, () => {
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

      await chartsDataController.show(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith({
        data: {
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
        },
      })
    })
  })
})
