"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { SITE_WEATHER_CITY } from "../lib/weather-client";

const POPULAR_CITIES = ["北京","上海","广州","深圳","成都","杭州","武汉","西安","重庆","南京","苏州","长沙","郑州","天津","青岛"];

const WMO_EMOJI: Record<number, string> = {
  0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",
  51:"🌦️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",65:"⛈️",
  71:"🌨️",73:"❄️",75:"❄️",80:"🌧️",81:"🌧️",82:"⛈️",
  95:"⛈️",96:"⛈️",99:"⛈️",
};
const WMO_TEXT: Record<number, string> = {
  0:"晴",1:"晴少云",2:"多云",3:"阴",45:"雾",48:"雾凇",
  51:"小毛毛雨",53:"中毛毛雨",55:"大毛毛雨",
  61:"小雨",63:"中雨",65:"大雨",
  71:"小雪",73:"中雪",75:"大雪",
  80:"阵雨",81:"中阵雨",82:"大阵雨",
  95:"雷阵雨",96:"雷暴冰雹",99:"极端雷暴",
};

interface WeatherData {
  city: string;
  data: {
    date: string;
    day: string;
    high_temp: number;
    low_temp: number;
    real_time_weather: {
      temperature: string; weather: string; wind_dir: string;
      wind_speed: string; humidity: string; time: string;
    }[];
  }[];
}

interface Props { compact?: boolean }

export default function WeatherWidget({ compact = false }: Props) {
  const [city, setCity] = useState(() => localStorage.getItem("weather_city") || "");
  const [inputVal, setInputVal] = useState(city);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const fetchWeather = useCallback(async (c: string) => {
    if (!c.trim()) return;
    setLoading(true); setError("");
    try {
      const r = await fetch(`/api/weather?city=${encodeURIComponent(c)}`);
      const d = await r.json();
      if (d.error) { setError(d.error); setWeather(null); }
      else { setWeather(d); localStorage.setItem("weather_city", c); setCity(c); }
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  }, []);

  // 初始化：优先 localStorage，再配置默认值
  useEffect(() => {
    if (city) { fetchWeather(city); return; }
    const saved = localStorage.getItem("weather_city");
    if (saved) { setCity(saved); setInputVal(saved); fetchWeather(saved); return; }
    if (SITE_WEATHER_CITY) { setCity(SITE_WEATHER_CITY); setInputVal(SITE_WEATHER_CITY); fetchWeather(SITE_WEATHER_CITY); }
  }, []);

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => { if (inputVal.trim()) fetchWeather(inputVal.trim()); setOpen(false); };
  const handleCityPick = (c: string) => { setInputVal(c); fetchWeather(c); setOpen(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  const today = weather?.data?.[0];
  const cw = today?.real_time_weather?.[0];

  if (compact) {
    if (!weather) return null;
    const code = weather.data?.[0]?.real_time_weather?.[0];
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-lg">🌤️</span>
        <span>{city}</span>
        <span className="font-medium">{today?.low_temp ?? "–"}°-{today?.high_temp ?? "–"}°</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      {/* 城市选择器 */}
      <div className="flex items-center gap-2 mb-3" ref={dropRef}>
        <span className="text-sm text-slate-400">🌦️</span>
        <div className="relative flex-1">
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="输入城市，回车确认…"
            className="w-full bg-white/10 dark:bg-black/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none focus:border-indigo-400 transition-colors"
          />
          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-slate-400 px-2 py-1 mb-1">热门城市</div>
                <div className="grid grid-cols-3 gap-1">
                  {POPULAR_CITIES.map(c => (
                    <button key={c} onClick={() => handleCityPick(c)}
                      className="text-xs px-2 py-1.5 rounded-lg hover:bg-indigo-500/30 text-slate-200 transition-colors text-left">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button onClick={handleSearch} disabled={loading}
          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
          {loading ? "…" : "查询"}
        </button>
      </div>

      {/* 天气内容 */}
      {error && <div className="text-center text-red-400 text-sm py-2">{error}</div>}

      {!error && weather && today && (
        <div className="flex items-center gap-4">
          <span className="text-5xl">{WMO_EMOJI[today.real_time_weather?.[0] ? parseInt(String(today.real_time_weather[0].temperature)) || 0 : 0] ?? "🌤️"}</span>
          <div>
            <div className="text-xs text-slate-400">{city}</div>
            <div className="text-3xl font-bold">{cw?.temperature ?? `${today.low_temp}°–${today.high_temp}°`}</div>
            <div className="text-sm text-slate-400">{cw?.weather ?? today.day}</div>
          </div>
          <div className="ml-auto grid grid-cols-1 gap-1 text-xs text-slate-500">
            {today.high_temp && <div>⬆️ {today.high_temp}°</div>}
            {today.low_temp && <div>⬇️ {today.low_temp}°</div>}
            {cw?.wind_dir && <div>💨 {cw.wind_dir} {cw.wind_speed}</div>}
            {cw?.humidity && <div>💧 {cw.humidity}</div>}
          </div>
        </div>
      )}

      {!weather && !error && !loading && (
        <div className="text-center text-slate-400 text-sm py-3">在上方搜索框输入城市名称即可查看天气</div>
      )}
    </div>
  );
}
