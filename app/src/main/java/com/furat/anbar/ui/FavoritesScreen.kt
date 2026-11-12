package com.furat.anbar.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.furat.anbar.MainViewModel
import com.furat.anbar.R
import com.furat.anbar.data.Places

@Composable
fun FavoritesScreen(vm: MainViewModel, onOpenDetails: (String) -> Unit) {
    val arabic = isArabic()
    val favorites by vm.favorites.collectAsStateWithLifecycle()
    val places = Places.all.filter { it.id in favorites }

    Column(Modifier.fillMaxSize().statusBarsPadding()) {
        ScreenHeader(stringResource(R.string.nav_favorites))
        if (places.isEmpty()) {
            EmptyState(R.string.no_favorites)
        } else {
            LazyColumn {
                items(places, key = { it.id }) { place ->
                    PlaceRow(
                        place = place,
                        arabic = arabic,
                        isFavorite = true,
                        onClick = { onOpenDetails(place.id) },
                        onFavorite = { vm.toggleFavorite(place.id) },
                    )
                }
            }
        }
    }
}
