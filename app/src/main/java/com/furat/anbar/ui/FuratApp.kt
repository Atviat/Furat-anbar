package com.furat.anbar.ui

import androidx.annotation.StringRes
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.furat.anbar.MainViewModel
import com.furat.anbar.R
import com.furat.anbar.ui.map.MapScreen
import com.furat.anbar.ui.theme.FuratColors

private enum class Tab(val route: String, @StringRes val label: Int, val icon: ImageVector) {
    Map("map", R.string.nav_map, Icons.Filled.Map),
    Search("search", R.string.nav_search, Icons.Filled.Search),
    Favorites("favorites", R.string.nav_favorites, Icons.Filled.Favorite),
}

private const val DETAILS_ROUTE = "place/{id}"

private fun NavHostController.navigateToTab(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}

@Composable
fun FuratApp(vm: MainViewModel = viewModel()) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val showBottomBar = Tab.entries.any { it.route == currentRoute }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(containerColor = FuratColors.Surface) {
                    Tab.entries.forEach { tab ->
                        NavigationBarItem(
                            selected = currentRoute == tab.route,
                            onClick = { navController.navigateToTab(tab.route) },
                            icon = { Icon(tab.icon, contentDescription = null) },
                            label = { Text(stringResource(tab.label)) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = FuratColors.Gold,
                                selectedTextColor = FuratColors.Gold,
                                indicatorColor = FuratColors.RoyalPurple,
                                unselectedIconColor = FuratColors.OnSurfaceMuted,
                                unselectedTextColor = FuratColors.OnSurfaceMuted,
                            ),
                        )
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Tab.Map.route,
            modifier = Modifier.padding(padding),
        ) {
            composable(Tab.Map.route) {
                MapScreen(vm, onOpenDetails = { navController.navigate("place/$it") })
            }
            composable(Tab.Search.route) {
                SearchScreen(vm, onOpenDetails = { navController.navigate("place/$it") })
            }
            composable(Tab.Favorites.route) {
                FavoritesScreen(vm, onOpenDetails = { navController.navigate("place/$it") })
            }
            composable(
                route = DETAILS_ROUTE,
                arguments = listOf(navArgument("id") { type = NavType.StringType }),
            ) { entry ->
                DetailsScreen(
                    placeId = entry.arguments?.getString("id"),
                    vm = vm,
                    onBack = { navController.popBackStack() },
                    onShowOnMap = { id ->
                        vm.requestFocus(id)
                        navController.navigateToTab(Tab.Map.route)
                    },
                )
            }
        }
    }
}
