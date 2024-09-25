import React, { useEffect } from 'react';
import LandNavbar from '../common/LandNavbar';
import LandFooter from '../common/LandFooter';
function Chatbot() {

  useEffect(() => {
    // Function to initialize Botpress
    const initializeChatbot = () => {
      if (window.BotpressInitialized) return; // Prevent multiple initializations

      window.BotpressInitialized = true;

      // Updated script URLs
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.botpress.cloud/webchat/v2.1/inject.js';
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.src = 'https://mediafiles.botpress.cloud/68fc2a78-b842-4ec3-866f-d6ef99da5458/webchat/v2.1/config.js';
      script2.defer = true;
      document.body.appendChild(script2);

      // Clean up the script elements when the component unmounts
      return () => {
        document.body.removeChild(script1);
        document.body.removeChild(script2);
        window.BotpressInitialized = false; // Reset flag
      };
    };

    initializeChatbot();
  }, []);

  return (
    <>
      <LandNavbar />
      {/* <h3 style={{ color: '#ff9494f7', marginLeft: '50px', marginTop: '10px',}}>Chat with AI Bot for any enquiry!</h3> */}
      <div id="chatbot-container" style={styles.chatbotContainer} >
      <div className='chatbot1'></div>

        {/* The chatbot will be injected here */}
      </div>

      {/* <LandFooter/> */}
    </>
  );
}

const styles = {
  chatbotContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 100px)', // Adjust this value based on your navbar and footer height
  }
};

export default Chatbot;
