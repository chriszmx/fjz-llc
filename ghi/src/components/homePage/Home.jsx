import React from 'react'

import Welcome from './Welcome'
import AvailableApartments from './AvailableApartments'
import BookShowingForm from './BookShowingForm'
import Disclaimer from './Disclaimer'

const Home = () => {
  return (
    <>
    <div className='select-none'>
        <Welcome />
        <Disclaimer />
        <AvailableApartments />
        <BookShowingForm />
    </div>
    </>
  )
}

export default Home
