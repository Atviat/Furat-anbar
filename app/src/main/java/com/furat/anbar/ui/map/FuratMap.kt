package com.furat.anbar.ui.map

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.furat.anbar.data.PlaceCategory
import com.furat.anbar.data.Places
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.location.LocationComponentActivationOptions
import org.maplibre.android.location.modes.CameraMode
import org.maplibre.android.location.modes.RenderMode
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.Style
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.PropertyFactory.circleColor
import org.maplibre.android.style.layers.PropertyFactory.circleOpacity
import org.maplibre.android.style.layers.PropertyFactory.circleRadius
import org.maplibre.android.style.layers.PropertyFactory.circleStrokeColor
import org.maplibre.android.style.layers.PropertyFactory.circleStrokeWidth
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.Point

/** OpenStreetMap raster tiles in a minimal MapLibre style (no API key, no paid service). */
private const val STYLE_JSON = """
{
  "version": 8,
  "name": "FURAT OSM",
  "sources": {
    "osm": {
      "type": "raster",
      "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      "tileSize": 256,
      "maxzoom": 19,
      "attribution": "© OpenStreetMap contributors"
    }
  },
  "layers": [
    {"id": "bg", "type": "background", "paint": {"background-color": "#0A0710"}},
    {"id": "osm", "type": "raster", "source": "osm",
     "paint": {"raster-brightness-max": 0.85, "raster-saturation": -0.2}}
  ]
}
"""

private const val SOURCE_ID = "furat-places"
private const val HALO_LAYER = "furat-places-halo"
private const val DOT_LAYER = "furat-places-dot"
private const val SELECTED_LAYER = "furat-places-selected"

private const val GOLD = "#D4AF37"
private const val PURPLE_SOFT = "#B39DDB"

private val ANBAR_CENTER = LatLng(33.45, 42.0)
private const val ANBAR_ZOOM = 6.0

private fun addPlaceLayers(style: Style) {
    val features = Places.all.map { place ->
        Feature.fromGeometry(Point.fromLngLat(place.longitude, place.latitude)).apply {
            addStringProperty("id", place.id)
            addStringProperty("color", if (place.category == PlaceCategory.CITY) GOLD else PURPLE_SOFT)
        }
    }
    style.addSource(GeoJsonSource(SOURCE_ID, FeatureCollection.fromFeatures(features)))

    val colorExpr = Expression.toColor(Expression.get("color"))

    style.addLayer(
        CircleLayer(HALO_LAYER, SOURCE_ID).withProperties(
            circleRadius(16f),
            circleColor(colorExpr),
            circleOpacity(0.28f),
        ),
    )
    style.addLayer(
        CircleLayer(DOT_LAYER, SOURCE_ID).withProperties(
            circleRadius(7f),
            circleColor(colorExpr),
            circleStrokeColor("#FFFFFF"),
            circleStrokeWidth(1.5f),
        ),
    )
    val selected = CircleLayer(SELECTED_LAYER, SOURCE_ID).withProperties(
        circleRadius(13f),
        circleOpacity(0f),
        circleStrokeColor("#FFFFFF"),
        circleStrokeWidth(3f),
    )
    selected.setFilter(Expression.eq(Expression.get("id"), Expression.literal("")))
    style.addLayer(selected)
}

/** Draws a white ring around the selected place (or hides it when [id] is null). */
fun setSelectedPlace(style: Style, id: String?) {
    style.getLayerAs<CircleLayer>(SELECTED_LAYER)
        ?.setFilter(Expression.eq(Expression.get("id"), Expression.literal(id ?: "")))
}

/**
 * Shows the user's position and follows it. The caller must have checked the location
 * permission first; returns false if the location component could not be started.
 */
@SuppressLint("MissingPermission")
fun enableUserLocation(context: Context, map: MapLibreMap, style: Style): Boolean {
    return try {
        val component = map.locationComponent
        if (!component.isLocationComponentActivated) {
            component.activateLocationComponent(
                LocationComponentActivationOptions.builder(context, style).build(),
            )
        }
        component.isLocationComponentEnabled = true
        component.cameraMode = CameraMode.TRACKING
        component.renderMode = RenderMode.NORMAL
        component.zoomWhileTracking(12.0)
        true
    } catch (e: SecurityException) {
        false
    } catch (e: RuntimeException) {
        false
    }
}

@Composable
fun FuratMapView(
    modifier: Modifier = Modifier,
    onReady: (MapLibreMap, Style) -> Unit,
    onPlaceClick: (String?) -> Unit,
) {
    val context = LocalContext.current
    val lifecycle = LocalLifecycleOwner.current.lifecycle
    val currentOnReady by rememberUpdatedState(onReady)
    val currentOnPlaceClick by rememberUpdatedState(onPlaceClick)
    val mapView = remember { MapView(context) }

    DisposableEffect(mapView, lifecycle) {
        var destroyed = false
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_CREATE -> mapView.onCreate(null)
                Lifecycle.Event.ON_START -> mapView.onStart()
                Lifecycle.Event.ON_RESUME -> mapView.onResume()
                Lifecycle.Event.ON_PAUSE -> mapView.onPause()
                Lifecycle.Event.ON_STOP -> mapView.onStop()
                Lifecycle.Event.ON_DESTROY -> {
                    mapView.onDestroy()
                    destroyed = true
                }
                else -> Unit
            }
        }
        lifecycle.addObserver(observer)
        onDispose {
            lifecycle.removeObserver(observer)
            if (!destroyed) {
                mapView.onPause()
                mapView.onStop()
                mapView.onDestroy()
            }
        }
    }

    AndroidView(
        modifier = modifier,
        factory = {
            mapView.also { view ->
                view.getMapAsync { map ->
                    map.setMinZoomPreference(4.0)
                    map.cameraPosition = CameraPosition.Builder()
                        .target(ANBAR_CENTER)
                        .zoom(ANBAR_ZOOM)
                        .build()
                    map.setStyle(Style.Builder().fromJson(STYLE_JSON)) { style ->
                        addPlaceLayers(style)
                        map.addOnMapClickListener { latLng ->
                            val point = map.projection.toScreenLocation(latLng)
                            val hit = map.queryRenderedFeatures(point, HALO_LAYER).firstOrNull()
                            val id = hit?.getStringProperty("id")
                            currentOnPlaceClick(id)
                            id != null
                        }
                        currentOnReady(map, style)
                    }
                }
            }
        },
    )
}
