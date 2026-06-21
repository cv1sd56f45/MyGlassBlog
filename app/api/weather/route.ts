import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "../../../lib/apis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  if (!city) return NextResponse.json({ error: "缺少 city 参数" }, { status: 400 });

  const weather = await getWeather(city);
  if (!weather) return NextResponse.json({ error: "城市未找到" }, { status: 404 });
  return NextResponse.json(weather);
}
