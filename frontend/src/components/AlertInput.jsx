import { useState } from "react";

const TYPE_META = [
  { value: "flood", label: "Flood", icon: "🌊" },
  { value: "cyclone", label: "Cyclone", icon: "🌀" },
  { value: "earthquake", label: "Earthquake", icon: "🏔️" },
  { value: "fire", label: "Fire", icon: "🔥" },
];

const SAMPLE_ALERTS = {
  flood: {
    severity: "critical",
    area: "Zone A, District 5",
    officialText: `OFFICIAL FLOOD WARNING - NDMA

The river basin is experiencing critical flooding. Water levels are 3.2 meters above the danger mark. Mandatory evacuation is ordered for residents in affected floodplain zones.

Affected zones: A7, B3, C9
Expected peak water level: within 4 to 6 hours
Emergency contacts: 112 and 1070`,
    simplifiedText: `🚨 FLOOD WARNING — LEAVE NOW!

Water levels are dangerously high and rising fast.

📍 WHERE: Zone A, District 5
⏰ WHEN: Leave within the next 4 hours.

✅ WHAT TO DO:
• Leave your home now.
• Go to the nearest relief camp or high ground.
• Take ID, medicine, water, and food.
• Help children, older adults, and people with disabilities.

📞 Emergency help: 112
📞 Flood helpline: 1070`,
    keyInfo: {
      what: "Flood / rising water",
      where: "Zone A, District 5",
      when: "Within 4 hours",
      action: "EVACUATE NOW",
    },
  },

  cyclone: {
    severity: "high",
    area: "Coastal Region",
    officialText: `CYCLONE WARNING - INDIA METEOROLOGICAL DEPARTMENT

A severe cyclonic storm is approaching coastal districts. Wind speed may reach 120 to 140 km/h with stronger gusts. Heavy rainfall and storm surge are expected.

Expected landfall: 36 to 48 hours
Fishermen must not go to sea.
Coastal residents should prepare for evacuation.`,
    simplifiedText: `🌀 CYCLONE ALERT — GET READY!

A strong storm is coming toward coastal areas.

📍 WHERE: Coastal Region
⏰ WHEN: In the next 36 to 48 hours.

✅ WHAT TO DO:
• Keep food, water, medicine, and a torch ready.
• Know your nearest shelter location.
• Do not go near the sea.
• Stay indoors when the storm begins.

📞 Emergency help: 112`,
    keyInfo: {
      what: "Severe cyclone",
      where: "Coastal Region",
      when: "36–48 hours",
      action: "PREPARE FOR EVACUATION",
    },
  },

  fire: {
    severity: "high",
    area: "District B, Northern Forest Area",
    officialText: `FOREST FIRE ALERT - STATE FIRE EMERGENCY SERVICES

An active wildfire has been detected in the northern forest zone. Wind conditions may cause the fire to spread toward nearby residential communities.

Residents within a 5 km radius should remain ready for evacuation.`,
    simplifiedText: `🔥 FIRE ALERT — STAY READY!

A forest fire is spreading near homes.

📍 WHERE: District B, Northern Forest Area
⚠️ RISK: Fire may spread quickly because of wind.

✅ WHAT TO DO:
• Pack your emergency bag now.
• Keep doors and windows closed.
• Know your safe exit route.
• Be ready to leave when officials tell you.

📞 Fire service: 101
📞 Emergency help: 112`,
    keyInfo: {
      what: "Forest fire",
      where: "District B",
      when: "Monitor updates",
      action: "BE READY TO LEAVE",
    },
  },

  earthquake: {
    severity: "critical",
    area: "Central City Zone",
    officialText: `EARTHQUAKE ADVISORY - DISASTER MANAGEMENT AUTHORITY

Seismic activity has been recorded in the central city zone. Residents are advised to follow emergency safety procedures and avoid damaged buildings.

Aftershocks may occur.`,
    simplifiedText: `🏔️ EARTHQUAKE ALERT!

Earthquake activity has been reported.

📍 WHERE: Central City Zone
⚠️ RISK: Aftershocks may happen.

✅ WHAT TO DO:
• Drop, cover, and hold on.
• Stay away from damaged buildings.
• Do not use lifts.
• Move to an open safe area after shaking stops.

📞 Emergency help: 112`,
    keyInfo: {
      what: "Earthquake activity",
      where: "Central City Zone",
      when: "Immediate",
      action: "DROP, COVER, HOLD",
    },
  },
};

