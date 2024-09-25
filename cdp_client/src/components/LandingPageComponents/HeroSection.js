import React from 'react'

function HeroSection() {
  return (
    <>
    {/* <!-- Start Hero Section --> */}
			<div class="hero">
				<div class="container">
					<div class="row justify-content-between">
						<div class="col-lg-5">
							<div class="intro-excerpt">
								<h1 style={{fontFamily:"Hubballi"}}>Compassion Link <span class="d-block">Donation Platform</span></h1>
								<p class="mb-4 satisfy-regula"style={{fontSize:"18px", textAlign:"justify", fontFamily:"Gruppo", fontWeight:"bold"}}>Welcome to our Compassion Link Donation Platform. At Compassion Link, we believe in spreading compassion and making a positive impact on the world. Our mission is driven by a passion for uplifting communities and providing aid to those in need. Through the generosity of donors like you, we can continue our efforts to create lasting change.</p>
								
							</div>
						</div>
						<div class="col-lg-7">
							<div class="hero-img-wrap">
								<img src="img/Var02.png" style={{width:"520px", height:"500px"}} class="img-fluid"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/* <!-- End Hero Section --> */}
    </>
  )
}

export default HeroSection
