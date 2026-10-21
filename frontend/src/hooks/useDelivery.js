import { useState } from "react";

export default function useDelivery() {
  const [events, setEvents] = useState([]);
  const createDeliveryEvents = (alert) => setEvents((items) => [{ id: `EV-${Date.now()}`, name: "Demo recipient", zone: alert.area, channel: "SMS", status: "delivered", ack: false, time: new Date().toLocaleTimeString() }, ...items]);
  return { events, createDeliveryEvents };
}