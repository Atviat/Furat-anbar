package com.furat.anbar.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.furat.anbar.MainViewModel
import com.furat.anbar.R
import com.furat.anbar.data.Places

@Composable
fun SearchScreen(vm: MainViewModel, onOpenDetails: (String) -> Unit) {
    val arabic = isArabic()
    val favorites by vm.favorites.collectAsStateWithLifecycle()
    var query by rememberSaveable { mutableStateOf("") }
    val results = remember(query) { Places.search(query) }

    Column(Modifier.fillMaxSize().statusBarsPadding()) {
        ScreenHeader(stringResource(R.string.nav_search))
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            singleLine = true,
            shape = RoundedCornerShape(16.dp),
            placeholder = { Text(stringResource(R.string.search_hint)) },
            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Filled.Close, contentDescription = stringResource(R.string.clear))
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
        )
        if (results.isEmpty()) {
            EmptyState(R.string.no_results)
        } else {
            LazyColumn {
                items(results, key = { it.id }) { place ->
                    PlaceRow(
                        place = place,
                        arabic = arabic,
                        isFavorite = place.id in favorites,
                        onClick = { onOpenDetails(place.id) },
                        onFavorite = { vm.toggleFavorite(place.id) },
                    )
                }
            }
        }
    }
}
