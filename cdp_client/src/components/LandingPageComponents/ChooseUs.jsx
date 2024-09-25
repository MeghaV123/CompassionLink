import React from 'react'

function ChooseUs() {
  return (
    <>
    <div class="why-choose-section" id="ourmission" style={{backgroundColor:"#FFE3E1"}}>
			<div class="container">
				<div class="row justify-content-between">
					<div class="col-lg-6">
						<h2 class="section-title">Our Mission</h2>
						<p style={{color:"black"}}>At Compassion Link, our mission is to alleviate suffering and empower communities through compassionate action, sustainable initiatives, and unwavering dedication to those in need.</p>

						<div class="row my-5">
							<div class="col-6 col-md-6">
								<div class="feature">
									<div class="icon">
										<img src="img/truck.svg" alt="Image" class="imf-fluid"/>
									</div>
									<h3>Fast &amp; Free Delivery</h3>
									<p>We Provide free pick up and delivery for donation items directly from the customers</p>
								</div>
							</div>

							<div class="col-6 col-md-6">
								<div class="feature">
									<div class="icon">
										<img src="img/bag.svg" alt="Image" class="imf-fluid"/>
									</div>
									<h3>Easy to Donate</h3>
									<p>Our Interactivate and Intuitive User Interface allows you to view and donate without a hassle.</p>
								</div>
							</div>

							<div class="col-6 col-md-6" >
								<div class="feature">
									<div class="icon">
										<img src="img/support.svg" alt="Image" class="imf-fluid"/>
									</div>
									<h3>Trusted Platform</h3>
									<p>Our Platform is managed by Individuals who strive to bring help for the needy.</p>
								</div>
							</div>

							<div class="col-6 col-md-6">
								<div class="feature">
									<div class="icon">
										<img src="img/return.svg" alt="Image" class="imf-fluid"/>
									</div>
									<h3>Hassle Free Payments</h3>
									<p>Our Hassle free payment structure helps making donations easier than ever.</p>
								</div>
							</div>

						</div>
					</div>

					<div class="col-lg-5">
						<div class="img-wrap">
							<img src="img/charity.jpg"style={{height:"500px", width:"550px"}} alt="Image" class="img-fluid"/>
						</div>
					</div>

				</div>
			</div>
		</div>
    </>
  )
}

export default ChooseUs
