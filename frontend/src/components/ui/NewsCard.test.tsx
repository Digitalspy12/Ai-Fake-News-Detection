import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NewsCard from './NewsCard'

describe('NewsCard', () => {
    const dummyProps = {
        title: 'Test Headline AI',
        source_domain: 'example.com',
        summary: 'This is a test summary for the AI project.',
        sentiment: 'positive' as const,
        is_fake: false,
        credibility_score: 0.95,
        published_at: '2023-10-01'
    }

    it('renders the title and summary correctly', () => {
        render(<NewsCard {...dummyProps} />)

        expect(screen.getByText('Test Headline AI')).toBeInTheDocument()
        expect(screen.getByText('This is a test summary for the AI project.')).toBeInTheDocument()
        expect(screen.getByText('example.com')).toBeInTheDocument()
    })

    it('displays a verified badge if credibility is high and is_fake is false', () => {
        render(<NewsCard {...dummyProps} />)

        expect(screen.getByText('Verified')).toBeInTheDocument()
        expect(screen.queryByText('Suspicious')).not.toBeInTheDocument()
    })

    it('displays a suspicious badge if credibility is low', () => {
        render(<NewsCard {...dummyProps} credibility_score={0.4} />)

        expect(screen.getByText('Suspicious')).toBeInTheDocument()
    })
})
