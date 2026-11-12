package com.furat.anbar

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.furat.anbar.data.FavoritesStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val store = FavoritesStore(app)

    private val _favorites = MutableStateFlow(store.load())
    val favorites: StateFlow<Set<String>> = _favorites.asStateFlow()

    /** A place the map should focus on once it is visible (set from the details screen). */
    private val _focusId = MutableStateFlow<String?>(null)
    val focusId: StateFlow<String?> = _focusId.asStateFlow()

    fun toggleFavorite(id: String) {
        val current = _favorites.value
        val updated = if (id in current) current - id else current + id
        _favorites.value = updated
        store.save(updated)
    }

    fun requestFocus(id: String?) {
        _focusId.value = id
    }
}
