import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import {
  AlertInput,
  DeliveryTracker,
  PlainLanguage,
  Sidebar,
  SMSSimulator,
  Toast,
  TopBar,
  Translator,
  VisualGenerator,
} from "./components";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [currentAlert, setCurrentAlert] = useState(null);
  const [deliveryEvents, setDeliveryEvents] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = "success") => setToast({ message, tone });
  const navigate = (page) => setActivePage(page);
  const handleProcess = (alert) => {
    setCurrentAlert(alert);
    showToast("Accessible alert created and ready to send.");
    navigate("plain-language");
  };
  const handleDeliveryEvent = (event) => setDeliveryEvents((events) => [event, ...events]);
  const page = {
    dashboard: <Dashboard alert={currentAlert} onProcess={handleProcess} navigate={navigate} />,
    "alert-input": <AlertInput alert={currentAlert} onProcess={handleProcess} navigate={navigate} />,
    "plain-language": <PlainLanguage alert={currentAlert} navigate={navigate} />,
    translator: <Translator alert={currentAlert} navigate={navigate} />,
    visual: <VisualGenerator alert={currentAlert} navigate={navigate} />,
    sms: <SMSSimulator alert={currentAlert} onDeliveryEvent={handleDeliveryEvent} navigate={navigate} />,
    tracker: <DeliveryTracker deliveryEvents={deliveryEvents} navigate={navigate} />,
  }[activePage] || <NotFound onBack={() => navigate("dashboard")} />;

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-slate-200">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <div className="lg:pl-64">
        <TopBar activePage={activePage} deliveryEvents={deliveryEvents} onNotify={showToast} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10">{page}</main>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}