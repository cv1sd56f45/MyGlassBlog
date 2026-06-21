/**
 * 纯前端天气模块（无 Node.js 依赖，可被 "use client" 组件使用）
 */

export const SITE_WEATHER_CITY = ""; // 客户端用 localStorage，忽略此值

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

const WMO_EMOJI: Record<number, string> = {
  0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",
  51:"🌦️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",65:"⛈️",
  71:"🌨️",73:"❄️",75:"❄️",80:"🌧️",81:"🌧️",82:"⛈️",
  95:"⛈️",96:"⛈️",99:"⛈️",
};

export function getWeatherEmoji(code: number): string {
  return WMO_EMOJI[code] ?? "🌤️";
}
