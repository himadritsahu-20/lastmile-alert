import { useEffect, useState } from "react";

const LANGUAGES = [
  {
    code: "hindi",
    name: "Hindi",
    native: "हिन्दी",
    flag: "🇮🇳",
    build: (alert) => `🚨 आपातकालीन चेतावनी

📍 प्रभावित क्षेत्र: ${alert.area}
⚠️ स्थिति: ${alert.keyInfo?.what || "आपातकाल"}
⏰ समय: ${alert.keyInfo?.when || "तुरंत"}

✅ क्या करें:
• तुरंत सुरक्षित स्थान पर जाएँ।
• सरकारी निर्देशों का पालन करें।
• बच्चों, बुजुर्गों और दिव्यांग लोगों की मदद करें।

📞 आपातकालीन सहायता: 112`,
  },
  {
    code: "bengali",
    name: "Bengali",
    native: "বাংলা",
    flag: "🇮🇳",
    build: (alert) => `🚨 জরুরি সতর্কবার্তা

📍 ক্ষতিগ্রস্ত এলাকা: ${alert.area}
⚠️ পরিস্থিতি: ${alert.keyInfo?.what || "জরুরি অবস্থা"}
⏰ সময়: ${alert.keyInfo?.when || "এখনই"}

✅ কী করবেন:
• দ্রুত নিরাপদ স্থানে যান।
• সরকারি নির্দেশ মেনে চলুন।
• শিশু, বৃদ্ধ ও প্রতিবন্ধী ব্যক্তিদের সাহায্য করুন।

📞 জরুরি সাহায্য: 112`,
  },
  {
    code: "tamil",
    name: "Tamil",
    native: "தமிழ்",
    flag: "🇮🇳",
    build: (alert) => `🚨 அவசர எச்சரிக்கை

📍 பாதிக்கப்பட்ட பகுதி: ${alert.area}
⚠️ நிலைமை: ${alert.keyInfo?.what || "அவசரநிலை"}
⏰ நேரம்: ${alert.keyInfo?.when || "உடனடியாக"}

✅ என்ன செய்ய வேண்டும்:
• உடனே பாதுகாப்பான இடத்திற்குச் செல்லுங்கள்.
• அதிகாரப்பூர்வ அறிவுறுத்தல்களைப் பின்பற்றுங்கள்.
• குழந்தைகள் மற்றும் முதியோருக்கு உதவுங்கள்.

📞 அவசர உதவி: 112`,
  },
  {
    code: "telugu",
    name: "Telugu",
    native: "తెలుగు",
    flag: "🇮🇳",
    build: (alert) => `🚨 అత్యవసర హెచ్చరిక

📍 ప్రభావిత ప్రాంతం: ${alert.area}
⚠️ పరిస్థితి: ${alert.keyInfo?.what || "అత్యవసర పరిస్థితి"}
⏰ సమయం: ${alert.keyInfo?.when || "వెంటనే"}

✅ ఏమి చేయాలి:
• వెంటనే సురక్షిత ప్రాంతానికి వెళ్లండి.
• అధికారిక సూచనలను పాటించండి.
• పిల్లలు మరియు వృద్ధులకు సహాయం చేయండి.

📞 అత్యవసర సహాయం: 112`,
  },
  {
    code: "spanish",
    name: "Spanish",
    native: "Español",
    flag: "🇪🇸",
    build: (alert) => `🚨 ALERTA DE EMERGENCIA

📍 Área afectada: ${alert.area}
⚠️ Situación: ${alert.keyInfo?.what || "Emergencia"}
⏰ Cuándo: ${alert.keyInfo?.when || "Ahora"}

✅ QUÉ HACER:
• Vaya a un lugar seguro inmediatamente.
• Siga las instrucciones oficiales.
• Ayude a niños, personas mayores y personas con discapacidad.

📞 Ayuda de emergencia: 112`,
  },
  {
    code: "french",
    name: "French",
    native: "Français",
    flag: "🇫🇷",
    build: (alert) => `🚨 ALERTE D'URGENCE

📍 Zone touchée : ${alert.area}
⚠️ Situation : ${alert.keyInfo?.what || "Urgence"}
⏰ Quand : ${alert.keyInfo?.when || "Maintenant"}

✅ QUE FAIRE :
• Allez immédiatement dans un lieu sûr.
• Suivez les instructions officielles.
• Aidez les enfants, les personnes âgées et les personnes handicapées.

📞 Urgence : 112`,
  },
  {
    code: "arabic",
    name: "Arabic",
    native: "العربية",
    flag: "🇸🇦",
    rtl: true,
    build: (alert) => `🚨 تحذير طارئ

📍 المنطقة المتأثرة: ${alert.area}
⚠️ الحالة: ${alert.keyInfo?.what || "حالة طوارئ"}
⏰ الوقت: ${alert.keyInfo?.when || "الآن"}

✅ ماذا تفعل:
• انتقل إلى مكان آمن فوراً.
• اتبع التعليمات الرسمية.
• ساعد الأطفال وكبار السن وذوي الإعاقة.

📞 المساعدة الطارئة: 112`,
  },
  {
    code: "malay",
    name: "Malay",
    native: "Bahasa Melayu",
    flag: "🇲🇾",
    build: (alert) => `🚨 AMARAN KECEMASAN

📍 Kawasan terjejas: ${alert.area}
⚠️ Keadaan: ${alert.keyInfo?.what || "Kecemasan"}
⏰ Masa: ${alert.keyInfo?.when || "Sekarang"}

✅ APA YANG PERLU DILAKUKAN:
• Pergi ke tempat selamat dengan segera.
• Ikut arahan rasmi.
• Bantu kanak-kanak, warga emas dan orang kurang upaya.

📞 Bantuan kecemasan: 112`,
  },
];

