package com.furat.anbar.ui.map

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.StringRes
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.core.location.LocationManagerCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.furat.anbar.MainViewModel
import com.furat.anbar.R
import com.furat.anbar.data.Place
import com.furat.anbar.data.Places
import com.furat.anbar.ui.BrandMark
import com.furat.anbar.ui.OfflineBanner
import com.furat.anbar.ui.SelectedPlaceCard
import com.furat.anbar.ui.isArabic
import com.furat.anbar.ui.rememberIsOnline
import com.furat.anbar.ui.theme.FuratColors
import kotlinx.coroutines.launch
import org.maplibre.android.camera.CameraUpdateFactory
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style

private fun hasLocationPermission(context: Context): Boolean =
    ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) ==
        PackageManager.PERMISSION_GRANTED ||
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) ==
        PackageManager.PERMISSION_GRANTED

private fun isLocationServiceOn(context: Context): Boolean {
    val manager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager ?: return false
    return LocationManagerCompat.isLocationEnabled(manager)
}

@Composable
fun MapScreen(vm: MainViewModel, onOpenDetails: (String) -> Unit) {
    val context = LocalContext.current
    val arabic = isArabic()
    val online by rememberIsOnline()
    val favorites by vm.favorites.collectAsStateWithLifecycle()
    val focusId by vm.focusId.collectAsStateWithLifecycle()

    var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
    var map by remember { mutableStateOf<MapLibreMap?>(null) }
    var style by remember { mutableStateOf<Style?>(null) }
    val snackbar = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    fun message(@StringRes res: Int) {
        scope.launch { snackbar.showSnackbar(context.getString(res)) }
    }

    fun select(place: Place?, fly: Boolean) {
        selectedId = place?.id
        style?.let { setSelectedPlace(it, place?.id) }
        if (fly && place != null) {
            map?.animateCamera(
                CameraUpdateFactory.newLatLngZoom(LatLng(place.latitude, place.longitude), place.focusZoom),
                900,
            )
        }
    }

    fun startLocation() {
        val currentMap = map
        val currentStyle = style
        if (currentMap == null || currentStyle == null) {
            message(R.string.map_not_ready)
        } else if (!isLocationServiceOn(context)) {
            message(R.string.location_disabled)
        } else if (!enableUserLocation(context, currentMap, currentStyle)) {
            message(R.string.location_unavailable)
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(),
    ) { results ->
        if (results.values.any { it }) startLocation() else message(R.string.location_permission_denied)
    }

    fun onLocateClick() {
        if (hasLocationPermission(context)) {
            startLocation()
        } else {
            permissionLauncher.launch(
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
            )
        }
    }

    // Focus requested from the details screen ("Show on map").
    LaunchedEffect(focusId, map, style) {
        val id = focusId ?: return@LaunchedEffect
        val place = Places.byId(id)
        if (place == null) {
            vm.requestFocus(null)
        } else if (map != null && style != null) {
            select(place, fly = true)
            vm.requestFocus(null)
        }
    }

    val selectedPlace = selectedId?.let { Places.byId(it) }

    Column(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Box(Modifier.weight(1f).fillMaxWidth()) {
            FuratMapView(
                modifier = Modifier.fillMaxSize(),
                onReady = { readyMap, readyStyle ->
                    map = readyMap
                    style = readyStyle
                    setSelectedPlace(readyStyle, selectedId)
                },
                onPlaceClick = { id -> select(id?.let { Places.byId(it) }, fly = false) },
            )

            Column(
                Modifier
                    .align(Alignment.TopCenter)
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
            ) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surface.copy(alpha = 0.92f),
                ) {
                    BrandMark(Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
                }
                Spacer(Modifier.height(8.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(Places.all, key = { it.id }) { place ->
                        FilterChip(
                            selected = place.id == selectedId,
                            onClick = { select(place, fly = true) },
                            label = { Text(place.name(arabic)) },
                            colors = FilterChipDefaults.filterChipColors(
                                containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.92f),
                                labelColor = MaterialTheme.colorScheme.onSurface,
                                selectedContainerColor = FuratColors.RoyalPurple,
                                selectedLabelColor = FuratColors.Gold,
                            ),
                        )
                    }
                }
                if (!online) {
                    Spacer(Modifier.height(8.dp))
                    OfflineBanner()
                }
            }

            FloatingActionButton(
                onClick = { onLocateClick() },
                containerColor = FuratColors.RoyalPurple,
                contentColor = FuratColors.Gold,
                modifier = Modifier.align(Alignment.BottomEnd).padding(16.dp),
            ) {
                Icon(Icons.Filled.MyLocation, contentDescription = stringResource(R.string.my_location))
            }

            SnackbarHost(
                hostState = snackbar,
                modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 8.dp),
            )
        }

        // The card sits below the map (not over it) so the OSM attribution stays visible.
        if (selectedPlace != null) {
            SelectedPlaceCard(
                place = selectedPlace,
                arabic = arabic,
                isFavorite = selectedPlace.id in favorites,
                onFavorite = { vm.toggleFavorite(selectedPlace.id) },
                onDetails = { onOpenDetails(selectedPlace.id) },
            )
        }
    }
}