function createGenericSimplifiedAlert(type, severity, area) {
  const typeName = type.toUpperCase();
  const actionMap = {
    flood: "MOVE TO HIGH GROUND OR A RELIEF CAMP",
    cyclone: "PREPARE FOR SHELTER OR EVACUATION",
    fire: "BE READY TO LEAVE QUICKLY",
    earthquake: "DROP, COVER, AND HOLD ON",
  };

  return `🚨 ${typeName} ALERT — ${severity.toUpperCase()}

📍 AFFECTED AREA: ${area || "Area not specified"}

✅ WHAT TO DO:
• Follow official safety instructions.
• Stay away from dangerous areas.
• Help children, older adults, and people with disabilities.
• Keep your phone charged.

⚠️ ACTION: ${actionMap[type] || "FOLLOW OFFICIAL INSTRUCTIONS"}

📞 Emergency help: 112`;
}

export default function AlertInput({ onProcess }) {
  const [type, setType] = useState("flood");
  const [severity, setSeverity] = useState("critical");
  const [area, setArea] = useState("");
  const [officialText, setOfficialText] = useState("");
  const [message, setMessage] = useState("");

  const loadSample = (selectedType) => {
    const sample = SAMPLE_ALERTS[selectedType];

    setType(selectedType);
    setSeverity(sample.severity);
    setArea(sample.area);
    setOfficialText(sample.officialText);
    setMessage(`${selectedType.toUpperCase()} sample loaded.`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!officialText.trim()) {
      setMessage("Please enter or load an official alert first.");
      return;
    }

    const sample = SAMPLE_ALERTS[type];
    const isExactSample =
      sample &&
      officialText.trim() === sample.officialText.trim();

    const alert = {
      id: `ALT-${Date.now()}`,
      type,
      severity,
      area: area || "Area not specified",
      officialText,
      simplifiedText: isExactSample
        ? sample.simplifiedText
        : createGenericSimplifiedAlert(type, severity, area),
      keyInfo: isExactSample
        ? sample.keyInfo
        : {
            what: `${type} emergency`,
            where: area || "Area not specified",
            when: "Immediate attention required",
            action: "FOLLOW OFFICIAL INSTRUCTIONS",
          },
      createdAt: new Date().toLocaleString(),
    };

    onProcess(alert);
    setMessage("Alert processed successfully.");
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-orange-400">
          ALERT CREATION
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Create Emergency Alert
        </h1>
        <p className="mt-2 text-slate-400">
          Enter an official warning and create accessible versions for the
          last-mile population.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl md:p-7"
      >
        <label className="mb-3 block text-sm font-semibold text-slate-200">
          Alert Type
        </label>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {TYPE_META.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => setType(item.value)}
              aria-pressed={type === item.value}
              className={`rounded-xl border p-4 text-left transition ${
                type === item.value
                  ? "border-orange-500 bg-orange-500/15 ring-1 ring-orange-400"
                  : "border-slate-700 bg-slate-800 hover:border-slate-500"
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="mt-2 block font-semibold text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="severity"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Severity Level
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-400"
            >
              <option value="critical">🔴 Critical — Act immediately</option>
              <option value="high">🟠 High — Urgent response needed</option>
              <option value="medium">🟡 Medium — Stay prepared</option>
              <option value="low">🟢 Low — Stay informed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="area"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Affected Area
            </label>
            <input
              id="area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Example: Zone A, District 5"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>
        </div>

        <label
          htmlFor="official-alert"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          Official Alert Text
        </label>

        <textarea
          id="official-alert"
          rows="11"
          value={officialText}
          onChange={(event) => setOfficialText(event.target.value)}
          placeholder="Paste the official emergency warning here..."
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Official content is stored separately and never overwritten.</span>
          <span>{officialText.length} characters</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadSample("flood")}
            className="rounded-xl border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500 hover:text-white"
          >
            Load Flood Sample
          </button>

          <button
            type="button"
            onClick={() => loadSample("cyclone")}
            className="rounded-xl border border-purple-500 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500 hover:text-white"
          >
            Load Cyclone Sample
          </button>

        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-4 text-lg font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-red-500/30"
        >
          🚀 Process Alert
        </button>

        {message && (
          <p className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}