"use client";

import { useMemo, useState } from "react";

type Winner = {
  product_name: string;
  positioning: string;
  why_it_works: string[];
  ad_hooks: string[];
  landing_headline: string;
  feature_bullets: string[];
  pricing: { anchor: string; sale: string; bundle: string };
  supplier_search: { keywords: string[]; specs: string[] };
  risk_notes: string[];
};

type Pack = {
  pack_title: string;
  winners: Winner[];
};

export default function Home() {
  const [market, setMarket] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [channel, setChannel] = useState("");

  const [raw, setRaw] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  // ✅ 잠금 관련 상태
  const [packId, setPackId] = useState<string>("");
  const [locked, setLocked] = useState<boolean>(false);

  const pack: Pack | null = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Pack;
    } catch {
      return null;
    }
  }, [raw]);

  const fetchFullIfUnlocked = async (id: string) => {
    const res = await fetch(`/api/pack?id=${encodeURIComponent(id)}`);
    const data = await res.json().catch(() => ({}));
    const text = String(data?.result ?? "");
    setLocked(Boolean(data?.locked));
    if (text) setRaw(text);
  };

  const generate = async () => {
    setErr("");
    setRaw("");
    setPackId("");
    setLocked(false);

    if (!market || !category || !price || !channel) {
      alert("Please select all options.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market, category, price, channel }),
      });

      const data = await res.json();
      const id = String(data?.packId ?? "");
      const text = String(data?.result ?? "");
      const isLocked = Boolean(data?.locked);

      setPackId(id);
      setLocked(isLocked);
      setRaw(text);

      // 프리뷰도 JSON이어야 카드 렌더됨
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

  // ✅ 로컬 테스트용 언락 버튼 (나중에 Lemon 결제로 교체)
  const unlockDev = async () => {
    if (!packId) return;

    const secret = prompt("DEV secret? (from .env.local)") ?? "";
    try {
      const res = await fetch("/api/dev-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, secret }),
      });

      if (!res.ok) {
        setErr("Unlock failed. Check DEV secret.");
        return;
      }

      // 언락 후 full 다시 요청
      await fetchFullIfUnlocked(packId);
    } catch {
      setErr("Unlock request failed.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0B1220] flex justify-center">
      <div className="w-full max-w-5xl px-6 py-12 space-y-8">
        {/* HERO */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Dropshippers get 3 ready-to-sell product packs in 30 seconds.
          </h1>
          <p className="text-[#5B6472]">
            Monthly sales packs with ad hooks, store copy and pricing — no more guessing what to sell.
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="border border-[#E6EAF0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Pack Settings</h2>
            <span className="text-xs text-[#5B6472]">{loading ? "Generating..." : "Select 4 options"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="border border-[#E6EAF0] rounded-md p-2"
            >
              <option value="">Market</option>
              <option>US</option>
              <option>UK</option>
              <option>Global</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[#E6EAF0] rounded-md p-2"
            >
              <option value="">Category</option>
              <option>Pet</option>
              <option>Home</option>
              <option>Beauty</option>
              <option>Fitness</option>
              <option>Baby</option>
            </select>

            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-[#E6EAF0] rounded-md p-2"
            >
              <option value="">Price Range</option>
              <option>$10-25</option>
              <option>$25-50</option>
              <option>$50+</option>
            </select>

            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="border border-[#E6EAF0] rounded-md p-2"
            >
              <option value="">Ad Channel</option>
              <option>TikTok</option>
              <option>Meta</option>
              <option>Google</option>
            </select>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-[#3CCB7F] text-white py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Pack"}
          </button>

          {err && <div className="text-sm text-red-600">{err}</div>}
        </div>

        {/* RENDERED RESULT */}
        {pack && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#5B6472]">Generated Pack</div>
                <h2 className="text-xl font-semibold">{pack.pack_title}</h2>
              </div>

              {/* ✅ 잠금 상태일 때만 임시 언락 버튼 표시 */}
              {locked && (
                <button
                  onClick={unlockDev}
                  className="bg-black text-white px-4 py-2 rounded-md"
                  title="Local dev only"
                >
                  Unlock (DEV)
                </button>
              )}
            </div>

            {/* ✅ “전체 결과 블러” (UI용) */}
            <div className="relative">
              <div className={locked ? "filter blur-md pointer-events-none select-none" : ""}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {pack.winners?.slice(0, 3).map((w, idx) => (
                    <div key={idx} className="border border-[#E6EAF0] rounded-lg p-5 space-y-3">
                      <div className="text-xs text-[#5B6472]">Winner #{idx + 1}</div>

                      <div className="space-y-1">
                        <div className="text-lg font-semibold">{w.product_name}</div>
                        <div className="text-sm text-[#5B6472]">{w.positioning}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold">Why it works</div>
                        <ul className="text-sm text-[#0B1220] list-disc pl-5 space-y-1">
                          {(w.why_it_works ?? []).slice(0, 3).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold">Ad hooks</div>
                        <ul className="text-sm text-[#0B1220] list-disc pl-5 space-y-1">
                          {(w.ad_hooks ?? []).slice(0, 3).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold">Pricing</div>
                        <div className="text-sm text-[#0B1220]">
                          <span className="text-[#5B6472]">Anchor:</span> {w.pricing?.anchor}{" "}
                          <span className="text-[#5B6472] ml-2">Sale:</span> {w.pricing?.sale}
                          <div className="text-[#5B6472] mt-1">Bundle: {w.pricing?.bundle}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold">Supplier search</div>
                        <div className="text-xs text-[#5B6472]">Keywords</div>
                        <div className="text-sm">{(w.supplier_search?.keywords ?? []).join(", ")}</div>
                        <div className="text-xs text-[#5B6472] mt-2">Specs</div>
                        <div className="text-sm">{(w.supplier_search?.specs ?? []).join(", ")}</div>
                      </div>

                      {(w.risk_notes?.length ?? 0) > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">Risk notes</div>
                          <ul className="text-sm text-[#0B1220] list-disc pl-5 space-y-1">
                            {w.risk_notes.slice(0, 2).map((x, i) => (
                              <li key={i}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ 블러 위 오버레이 */}
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 border border-[#E6EAF0] rounded-lg px-5 py-4 text-center space-y-2">
                    <div className="font-semibold">This pack is locked.</div>
                    <div className="text-sm text-[#5B6472]">Pay to unlock the full results.</div>
                    <div className="text-xs text-[#5B6472]">(For now: DEV unlock button above)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!pack && raw && !err && (
          <div className="text-sm text-[#5B6472]">Generated output received. (Waiting for valid JSON...)</div>
        )}
      </div>
    </main>
  );
}
