import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./pages/Footer";
// import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <AppRoutes />
        <Footer />
    </BrowserRouter>
  );
}

export default App;
