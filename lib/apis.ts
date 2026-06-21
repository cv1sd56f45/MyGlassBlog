/**
 * 第三方 API 配置与封装
 * ★★★ 全免费 · 无需 API Key · 无需注册 ★★★
 *
 * 免费数据来源：
 * - 天气/地理编码：Open-Meteo（德国气象局开源，气象数据完全免费）
 * - IP 查询：ip-api.com（每天 45 次请求免费）
 * - 违禁词检测：(1) xxapi Key 有套餐时优先用 (2) 本地词库兜底
 */
import fs from "fs";
import path from "path";

// ============================================================
// 本地配置文件读取
// ============================================================

interface LocalConfig {
  xxapi?: { key?: string };
  uapis?: { key?: string };
  site?: { weatherCity?: string; bannedWords?: string[] };
}

function readLocalConfig(): LocalConfig {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch { return {}; }
}

const localConfig = readLocalConfig();
export const XXAPI_KEY = localConfig.xxapi?.key || process.env.XXAPI_KEY || "";
export const UAPIS_KEY = localConfig.uapis?.key || process.env.UAPIS_KEY || "";
export const SITE_WEATHER_CITY = localConfig.site?.weatherCity || "";
export const LOCAL_BANNED_WORDS: string[] = localConfig.site?.bannedWords || [];

// ============================================================
// 1. 天气查询 — Open-Meteo（完全免费，无 Key）
// https://open-meteo.com/
// ============================================================

export interface WeatherResult {
  city: string;
  data: {
    date: string;
    day: string;
    high_temp: number;
    low_temp: number;
    real_time_weather: {
      temperature: string;
      weather: string;
      wind_dir: string;
      wind_speed: string;
      humidity: string;
      description: string;
      time: string;
    }[];
  }[];
}

// 中文天气码 → 中文描述 & emoji
const WMO_CODES: Record<number, { text: string; emoji: string }> = {
  0: { text: "晴", emoji: "☀️" },
  1: { text: "晴少云", emoji: "🌤️" },
  2: { text: "多云", emoji: "⛅" },
  3: { text: "阴", emoji: "☁️" },
  45: { text: "雾", emoji: "🌫️" },
  48: { text: "雾凇", emoji: "🌫️" },
  51: { text: "小毛毛雨", emoji: "🌦️" },
  53: { text: "中毛毛雨", emoji: "🌧️" },
  55: { text: "大毛毛雨", emoji: "🌧️" },
  61: { text: "小雨", emoji: "🌧️" },
  63: { text: "中雨", emoji: "🌧️" },
  65: { text: "大雨", emoji: "⛈️" },
  71: { text: "小雪", emoji: "🌨️" },
  73: { text: "中雪", emoji: "❄️" },
  75: { text: "大雪", emoji: "❄️" },
  80: { text: "阵雨", emoji: "🌧️" },
  81: { text: "中阵雨", emoji: "🌧️" },
  82: { text: "大阵雨", emoji: "⛈️" },
  95: { text: "雷阵雨", emoji: "⛈️" },
  96: { text: "雷暴冰雹", emoji: "⛈️" },
  99: { text: "极端雷暴", emoji: "⛈️" },
};

function wmoToText(code: number): string {
  return WMO_CODES[code]?.text ?? "未知";
}

// 风向码 → 中文
const WIND_DIRS = ["北","北偏东","东北","东偏北","东","东偏南","东南","南偏东","南","南偏西","西南","西偏南","西","西偏北","西北","北偏西"];

function getWindDir(degrees: number): string {
  const idx = Math.round(degrees / 22.5) % 16;
  return WIND_DIRS[idx];
}

export async function getWeather(city: string): Promise<WeatherResult | null> {
  if (!city.trim()) return null;
  try {
    // Step 1: 地理编码
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`,
      { next: { revalidate: 86400 } }
    );
    const geoData = await geoRes.json();
    const loc = geoData.results?.[0];
    if (!loc) return null;

    // Step 2: 天气预报
    const { latitude: lat, longitude: lon, timezone } = loc;
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${timezone}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode,relativehumidity_2m,winddirection_10m,wind_speed_10m&current_weather=true&forecast_days=3`,
      { next: { revalidate: 1800 } }
    );
    const w = await weatherRes.json();
    const cw = w.current_weather;
    const todayCode = cw?.weathercode ?? w.daily?.weathercode?.[0] ?? 0;
    const now = {
      temperature: `${Math.round(cw?.temperature ?? 0)}°`,
      weather: wmoToText(todayCode),
      wind_dir: getWindDir(cw?.winddirection ?? 0),
      wind_speed: `${Math.round(cw?.windspeed ?? 0)} km/h`,
      humidity: `${w.hourly?.relativehumidity_2m?.[new Date().getHours()] ?? 0}%`,
      description: wmoToText(todayCode),
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };

    const days = (w.daily?.time ?? []).slice(0, 3).map((d: string, i: number) => ({
      date: d,
      day: new Date(d).toLocaleDateString("zh-CN", { weekday: "short" }),
      high_temp: Math.round(w.daily?.temperature_2m_max?.[i] ?? 0),
      low_temp: Math.round(w.daily?.temperature_2m_min?.[i] ?? 0),
      real_time_weather: i === 0 ? [now] : [],
    }));

    return { city, data: days };
  } catch {
    return null;
  }
}

