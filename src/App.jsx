import { Routes, Route } from "react-router";
import CalculadoraA from "./pages/CalculadoraA";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CalculadoraA />} />
      </Routes>
    </div>
  );
}

export default App;


