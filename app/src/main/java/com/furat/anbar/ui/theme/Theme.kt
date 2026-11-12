package com.furat.anbar.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

object FuratColors {
    val RoyalBlack = Color(0xFF0A0710)
    val Surface = Color(0xFF140D22)
    val SurfaceHigh = Color(0xFF1E1433)
    val RoyalPurple = Color(0xFF4A2A7A)
    val PurpleSoft = Color(0xFFB39DDB)
    val Gold = Color(0xFFD4AF37)
    val OnSurface = Color(0xFFEDE7F6)
    val OnSurfaceMuted = Color(0xFFB8AACC)
    val Outline = Color(0xFF4A3A66)
}

private val FuratScheme = darkColorScheme(
    primary = FuratColors.Gold,
    onPrimary = FuratColors.RoyalBlack,
    primaryContainer = FuratColors.RoyalPurple,
    onPrimaryContainer = Color(0xFFEADDFF),
    secondary = FuratColors.PurpleSoft,
    onSecondary = FuratColors.RoyalBlack,
    background = FuratColors.RoyalBlack,
    onBackground = FuratColors.OnSurface,
    surface = FuratColors.Surface,
    onSurface = FuratColors.OnSurface,
    surfaceVariant = FuratColors.SurfaceHigh,
    onSurfaceVariant = FuratColors.OnSurfaceMuted,
    outline = FuratColors.Outline,
    outlineVariant = FuratColors.Outline,
)

@Composable
fun FuratTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = FuratScheme, content = content)
}