// ============================================================
// 2. IP 查询 — ip-api.com（免费，无需 Key）
// ============================================================

export interface IpInfo {
  ip: string;
  country: string;
  province: string;
  city: string;
  district: string;
  isp: string;
  latitude: number;
  longitude: number;
}

export async function getIpInfo(ip: string): Promise<IpInfo | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,lat,lon`, {
      headers: { "Accept-Language": "zh-CN" },
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    if (json.status !== "success") return null;
    return {
      ip,
      country: json.country,
      province: json.regionName,
      city: json.city,
      district: "",
      isp: json.isp,
      latitude: json.lat,
      longitude: json.lon,
    };
  } catch { return null; }
}

// ============================================================
// 3. AI 违禁词检测
//    优先级：xxapi Key (付费) > 本地词库 (免费)
// ============================================================

export interface AiDetectResult {
  is_violation: boolean;
  risk_level: string;
  keywords: string[];
  categories: string[];
  explanation: string;
}

// 3a. xxapi 云端接口（需有套餐的 Key）
async function detectTextByXxApi(text: string): Promise<AiDetectResult | null> {
  if (!XXAPI_KEY) return null;
  try {
    const res = await fetch(`https://v2.xxapi.cn/api/AiDetect?msg=${encodeURIComponent(text)}`, {
      headers: { Authorization: `Bearer ${XXAPI_KEY}` },
    });
    const json = await res.json();
    if (json.code === 200) return json.data as AiDetectResult;
  } catch {}
  return null;
}

// 3b. 本地词库检测（完全免费，无需网络）
const DEFAULT_BANNED = ["枪","毒品","赌博","色情","暴力","分裂","恐怖主义"];

export function detectTextLocal(text: string): AiDetectResult {
  const words = LOCAL_BANNED_WORDS.length > 0 ? LOCAL_BANNED_WORDS : DEFAULT_BANNED;
  const lower = text.toLowerCase();
  const found = words.filter(w => lower.includes(w.toLowerCase()));
  return {
    is_violation: found.length > 0,
    risk_level: found.length > 2 ? "high" : found.length > 0 ? "medium" : "low",
    keywords: found,
    categories: found.map(() => "违规内容"),
    explanation: found.length > 0 ? `检测到敏感词：${found.join("、")}` : "未检测到违规内容",
  };
}

// 主入口：优先云端，兜底本地
export async function detectText(text: string): Promise<AiDetectResult | null> {
  // 优先用云端（有套餐时）
  const cloud = await detectTextByXxApi(text);
  if (cloud) return cloud;
  // 无网络/无Key时用本地词库
  return detectTextLocal(text);
}

// ============================================================
// 4. NSFW 图片检测（本地词库兜底 + xxapi 云端）
// ============================================================

export interface NsfwCheckResult {
  is_nsfw: boolean;
  nsfw_probability: number;
}

const NSFW_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];

export async function checkNsfw(imageUrl: string): Promise<NsfwCheckResult | null> {
  // xxapi 云端（有套餐才有效）
  if (XXAPI_KEY) {
    try {
      const res = await fetch(`https://v2.xxapi.cn/api/nsfwcheck?url=${encodeURIComponent(imageUrl)}`, {
        headers: { Authorization: `Bearer ${XXAPI_KEY}` },
      });
      const json = await res.json();
      if (json.code === 200) return json.data as NsfwCheckResult;
    } catch {}
  }
  // 本地兜底：检测 URL 中是否包含明显敏感路径
  const lower = imageUrl.toLowerCase();
  const suspicious = ["nsfw", "porn", "xxx", "adult", "18+"].some(k => lower.includes(k));
  return {
    is_nsfw: suspicious,
    nsfw_probability: suspicious ? 0.7 : 0,
  };
}

// ============================================================
// 5. AI 翻译（xxapi 有套餐时用，暂无则返回 null）
// ============================================================

export async function translateText(text: string, toLang: string): Promise<string | null> {
  if (!XXAPI_KEY) return null;
  try {
    const res = await fetch(
      `https://v2.xxapi.cn/api/AIAutoTranslate?msg=${encodeURIComponent(text)}&to=${toLang}`,
      { headers: { Authorization: `Bearer ${XXAPI_KEY}` }
    });
    const json = await res.json();
    if (json.code === 200) return json.data as string;
  } catch {}
  return null;
}

// ============================================================
// 状态汇总（供后台显示）
// ============================================================

export const API_CONFIG = {
  xxapi: { key: !!XXAPI_KEY, status: XXAPI_KEY ? "ready" : "no-key" },
  freeWeather: true,
  freeIpLookup: true,
  freeLocalDetect: true,
};
