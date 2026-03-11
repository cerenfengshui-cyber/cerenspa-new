import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lat = 40.9636;
    const lon = 29.0646;

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${lat}&longitude=${lon}` +
      "&current=temperature_2m,wind_speed_10m,wind_direction_10m,pressure_msl" +
      "&temperature_unit=celsius" +
      "&wind_speed_unit=kmh" +
      "&timezone=Europe/Istanbul";

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "weather_fetch_failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const current = data?.current ?? {};

    const tempC =
      typeof current.temperature_2m === "number" ? current.temperature_2m : null;

    const windKmh =
      typeof current.wind_speed_10m === "number" ? current.wind_speed_10m : null;

    const windDeg =
      typeof current.wind_direction_10m === "number"
        ? current.wind_direction_10m
        : null;

    const pressure =
      typeof current.pressure_msl === "number" ? current.pressure_msl : null;

    const inLodosBand =
      typeof windDeg === "number" ? windDeg >= 210 && windDeg <= 240 : false;

    const strongEnough =
      typeof windKmh === "number" ? windKmh >= 15 : false;

    const isLodos = inLodosBand && strongEnough;

    let lodosLevel: "none" | "light" | "normal" | "strong" = "none";

    if (inLodosBand && typeof windKmh === "number") {
      if (windKmh < 15) lodosLevel = "light";
      else if (windKmh < 25) lodosLevel = "normal";
      else lodosLevel = "strong";
    }

    return NextResponse.json({
      location: "Suadiye / Kadıköy",
      tempC,
      windKmh,
      windDeg,
      pressure,
      isLodos,
      lodosLevel,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("weather route error", error);

    return NextResponse.json(
      { error: "weather_route_failed" },
      { status: 500 }
    );
  }
}