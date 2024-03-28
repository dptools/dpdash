import { act, render, screen, waitFor } from '@testing-library/react'
import { createGraphDataResponse, createUser } from '../../../test/fixtures'
import api from '../../api'
import { Graph } from '.'
import { MemoryRouter } from 'react-router-dom'

const mockGraphDataResponse = createGraphDataResponse({
  subject: {
    sid: "subject",
    project: "study"
  } 
})
describe('Graph', () => {
  const user = createUser({preferences: { config: "config" } })

  it('calls the graph data API endpoint for the given participant', async () => {
    const mockApi = jest.spyOn(api.dashboard, 'load')
    mockApi.mockResolvedValue(mockGraphDataResponse)

    render(
      <MemoryRouter>
        <Graph user={user} study={"study"} subject={"subject"} theme={{}} setNotification={jest.fn()} />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(api.dashboard.load).toHaveBeenCalledWith("study", "subject")
    })
  })
  it('renders the graph', async () => {
    const mockApi = jest.spyOn(api.dashboard, 'load')
    mockApi.mockResolvedValue(mockGraphDataResponse)
    
    render(
      <MemoryRouter>
        <Graph user={user} study={"study"} subject={"subject"} theme={{}} setNotification={jest.fn()} />
      </MemoryRouter>
    )
    const graphElement = await screen.findByTestId("graph")
    await waitFor(() => {
      expect(graphElement.firstChild).toBeInTheDocument()
    })
  })
})
