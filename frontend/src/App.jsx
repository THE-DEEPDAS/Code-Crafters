import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import Insights from "./Pages/insights";
import ContactPage from "./Pages/ContactPage";
import Signin from "./Pages/signin";
import Encourage from "./components/Encourage";
import Signup from "./Pages/signup";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/encourage" element={<Encourage />} />
    </Routes>
  );
};

export default App;
