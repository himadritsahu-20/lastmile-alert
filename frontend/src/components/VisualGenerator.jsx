import { useEffect, useRef, useState } from "react";

const TYPE_STYLE = {
  flood: {
    color: "#0284C7",
    dark: "#071827",
    icon: "🌊",
    title: "FLOOD WARNING",
  },
  cyclone: {
    color: "#F97316",
    dark: "#211208",
    icon: "🌀",
    title: "CYCLONE ALERT",
  },
  fire: {
    color: "#EF4444",
    dark: "#26090A",
    icon: "🔥",
    title: "FIRE ALERT",
  },
  earthquake: {
    color: "#A16207",
    dark: "#1F1605",
    icon: "🏔️",
    title: "EARTHQUAKE ALERT",
  },
};

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function shortText(text, maxLength = 25) {
  if (!text) return "Area not specified";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export default function VisualGenerator({ alert }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("");

  const currentAlert = alert || {
    type: "flood",
    severity: "critical",
    area: "Zone A, District 5",
    keyInfo: {
      action: "EVACUATE NOW",
    },
  };

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const style = TYPE_STYLE[currentAlert.type] || TYPE_STYLE.flood;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = style.dark;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = style.color;
    ctx.fillRect(0, 0, width, 170);

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.font = "bold 30px Arial";
    ctx.fillText("OFFICIAL EMERGENCY ALERT", 70, 65);

    ctx.font = "bold 52px Arial";
    ctx.fillText(style.title, 70, 125);

    ctx.textAlign = "center";
    ctx.font = "180px Arial";
    ctx.fillText(style.icon, width / 2, 420);

    roundedRect(ctx, 190, 500, 700, 90, 45);
    ctx.fillStyle = "#DC2626";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${currentAlert.severity || "CRITICAL"}`.toUpperCase(),
      width / 2,
      558
    );

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 52px Arial";
    ctx.fillText(
      currentAlert.keyInfo?.action || "FOLLOW OFFICIAL INSTRUCTIONS",
      width / 2,
      690
    );

    roundedRect(ctx, 65, 770, 450, 160, 24);
    roundedRect(ctx, 565, 770, 450, 160, 24);

    ctx.strokeStyle = style.color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 27px Arial";
    ctx.textAlign = "center";
    ctx.fillText("📍 LOCATION", 290, 825);
    ctx.fillText("📞 EMERGENCY HELP", 790, 825);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 34px Arial";
    ctx.fillText(shortText(currentAlert.area), 290, 885);
    ctx.fillText("112", 790, 885);

    ctx.fillStyle = style.color;
    ctx.fillRect(0, 1010, width, 70);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "LastMile Alert • Accessible Emergency Communication",
      width / 2,
      1055
    );

    setStatus("Visual alert generated.");
  };

  useEffect(() => {
    drawCard();
  }, [alert]);

  const downloadVisual = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `lastmile-${currentAlert.type || "alert"}-visual.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    setStatus("PNG image downloaded.");
  };

  const style = TYPE_STYLE[currentAlert.type] || TYPE_STYLE.flood;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-pink-400">
          VISUAL ACCESSIBILITY
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Visual Alert Generator
        </h1>
        <p className="mt-2 text-slate-400">
          Create high-contrast visual alert cards for people with low literacy
          or limited language access.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-lg font-bold text-white">
            🎨 Downloadable Alert Card
          </h2>

          <canvas
            ref={canvasRef}
            width="1080"
            height="1080"
            className="w-full rounded-xl border border-slate-700 bg-slate-950"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={drawCard}
              className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 font-bold text-white"
            >
              Generate Visual
            </button>

            <button
              onClick={downloadVisual}
              className="rounded-xl border border-slate-500 px-4 py-3 font-bold text-slate-200 transition hover:bg-slate-800"
            >
              ⬇️ Download PNG
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-lg font-bold text-white">
            🔣 Low-Literacy Icon Version
          </h2>

          <div
            className="rounded-2xl border p-7 text-center"
            style={{
              backgroundColor: `${style.dark}`,
              borderColor: style.color,
            }}
          >
            <p className="text-7xl">{style.icon}</p>

            <h3
              className="mt-4 text-3xl font-black"
              style={{ color: style.color }}
            >
              {style.title}
            </h3>

            <div className="mt-5 rounded-full bg-red-600 px-4 py-2 text-lg font-black text-white">
              {currentAlert.severity?.toUpperCase() || "CRITICAL"}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <IconInfo icon="📍" title="WHERE" text={shortText(currentAlert.area, 13)} />
              <IconInfo icon="⏰" title="WHEN" text={currentAlert.keyInfo?.when || "NOW"} />
              <IconInfo
                icon="🏃"
                title="ACTION"
                text={currentAlert.keyInfo?.action || "ACT NOW"}
              />
            </div>

            <div className="mt-6 rounded-xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Emergency help</p>
              <p className="text-3xl font-black text-white">📞 112</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h3 className="font-bold text-white">Severity Color Guide</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Legend color="#DC2626" text="RED — Evacuate immediately" />
              <Legend color="#F97316" text="ORANGE — High danger, prepare now" />
              <Legend color="#EAB308" text="YELLOW — Stay alert and monitor" />
              <Legend color="#16A34A" text="GREEN — All clear / safe" />
            </div>
          </div>
        </section>
      </div>

      {status && <p className="mt-4 text-sm text-emerald-300">{status}</p>}
    </section>
  );
}

function IconInfo({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
      <p className="text-2xl">{icon}</p>
      <p className="mt-1 text-[10px] font-bold text-slate-400">{title}</p>
      <p className="mt-1 break-words text-xs font-bold text-white">{text}</p>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-4 w-4 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-slate-300">{text}</span>
    </div>
  );
}