import { Header, MapComponent } from "./components";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="admin" userName="Nguyễn Văn A" />
      <MapComponent />
    </div>
  );
}

export default App;
