# FURAT | فُرات — ANBAR'S SMART MAP

Native Android app (Kotlin, Jetpack Compose, Material 3, MapLibre) with an interactive map of Anbar Province.

## Features
- Interactive OpenStreetMap-based map (MapLibre, no API keys, no paid services)
- User location (permission requested at runtime; handles denied permission and disabled GPS)
- Built-in list of 9 Anbar cities and 3 landmarks, with search (Arabic or English)
- Place details, favorites (stored on device), "open in a maps app" via a standard `geo:` intent
- Arabic (default, RTL) and English, following the device language
- Offline banner and graceful handling of missing internet/location

## Notes
- The place list is a small built-in dataset; coordinates are approximate. There is no routing/navigation inside the app.
- Map tiles come from the public OpenStreetMap tile server, which is meant for light use. For a wide release, switch to a tile provider/self-hosted tiles (change `STYLE_JSON` in `ui/map/FuratMap.kt`).

## Build
- **GitHub Actions:** Actions → "Android Debug APK" → Run workflow. Download the `FURAT-debug-apk` artifact.
- **Locally:** open in Android Studio, or run `./gradlew assembleDebug` (JDK 17 + Android SDK 35). APK: `app/build/outputs/apk/debug/`.

## Web app (iPhone / any browser) — `web/`
Deployed with GitHub Pages: https://atviat.github.io/Furat-anbar/
- All settlements of Anbar (cities, towns, villages, neighbourhoods) loaded from OpenStreetMap via Overpass, plus online place search (Nominatim) and service categories (hospitals, fuel, etc.)
- Tap any point on the map to drop a pin; route from your location by car or on foot (OSRM), with live turn-by-turn navigation, voice guidance and automatic re-routing
- Uses only free public services (no API keys). Routes depend on OpenStreetMap road data.
