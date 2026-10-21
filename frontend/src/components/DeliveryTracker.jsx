import { useMemo } from "react";

const BASE_RECORDS = [
  {
    id: "R001",
    name: "Amit Kumar",
    zone: "A",
    channel: "SMS",
    status: "acknowledged",
    ack: true,
    time: "09:15",
  },
  {
    id: "R002",
    name: "Priya Sharma",
    zone: "A",
    channel: "App",
    status: "delivered",
    ack: false,
    time: "09:15",
  },
  {
    id: "R003",
    name: "Ravi Das",
    zone: "B",
    channel: "SMS",
    status: "read",
    ack: true,
    time: "09:16",
  },
  {
    id: "R004",
    name: "Fatima Begum",
    zone: "B",
    channel: "Radio",
    status: "delivered",
    ack: false,
    time: "09:17",
  },
  {
    id: "R005",
    name: "John Xavier",
    zone: "C",
    channel: "SMS",
    status: "failed",
    ack: false,
    time: "09:18",
  },
  {
    id: "R006",
    name: "Lakshmi Devi",
    zone: "A",
    channel: "App",
    status: "acknowledged",
    ack: true,
    time: "09:20",
  },
];

export default function DeliveryTracker({ deliveryEvents = [] }) {
  const records = useMemo(() => {
    const events = Array.isArray(deliveryEvents) ? deliveryEvents : [];

    return [
      ...events.map((event) => ({
        id: event.id,
        name: event.name || "Demo Recipient",
        zone: event.zone || "Unknown",
        channel: event.channel || "SMS",
        status: event.status || "delivered",
        ack: Boolean(event.ack),
        time: event.time || new Date().toLocaleTimeString(),
      })),
      ...BASE_RECORDS,
    ];
  }, [deliveryEvents]);

  const metrics = useMemo(() => {
    const total = records.length;

    const delivered = records.filter((record) =>
      ["delivered", "read", "acknowledged", "relayed"].includes(record.status)
    ).length;

    const read = records.filter((record) =>
      ["read", "acknowledged"].includes(record.status)
    ).length;

    const acknowledged = records.filter((record) => record.ack).length;

    const failed = records.filter((record) => record.status === "failed").length;

    const percent = (value) =>
      total ? Math.round((value / total) * 100) : 0;

    return {
      total,
      delivered,
      read,
      acknowledged,
      failed,
      deliveryRate: percent(delivered),
      readRate: percent(read),
      ackRate: percent(acknowledged),
    };
  }, [records]);

  const exportCSV = () => {
    const header = [
      "Recipient ID",
      "Name",
      "Zone",
      "Channel",
      "Status",
      "Acknowledged",
      "Time",
    ];

    const escape = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;

    const rows = records.map((record) =>
      [
        record.id,
        record.name,
        record.zone,
        record.channel,
        record.status,
        record.ack ? "Yes" : "No",
        record.time,
      ]
        .map(escape)
        .join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lastmile-delivery-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-cyan-400">
          DELIVERY MONITORING
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Delivery & Acknowledgement Tracker
        </h1>
        <p className="mt-2 text-slate-400">
          Monitor alert delivery, reading status, acknowledgement, and delivery
          failures.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Sent" value={metrics.total} color="text-white" />
        <MetricCard
          label="Delivered"
          value={metrics.delivered}
          subtitle={`${metrics.deliveryRate}% delivery`}
          color="text-emerald-400"
        />
        <MetricCard
          label="Read"
          value={metrics.read}
          subtitle={`${metrics.readRate}% read`}
          color="text-blue-400"
        />
        <MetricCard
          label="Acknowledged"
          value={metrics.acknowledged}
          subtitle={`${metrics.ackRate}% confirmed`}
          color="text-orange-400"
        />
        <MetricCard
          label="Failed"
          value={metrics.failed}
          subtitle={`${metrics.total ? Math.round((metrics.failed / metrics.total) * 100) : 0}% failed`}
          color="text-red-400"
        />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <h2 className="text-lg font-bold text-white">📊 Delivery Pipeline</h2>

        <div className="mt-5 space-y-5">
          <ProgressRow label="Sent" value={metrics.total} percent={100} color="#F97316" />
          <ProgressRow
            label="Delivered"
            value={metrics.delivered}
            percent={metrics.deliveryRate}
            color="#22C55E"
          />
          <ProgressRow
            label="Read"
            value={metrics.read}
            percent={metrics.readRate}
            color="#3B82F6"
          />
          <ProgressRow
            label="Acknowledged"
            value={metrics.acknowledged}
            percent={metrics.ackRate}
            color="#F59E0B"
          />
          <ProgressRow
            label="Failed"
            value={metrics.failed}
            percent={metrics.total ? Math.round((metrics.failed / metrics.total) * 100) : 0}
            color="#EF4444"
          />
        </div>

        {metrics.deliveryRate < 80 && (
          <div className="mt-5 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
            ⚠️ Delivery rate is below 80%. Consider SMS retry, radio broadcast,
            or community relay support.
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              👥 Recipient Delivery Status
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Demo recipient information — use synthetic data only.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
          >
            📥 Export CSV
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Zone</th>
                <th className="px-3 py-3">Channel</th>
                <th className="px-3 py-3">Time</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Acknowledged</th>
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-800 text-slate-300 transition hover:bg-slate-800/70"
                >
                  <td className="px-3 py-4">
                    <p className="font-semibold text-white">{record.name}</p>
                    <p className="text-xs text-slate-500">{record.id}</p>
                  </td>

                  <td className="px-3 py-4">Zone {record.zone}</td>
                  <td className="px-3 py-4">{record.channel}</td>
                  <td className="px-3 py-4 text-slate-400">{record.time}</td>

                  <td className="px-3 py-4">
                    <StatusBadge status={record.status} />
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={
                        record.ack ? "font-bold text-emerald-400" : "text-slate-500"
                      }
                    >
                      {record.ack ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function MetricCard({ label, value, subtitle, color }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
      {subtitle && <p className={`mt-1 text-xs ${color}`}>{subtitle}</p>}
    </article>
  );
}

function ProgressRow({ label, value, percent, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="text-slate-400">
          {value} <span style={{ color }}>({percent}%)</span>
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    delivered: "bg-yellow-950 text-yellow-300",
    read: "bg-blue-950 text-blue-300",
    acknowledged: "bg-green-950 text-green-300",
    relayed: "bg-purple-950 text-purple-300",
    failed: "bg-red-950 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-700 text-slate-300"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}