import { useState } from "react";
import { sampleAlerts } from "../data/sampleAlerts";

export default function useAlert() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [currentAlert, setCurrentAlert] = useState(sampleAlerts[0] || null);
  const saveAlert = (alert) => { setCurrentAlert(alert); setAlerts((items) => [alert, ...items]); };
  return { alerts, currentAlert, saveAlert };
}