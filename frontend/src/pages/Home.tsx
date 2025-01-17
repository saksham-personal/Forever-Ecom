import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import NewsletterBox from '../components/Newsletter'
import Policies from '../components/Policies'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <Policies />
      <NewsletterBox/>
    </div>
  )
}

export default Home
