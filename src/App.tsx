import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./components/pages";

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
