import { useState } from "react";

export default function PlainLanguage({ alert }) {
  const [copyMessage, setCopyMessage] = useState("");

  const copySimplifiedText = async () => {
    if (!alert?.simplifiedText) return;

    try {
      await navigator.clipboard.writeText(alert.simplifiedText);
      setCopyMessage("Simplified alert copied to clipboard.");
    } catch {
      setCopyMessage("Could not copy automatically. Please copy manually.");
    }

    setTimeout(() => setCopyMessage(""), 2500);
  };

  if (!alert) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center">
        <div className="text-5xl">✍️</div>
        <h2 className="mt-4 text-2xl font-bold text-white">
          Process an alert first
        </h2>
        <p className="mt-2 text-slate-400">
          Go to Create Alert, load a sample or enter an official alert, then
          click Process Alert.
        </p>
      </section>
    );
  }

  const keyInfo = alert.keyInfo || {};

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-emerald-400">
          ACCESSIBILITY PROCESSOR
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Plain Language Version
        </h1>
        <p className="mt-2 text-slate-400">
          The original official message is kept unchanged. The simplified
          version is clearly labelled as an accessibility version.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-red-900 bg-red-950/30 p-5 text-center">
          <p className="text-sm text-slate-400">Original complexity</p>
          <p className="mt-1 text-3xl font-black text-red-400">Grade 12</p>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <span className="text-4xl text-slate-400">→</span>
        </div>

        <div className="rounded-2xl border border-emerald-900 bg-emerald-950/30 p-5 text-center">
          <p className="text-sm text-slate-400">Simplified target</p>
          <p className="mt-1 text-3xl font-black text-emerald-400">Grade 5</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border-l-4 border-red-500 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
              OFFICIAL SOURCE
            </span>
            <span className="text-xs text-slate-400">
              Preserved without changes
            </span>
          </div>

          <pre className="max-h-[520px] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
            {alert.officialText}
          </pre>
        </article>

        <article className="rounded-2xl border-l-4 border-emerald-500 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
              SIMPLIFIED VERSION
            </span>
            <span className="text-xs text-slate-400">
              Accessibility output
            </span>
          </div>

          <pre className="max-h-[520px] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-7 text-slate-100">
            {alert.simplifiedText}
          </pre>

          <button
            onClick={copySimplifiedText}
            className="mt-5 rounded-xl border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
          >
            📋 Copy Simplified Alert
          </button>

          {copyMessage && (
            <p className="mt-3 text-sm text-emerald-300">{copyMessage}</p>
          )}
        </article>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <h2 className="text-lg font-bold text-white">
          📌 Key Information Extracted
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard title="WHAT" text={keyInfo.what || "Emergency alert"} />
          <InfoCard title="WHERE" text={keyInfo.where || alert.area} />
          <InfoCard title="WHEN" text={keyInfo.when || "Check official updates"} />
          <InfoCard
            title="ACTION"
            text={keyInfo.action || "Follow official instructions"}
            danger
          />
        </div>
      </section>
    </section>
  );
}

function InfoCard({ title, text, danger = false }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
      <p className="text-xs font-bold tracking-wider text-slate-400">{title}</p>
      <p
        className={`mt-2 text-sm font-bold ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {text}
      </p>
    </div>
  );
}