export default function Translator({ alert }) {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("hindi");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setTranslations({});
    setLoading({});
    setNotice("");
  }, [alert?.id]);

  if (!alert) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center">
        <div className="text-5xl">🌐</div>
        <h2 className="mt-4 text-2xl font-bold text-white">
          No alert available for translation
        </h2>
        <p className="mt-2 text-slate-400">
          Process an alert first to create translated versions.
        </p>
      </section>
    );
  }

  const translateOne = (language) => {
    setSelectedLanguage(language.code);
    setLoading((current) => ({ ...current, [language.code]: true }));

    setTimeout(() => {
      setTranslations((current) => ({
        ...current,
        [language.code]: language.build(alert),
      }));

      setLoading((current) => ({ ...current, [language.code]: false }));
      setNotice(`${language.name} translation generated.`);
    }, 500);
  };

  const translateAll = () => {
    LANGUAGES.forEach((language, index) => {
      setTimeout(() => translateOne(language), index * 250);
    });

    setNotice("Generating translations in all supported languages...");
  };

  const selected = LANGUAGES.find(
    (language) => language.code === selectedLanguage
  );

  const selectedTranslation = translations[selectedLanguage];

  const copyTranslation = async () => {
    if (!selectedTranslation) return;

    try {
      await navigator.clipboard.writeText(selectedTranslation);
      setNotice("Translation copied to clipboard.");
    } catch {
      setNotice("Could not copy automatically.");
    }
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-widest text-blue-400">
          LANGUAGE ACCESSIBILITY
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Multi-Language Translator
        </h1>
        <p className="mt-2 text-slate-400">
          Every translated version is visibly separate from the official source
          alert.
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-blue-900 bg-blue-950/20 p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            SOURCE: SIMPLIFIED ENGLISH
          </span>
          <span className="text-xs text-slate-400">
            Original official source remains separate
          </span>
        </div>

        <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">
          {alert.simplifiedText}
        </pre>
      </section>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LANGUAGES.map((language) => {
          const isReady = Boolean(translations[language.code]);
          const isLoading = loading[language.code];

          return (
            <article
              key={language.code}
              dir={language.rtl ? "rtl" : "ltr"}
              className={`rounded-2xl border p-4 transition ${
                selectedLanguage === language.code
                  ? "border-orange-400 bg-orange-500/10"
                  : "border-slate-700 bg-slate-900/70"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{language.flag}</span>
                {isReady && (
                  <span className="rounded-full bg-emerald-950 px-2 py-1 text-xs text-emerald-300">
                    Ready
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-bold text-white">{language.name}</h3>
              <p className="text-sm text-slate-400">{language.native}</p>

              <button
                onClick={() => translateOne(language)}
                disabled={isLoading}
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Translating..." : isReady ? "Re-translate" : "Translate"}
              </button>
            </article>
          );
        })}
      </div>

      <button
        onClick={translateAll}
        className="mb-6 rounded-xl border border-blue-500 bg-blue-500/10 px-5 py-3 font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white"
      >
        🌐 Translate to All Languages
      </button>

      {selectedTranslation && selected && (
        <section
          dir={selected.rtl ? "rtl" : "ltr"}
          className="rounded-2xl border border-emerald-700 bg-slate-900/70 p-5"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
              TRANSLATED VERSION
            </span>
            <span className="text-sm font-semibold text-white">
              {selected.flag} {selected.name}
            </span>
            <span className="text-xs text-amber-300">
              Requires official human review before deployment
            </span>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-base leading-8 text-white">
            {selectedTranslation}
          </pre>

          <button
            onClick={copyTranslation}
            className="mt-5 rounded-xl border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
          >
            📋 Copy Translation
          </button>
        </section>
      )}

      {notice && <p className="mt-4 text-sm text-emerald-300">{notice}</p>}
    </section>
  );
}