package com.furat.anbar.ui

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.furat.anbar.MainViewModel
import com.furat.anbar.R
import com.furat.anbar.data.Place
import com.furat.anbar.data.Places
import com.furat.anbar.ui.theme.FuratColors
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailsScreen(
    placeId: String?,
    vm: MainViewModel,
    onBack: () -> Unit,
    onShowOnMap: (String) -> Unit,
) {
    val arabic = isArabic()
    val favorites by vm.favorites.collectAsStateWithLifecycle()
    val place = placeId?.let { Places.byId(it) }

    Column(Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text(place?.name(arabic) ?: stringResource(R.string.details)) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.back))
                }
            },
            actions = {
                if (place != null) {
                    FavoriteButton(isFavorite = place.id in favorites, onClick = { vm.toggleFavorite(place.id) })
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = Color.Transparent,
                titleContentColor = FuratColors.Gold,
                navigationIconContentColor = MaterialTheme.colorScheme.onBackground,
            ),
        )
        if (place == null) {
            EmptyState(R.string.place_not_found)
        } else {
            PlaceDetails(place, arabic, onShowOnMap)
        }
    }
}

@Composable
private fun PlaceDetails(place: Place, arabic: Boolean, onShowOnMap: (String) -> Unit) {
    val context = LocalContext.current

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 8.dp),
    ) {
        Surface(shape = RoundedCornerShape(50), color = FuratColors.RoyalPurple) {
            Text(
                text = categoryLabel(place.category),
                style = MaterialTheme.typography.labelLarge,
                color = FuratColors.Gold,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
            )
        }

        Text(
            text = place.description(arabic),
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(top = 16.dp),
        )

        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
        ) {
            Column(Modifier.padding(16.dp)) {
                Text(
                    text = stringResource(R.string.coordinates),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = String.format(Locale.US, "%.4f, %.4f", place.latitude, place.longitude),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(top = 4.dp),
                )
            }
        }

        Button(
            onClick = { onShowOnMap(place.id) },
            modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
        ) {
            Text(stringResource(R.string.show_on_map))
        }

        OutlinedButton(
            onClick = {
                val label = Uri.encode(place.nameEn)
                val uri = Uri.parse("geo:${place.latitude},${place.longitude}?q=${place.latitude},${place.longitude}($label)")
                try {
                    context.startActivity(Intent(Intent.ACTION_VIEW, uri))
                } catch (e: ActivityNotFoundException) {
                    Toast.makeText(context, R.string.no_maps_app, Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
        ) {
            Text(stringResource(R.string.open_in_maps))
        }
    }
}
