"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSkin } from "@/skins/registry";

type Pack = {
  pack_title: string;
  winners: [any, any, any];
};

export default function HomeClient() {
  const searchParams = useSearchParams();
  const skinId = searchParams.get("skin") ?? "email-sequence-pack";
  const skin = getSkin(skinId);

  const [values, setValues] = useState<Record<string, string>>({});
  const [raw, setRaw] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const pack: Pack | null = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Pack;
    } catch {
      return null;
    }
  }, [raw]);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const getValue = (key: string) => {
    return String(values?.[key] ?? "");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generate = async () => {
    setErr("");
    setRaw("");

    for (const input of skin.inputs) {
      if (!String(values?.[input.key] ?? "").trim()) {
        alert("Please select all options.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skinId: skin.id, values }),
      });

      const data = await res.json();

      if (data.error) {
        setErr(data.error);
        return;
      }

      const text = String(data?.result ?? "");
      setRaw(text);

      try {
        JSON.parse(text);
      } catch {
        setErr("Output format was not valid JSON. Click Generate again.");
      }
    } catch {
      setErr("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Winner 렌더링 함수
const renderWinnerField = (label: string, value: any, copyId: string) => {
  if (!value) return null;

  // ✅ Day-by-Day Sequence 특별 처리
  if (label === "Day By Day Sequence" && typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className="space-y-3" key={copyId}>
        <div className="text-sm font-semibold text-[#0B1220]">{label}</div>
        {Object.entries(value).map(([dayKey, dayData]: [string, any]) => (
          <div key={dayKey} className="bg-[#F8FAFB] p-4 rounded-lg border border-[#E6EAF0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[#0B1220]">
                {dayKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <button
                onClick={() => {
                  const emailText = `Subject: ${dayData.subject}\n\n${dayData.body}\n\nPsychology: ${dayData.psychology}\nTiming: ${dayData.timing}`;
                  copyToClipboard(emailText, `${copyId}-${dayKey}`);
                }}
                className="text-xs bg-white border border-[#E6EAF0] px-3 py-1 rounded hover:border-[#3CCB7F] transition-colors"
              >
                {copied === `${copyId}-${dayKey}` ? "✓ Copied" : "Copy"}
              </button>
            </div>
            
            {dayData.subject && (
              <div>
                <span className="text-xs font-semibold text-[#5B6472]">Subject:</span>
                <div className="text-sm text-[#0B1220] mt-1">{dayData.subject}</div>
              </div>
            )}
            
            {dayData.body && (
              <div>
                <span className="text-xs font-semibold text-[#5B6472]">Body:</span>
                <div className="text-sm text-[#0B1220] whitespace-pre-wrap mt-1">{dayData.body}</div>
              </div>
            )}
            
            {dayData.psychology && (
              <div>
                <span className="text-xs font-semibold text-[#5B6472]">Why This Works:</span>
                <div className="text-sm text-[#0B1220] mt-1">{dayData.psychology}</div>
              </div>
            )}
            
            {dayData.timing && (
              <div>
                <span className="text-xs font-semibold text-[#5B6472]">Timing:</span>
                <div className="text-sm text-[#0B1220] mt-1">{dayData.timing}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 배열인 경우
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2" key={copyId}>
        <div className="text-sm font-semibold text-[#0B1220]">{label}</div>
        <ul className="space-y-1">
          {value.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[#5B6472]">•</span>
              <span className="text-[#0B1220]">{String(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 객체인 경우 (중첩) - Revenue Modeling 등
  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-2" key={copyId}>
        <div className="text-sm font-semibold text-[#0B1220]">{label}</div>
        <div className="bg-[#F8FAFB] p-3 rounded border border-[#E6EAF0] space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="text-sm">
              <span className="text-[#5B6472] font-medium">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:{" "}
              </span>
              <span className="text-[#0B1220]">{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 긴 텍스트인 경우 (500자 이상만 Copy 버튼 + 박스)
  const strValue = String(value);
  if (strValue.length > 500) {
    return (
      <div className="space-y-2" key={copyId}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-[#0B1220]">{label}</div>
          <button
            onClick={() => copyToClipboard(strValue, copyId)}
            className="text-xs bg-white border border-[#E6EAF0] px-3 py-1 rounded hover:border-[#3CCB7F] transition-colors"
          >
            {copied === copyId ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <div className="bg-[#F8FAFB] p-4 rounded-lg border border-[#E6EAF0]">
          <pre className="text-sm text-[#0B1220] whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">
            {strValue}
          </pre>
        </div>
      </div>
    );
  }

  // ✅ 짧은 텍스트 (500자 미만) - Copy 버튼 없음, 박스 없음
  return (
    <div className="space-y-1" key={copyId}>
      <div className="text-sm font-semibold text-[#0B1220]">{label}</div>
      <div className="text-sm text-[#0B1220] leading-relaxed">{strValue}</div>
    </div>
  );
};

  return (
    <main className="min-h-screen bg-white text-[#0B1220] flex justify-center">
      <div className="w-full max-w-7xl px-6 py-12 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">{skin.brand.headline}</h1>
          <p className="text-[#5B6472]">{skin.brand.subheadline}</p>
        </div>

        <div className="border border-[#E6EAF0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Pack Settings</h2>
            <span className="text-xs text-[#5B6472]">
              {loading ? "Generating..." : `Select ${skin.inputs.length} options`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skin.inputs.map((input) => (
              <select
                key={input.key}
                value={getValue(input.key)}
                onChange={(e) => setValue(input.key, e.target.value)}
                className="border border-[#E6EAF0] rounded-md p-2"
              >
                <option value="">{input.label}</option>
                {input.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* ✅ Generate 버튼만 초록색 */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-[#3CCB7F] text-white py-2 rounded-md disabled:opacity-60 hover:bg-[#2FB36D] transition-colors"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {err && <div className="text-sm text-red-600">{err}</div>}
        </div>

        {pack && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[#5B6472]">Generated Pack</div>
              <h2 className="text-xl font-semibold">{pack.pack_title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pack.winners.map((w, idx) => {
                // ✅ title 또는 첫 번째 필드를 제목으로
                const title = w.title || w.name || Object.values(w)[0] || `Idea ${idx + 1}`;
                
                // ✅ title/name 제외한 나머지 모든 필드
                const allFields = Object.entries(w).filter(
                  ([key]) => !['title', 'name'].includes(key)
                );

                return (
                  <div key={idx} className="border border-[#E6EAF0] rounded-lg p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="text-xs text-[#5B6472]">Winner #{idx + 1}</div>
                        <h3 className="text-xl font-bold text-[#0B1220]">
                          {typeof title === 'string' ? title : JSON.stringify(title)}
                        </h3>
                      </div>
                      {/* ✅ Copy All 버튼 작게 */}
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(w, null, 2), `winner-all-${idx}`)}
                        className="text-xs bg-white border border-[#E6EAF0] px-3 py-1.5 rounded hover:border-[#0B1220] transition-colors self-start"
                      >
                        {copied === `winner-all-${idx}` ? "✓ Copied" : "Copy All"}
                      </button>
                    </div>

                    {/* ✅ 모든 필드 동일하게 표시 (구분 없음) */}
                    <div className="space-y-4">
                      {allFields.map(([key, value]) => 
                        renderWinnerField(
                          key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value,
                          `field-${idx}-${key}`
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!pack && raw && !err && (
          <div className="text-sm text-[#5B6472]">
            Generated output received. (Waiting for valid JSON...)
          </div>
        )}
      </div>
    </main>
  );
}