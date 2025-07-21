import React from 'react'
import Header from 'components/Header'

const trips = () => {
  return (
    <main className="all-users wrapper">
      <Header
          title="Trips"
          description="View and manage AI-generated travel plans"
          ctaText="Create New Trip"
          ctaUrl="/trips/create"
      />
    </main>
  )
}

export default trips