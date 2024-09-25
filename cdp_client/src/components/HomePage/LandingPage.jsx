import React from 'react'
import LandNavbar from '../common/LandNavbar'
import HeroSection from '../LandingPageComponents/HeroSection'
import DonationList from '../LandingPageComponents/DonationList'
import ChooseUs from '../LandingPageComponents/ChooseUs'
import LandFooter from '../common/LandFooter'
import CategoriesGrid from '../LandingPageComponents/CategoriesGrid'


function LandingPage() {
  return (
    <>
    <LandNavbar/>
    <HeroSection/>
    <CategoriesGrid/>
    <DonationList/>
    
    <ChooseUs/>
    <LandFooter/>
    
    </>
  )
}

export default LandingPage