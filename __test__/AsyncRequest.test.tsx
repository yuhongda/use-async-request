import '@testing-library/jest-dom'
import { render, waitFor, screen, act } from '@testing-library/react'
import React from 'react'
import { AsyncRequest } from '../src/'

describe('normal', () => {
  it('AsyncRequest render correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))

    act(() => {
      render(
        <AsyncRequest
          requestFunction={mockFetch}
          payload={{ storyType: 'topstories' }}
          success={({ data }: { data: string }) => <div>{data}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(async () => {
      expect(screen.getByText('ok')).toBeInTheDocument()
    })
  })
})
