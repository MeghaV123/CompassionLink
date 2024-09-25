import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import SigninPage from "./components/Auth/SignIn";
import Signup from "./components/Auth/SignUp";
import AdminHome from "./components/HomePage/adminHome";
import UserHome from "./components/HomePage/userHome";
import DeliveryHome from "./components/HomePage/deliveryHome";

import LandingPage from "./components/HomePage/LandingPage";
import FullDonationsSection from "./components/LandingPageComponents/FullDonationsSection";
import MyDonationsPage from "./components/LandingPageComponents/MyDonationsPage";
import RecipientHome from "./components/HomePage/RecipientHome";
import RecipientSignUp from "./components/Auth/RecipientSignUp";
import DonationCategories from "./components/Tables/Admin/DonationCategories";
import AddDonor from "./components/Forms/Admin/AddRecipient";
import EditDonor from "./components/Forms/Admin/EditRecipient";
import DonationPage from "./components/Tables/Admin/DonationPage";
import Agents from "./components/Tables/Admin/Agents";
import AgentSignUp from "./components/Auth/AgentSignUp";
import EditAgent from "./components/Forms/Admin/EditAgent";
import AddRecipient from "./components/Forms/Admin/AddRecipient";
import EditRecipient from "./components/Forms/Admin/EditRecipient";
import CategoryDonations from "./components/Tables/Admin/CategoryDonations";
import FeedbackList from "./components/Tables/Admin/FeedbackList";
import AddRecipientFeedback from "./components/Forms/Recipient/AddRecipientFeedback";
import ViewProfile from "./components/Tables/Recipient/ViewProfile";
import UpdateProfile from "./components/Tables/Recipient/UpdateProfile";
import ViewApprovalDonation from "./components/Tables/Admin/ViewApprovalDonation";
import ViewDonationDetails from "./components/LandingPageComponents/ViewDonationDetails";
import ViewRecipientDonationDetails from "./components/Tables/Recipient/ViewRecipientDonationDetails";
import MyProfilePage from "./components/Tables/MyProfilePage";
import UserProfileUpdate from "./components/Tables/UserProfileUpdate";
import ViewAgentDonationDetails from "./components/Tables/Delivery_Agent/ViewAgentDonationDetails";
import AddAgentFeedback from "./components/Forms/Agent/AddAgentFeedback";
import ViewDonorDonationDetails from "./components/Tables/ViewDonorDonationDetails";
import ViewAdminDonationDetails from "./components/Tables/Admin/ViewAdminDonationDetails";
import RecipientDonationsTable from "./components/Tables/Recipient/RecipientDonationsTable";
import ViewAdminNonMonetaryDonationDetails from "./components/Tables/Admin/ViewAdminNonMonetaryDonationDetails";
import RecipientNonMonetaryDonations from "./components/Tables/Recipient/RecipientNonMonetaryDonations";
import ViewRecipientNonMonetaryDonationDetails from "./components/Tables/Recipient/ViewRecipientNonMonetaryDonationDetails";
import Nonmonetaryview from "./components/Tables/Admin/Nonmonetaryview";
import Chatbot from "./components/Tables/Chatbot";


function App() {
  return (
    <BrowserRouter>
    <Routes>

{/* -----------------Auth Route Start------------------------ */}

      <Route path="/" element={<LandingPage/>}/>
      <Route path="/SignIn" element={<SigninPage/>}/>
      <Route path="/RecipientSignup" element={<RecipientSignUp/>}/>
      <Route path="/AgentSignup" element={<AgentSignUp/>}/>
      <Route path="/Signup" element={<Signup/>}/>

{/* -----------------Auth Route End------------------------ */}


{/* -------------------------------------Home Page Routes----------------------------- */}

      <Route path="/AdminHome" element={<AdminHome/>}/>
      <Route path="/DeliveryHome" element={<DeliveryHome/>}/>
      <Route path="/UserHome" element={<UserHome/>}/>
      <Route path="/RecipientHome" element={<RecipientHome/>}/>

{/* -------------------------------------Admin Page Routes----------------------------- */}

    
      <Route path="/DonationCategories" element={<DonationCategories/>} />
      <Route path="/Donations" element={<FullDonationsSection/>} />
      <Route path="/MyDonations" element={<MyDonationsPage/>} />
      <Route path="/Donation" element={<DonationPage/>} />
      <Route path="/AddRecipient" element={<AddRecipient/>} />
      <Route path="/EditRecipient" element={<EditRecipient/>} />
      <Route path="/EditAgent" element={<EditAgent/>} />
      <Route path="/Agents" element={<Agents/>} />
      <Route path="/categoryDonations" element={<CategoryDonations/>} />
      <Route path="/Adminfeedbacks" element={<FeedbackList/>} />
      <Route path="/Recipientfeedbacks" element={<AddRecipientFeedback/>} />
      <Route path="/Agentfeedbacks" element={<AddAgentFeedback/>} />
      <Route path="/profile" element={<ViewProfile/>} />
      <Route path="/updateProfile" element={<UpdateProfile/>} />
      <Route path="/ViewApprovalDonation" element={<ViewApprovalDonation/>} />
      <Route path="/ViewAgentDonationDetails" element={<ViewAgentDonationDetails/>} />
      <Route path="/ViewDonationDetails" element={<ViewDonationDetails/>} />
      <Route path="/ViewRecipientDonationDetails" element={<ViewRecipientDonationDetails/>} />
      <Route path="/ViewAdminDonationDetails" element={<ViewAdminDonationDetails/>} />
      <Route path="/ViewAdminNonMonetaryDonationDetails" element={<ViewAdminNonMonetaryDonationDetails/>} />
      <Route path="/Nonmonetaryview" element={<Nonmonetaryview/>}/>
    
      <Route path="/ViewRecipientNonMonetaryDonationDetails" element={<ViewRecipientNonMonetaryDonationDetails/>} />
      <Route path="/ViewDonorDonationDetails" element={<ViewDonorDonationDetails/>} />
      <Route path="/MyProfile" element={<MyProfilePage/>} />
      <Route path="/UserProfileUpdate" element={<UserProfileUpdate/>} />
      <Route path="/recipientdonations" element={<RecipientDonationsTable/>} />
      <Route path="/RecipientNonMonetaryDonations" element={<RecipientNonMonetaryDonations/>} />
      <Route path="/Chatbot" element={<Chatbot/>} />

{/* -------------------------------------Delivery Page Routes----------------------------- */}




    </Routes>
    </BrowserRouter>
  );
}

export default App;
