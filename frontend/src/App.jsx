import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Insights from './components/insights';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </div>
  );
}