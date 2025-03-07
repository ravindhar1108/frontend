import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      {/* Hero Section - Fixed to show navbar */}
      <section id="home" className="hero-section">
        <div className="overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-content"
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  Create Forms with Your Voice
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                  Build, share, and fill forms using advanced voice recognition technology.
                  Simplify your form creation and submission process.
                </motion.p>
                <div className="hero-buttons">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-lg"
                >
                  <Link to="/signup" className="text-white text-decoration-none">
                    Create Form
                  </Link>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-light btn-lg ms-3"
                >
                  <Link to="/login" className="text-white text-decoration-none">
                    Log In
                  </Link>
                </motion.button>
              </div>

              </motion.div>
            </div>
            <div className="col-lg-6">
              {/* Hero image area - left empty as in your HTML */}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section - From your design */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Powerful Features</h2>
            <p>Discover what makes VoiceForm the most innovative form builder</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <motion.div 
                whileHover={{ y: -10 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <i className="fas fa-microphone"></i>
                </div>
                <h3>Voice Recognition</h3>
                <p>Create and fill forms using natural voice commands powered by OpenAI technology.</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div 
                whileHover={{ y: -10 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <h3>Custom Form Fields</h3>
                <p>Add a variety of field types including text, select, checkbox, date, and more.</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div 
                whileHover={{ y: -10 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <i className="fas fa-share-alt"></i>
                </div>
                <h3>Easy Sharing</h3>
                <p>Share your forms with a simple link and collect responses in real-time.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;