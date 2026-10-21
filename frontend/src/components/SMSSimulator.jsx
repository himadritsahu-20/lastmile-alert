import { useEffect, useMemo, useState } from "react";

const NETWORKS = {
  full: {
    name: "Full Internet",
    signal: "▂▄▆█",
    speed: "Unlimited / normal network",
    delay: 700,
    color: "#22C55E",
  },
  "3g": {
    name: "3G Network",
    signal: "▂▄▆_",
    speed: "Approx. 1 Mbps",
    delay: 2000,
    color: "#EAB308",
  },
  "2g": {
    name: "2G Network",
    signal: "▂▄__",
    speed: "Approx. 64 Kbps",
    delay: 4500,
    color: "#F97316",
  },
  sms: {
    name: "SMS Only",
    signal: "▂___",
    speed: "No internet available",
    delay: 2800,
    color: "#EF4444",
  },
  offline: {
    name: "Community Relay",
    signal: "____",
    speed: "Offline relay simulation",
    delay: 6000,
    color: "#94A3B8",
  },
};

const INITIAL_QUEUE = [
  { id: "R001", phone: "+91 98765 43210", zone: "Zone A", status: "delivered" },
  { id: "R002", phone: "+91 98765 43211", zone: "Zone B", status: "waiting" },
  { id: "R003", phone: "+91 98765 43212", zone: "Zone C", status: "failed" },
];

function cleanCode(value, maxLength = 14) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, maxLength);
}

export default function SMSSimulator({ alert, onDeliveryEvent }) {
  const [networkId, setNetworkId] = useState("full");
  const [code, setCode] = useState("FLOOD-RED");
  const [zone, setZone] = useState("ZONE:A7");
  const [action, setAction] = useState("ACT:EVACUATE");
  const [contact, setContact] = useState("CALL:112");
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [sending, setSending] = useState(false);
  const [deliveryText, setDeliveryText] = useState("Message not sent yet.");

  const network = NETWORKS[networkId];

  useEffect(() => {
    if (!alert) return;

    const areaCode = cleanCode(alert.area, 10) || "AREA";
    const actionCode =
      cleanCode(alert.keyInfo?.action || "ACTNOW", 15) || "ACTNOW";

    setCode(`${alert.type?.toUpperCase() || "ALERT"}-${alert.severity?.toUpperCase() || "HIGH"}`);
    setZone(`ZONE:${areaCode}`);
    setAction(`ACT:${actionCode}`);
  }, [alert]);

  const rawSMS = useMemo(() => {
    const alertId = alert?.id?.slice(-6) || "DEMO01";

    return [code, zone, action, contact, `#${alertId}`]
      .filter(Boolean)
      .join("|");
  }, [code, zone, action, contact, alert?.id]);

  const smsMessage = rawSMS.slice(0, 160);
  const tooLong = rawSMS.length > 160;

  const simulateSend = () => {
    if (sending) return;

    setSending(true);
    setDeliveryText(`Sending through ${network.name}...`);

    setQueue((current) =>
      current.map((item, index) =>
        index === 1 ? { ...item, status: "sending" } : item
      )
    );

    window.setTimeout(() => {
      const finalStatus = networkId === "offline" ? "relayed" : "delivered";

      setQueue((current) =>
        current.map((item, index) =>
          index === 1 ? { ...item, status: finalStatus } : item
        )
      );

      setSending(false);
      setDeliveryText(
        networkId === "offline"
          ? `Message relayed through community network in ${network.delay / 1000}s.`
          : `Message delivered in ${network.delay / 1000}s.`
      );

      onDeliveryEvent({
        id: `SIM-${Date.now()}`,
        name: "Demo Recipient",
        zone: zone.replace("ZONE:", "") || "Unknown",
        channel: networkId === "offline" ? "Community Relay" : "SMS",
        status: finalStatus,
        ack: false,
        time: new Date().toLocaleTimeString(),
      });
    }, network.delay);
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-orange-400">
          LOW-BANDWIDTH DELIVERY
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          SMS & Network Simulator
        </h1>
        <p className="mt-2 text-slate-400">
          Test delivery under internet, 3G, 2G, SMS-only, and offline relay
          conditions.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-lg font-bold text-white">
            📡 Network Condition
          </h2>

          <div className="space-y-3">
            {Object.entries(NETWORKS).map(([id, item]) => (
              <button
                key={id}
                onClick={() => setNetworkId(id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  networkId === id
                    ? "border-orange-400 bg-orange-500/10"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-lg font-black"
                    style={{ color: item.color }}
                  >
                    {item.signal}
                  </span>

                  <span>
                    <span className="block font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.speed}
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">CURRENT MODE</p>
            <p className="mt-1 font-bold" style={{ color: network.color }}>
              {network.name}
            </p>
            <p className="mt-1 text-xs text-slate-400">{network.speed}</p>
          </div>
        </section>

        <section className="flex flex-col items-center rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-lg font-bold text-white">📱 Phone Preview</h2>

          <div className="w-64 rounded-[2.3rem] border-8 border-slate-700 bg-slate-950 p-3 shadow-2xl">
            <div className="overflow-hidden rounded-[1.7rem] bg-slate-800">
              <div className="flex justify-between bg-slate-900 px-4 py-2 text-xs text-slate-300">
                <span>9:41</span>
                <span style={{ color: network.color }}>{network.signal}</span>
              </div>

              <div className="min-h-[330px] p-4">
                <div className="rounded-2xl bg-red-950 p-3">
                  <p className="text-xs font-bold text-red-300">
                    🚨 EMERGENCY ALERT
                  </p>
                  <p className="mt-2 break-words text-xs leading-5 text-slate-100">
                    {smsMessage}
                  </p>
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                  {deliveryText}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={simulateSend}
            disabled={sending || tooLong}
            className="mt-5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending..." : "📤 Simulate Send"}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-lg font-bold text-white">
            ✉️ SMS Format Builder
          </h2>

          <div className="space-y-3">
            <TextInput label="Alert Code" value={code} onChange={setCode} />
            <TextInput label="Zone Code" value={zone} onChange={setZone} />
            <TextInput label="Action Code" value={action} onChange={setAction} />
            <TextInput label="Emergency Contact" value={contact} onChange={setContact} />
          </div>

          <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-bold text-slate-400">
              GENERATED SMS — 160 CHARACTER LIMIT
            </p>

            <p className="mt-3 break-all font-mono text-sm leading-6 text-emerald-300">
              {smsMessage}
            </p>

            <p
              className={`mt-3 text-xs font-bold ${
                tooLong ? "text-red-400" : "text-slate-400"
              }`}
            >
              {rawSMS.length}/160 characters
              {tooLong ? " — Reduce text before sending." : ""}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <h2 className="mb-4 text-lg font-bold text-white">📋 Delivery Queue</h2>

        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">Recipient</th>
                <th className="px-4 py-3 font-bold">Zone</th>
                <th className="px-4 py-3 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900/50">
              {queue.map((recipient) => (
                <tr key={recipient.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{recipient.phone}</p>
                    <p className="mt-1 text-xs text-slate-500">{recipient.id}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{recipient.zone}</td>
                  <td className="px-4 py-4 text-right"><StatusBadge status={recipient.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-400"
      />
    </label>
  );
}

function StatusBadge({ status }) {
  const styles = {
    delivered: "bg-emerald-950 text-emerald-300",
    relayed: "bg-blue-950 text-blue-300",
    waiting: "bg-slate-700 text-slate-300",
    sending: "bg-amber-950 text-amber-300",
    failed: "bg-red-950 text-red-300",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || styles.waiting
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}