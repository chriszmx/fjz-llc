import React from 'react'

import Welcome from './Welcome'
import AvailableApartments from './AvailableApartments'
import BookShowingForm from './BookShowingForm'

const Home = () => {
  return (
    <>
    <div>
        <Welcome />
        <AvailableApartments />
        <BookShowingForm />
    </div>
    </>
  )
}

export default Home
