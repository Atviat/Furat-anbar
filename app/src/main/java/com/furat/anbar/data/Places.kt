package com.furat.anbar.data

import android.content.Context

enum class PlaceCategory { CITY, LANDMARK }

data class Place(
    val id: String,
    val nameAr: String,
    val nameEn: String,
    val descriptionAr: String,
    val descriptionEn: String,
    val category: PlaceCategory,
    val latitude: Double,
    val longitude: Double,
) {
    val focusZoom: Double
        get() = if (category == PlaceCategory.CITY) 11.0 else 12.0

    fun name(arabic: Boolean): String = if (arabic) nameAr else nameEn
    fun description(arabic: Boolean): String = if (arabic) descriptionAr else descriptionEn
}

/**
 * Built-in places. Coordinates are approximate (town centers / general area),
 * not survey-grade data.
 */
object Places {
    val all: List<Place> = listOf(
        Place(
            "ramadi", "الرمادي", "Ramadi",
            "مركز محافظة الأنبار، تقع على نهر الفرات غرب بغداد.",
            "The administrative center of Anbar Province, on the Euphrates west of Baghdad.",
            PlaceCategory.CITY, 33.4258, 43.2994,
        ),
        Place(
            "fallujah", "الفلوجة", "Fallujah",
            "مدينة على نهر الفرات إلى الغرب من بغداد.",
            "A city on the Euphrates, west of Baghdad.",
            PlaceCategory.CITY, 33.3500, 43.7833,
        ),
        Place(
            "habbaniyah", "الحبانية", "Habbaniyah",
            "مدينة تقع بين الرمادي والفلوجة قرب بحيرة الحبانية.",
            "A town between Ramadi and Fallujah, near Lake Habbaniyah.",
            PlaceCategory.CITY, 33.3700, 43.5700,
        ),
        Place(
            "hit", "هيت", "Hit",
            "مدينة على نهر الفرات، معروفة بنواعيرها المائية القديمة وآبار القار.",
            "A city on the Euphrates, known for its old waterwheels and bitumen springs.",
            PlaceCategory.CITY, 33.6428, 42.8251,
        ),
        Place(
            "haditha", "حديثة", "Haditha",
            "مدينة على نهر الفرات قرب سدّ حديثة.",
            "A city on the Euphrates, close to the Haditha Dam.",
            PlaceCategory.CITY, 34.1394, 42.3783,
        ),
        Place(
            "anah", "عانة", "Anah",
            "مدينة تاريخية على نهر الفرات.",
            "A historic town on the Euphrates.",
            PlaceCategory.CITY, 34.3667, 41.9833,
        ),
        Place(
            "rawa", "راوة", "Rawa",
            "بلدة على نهر الفرات في غرب الأنبار.",
            "A town on the Euphrates in western Anbar.",
            PlaceCategory.CITY, 34.4667, 41.9167,
        ),
        Place(
            "qaim", "القائم", "Al-Qa'im",
            "مدينة في أقصى غرب الأنبار قرب الحدود مع سوريا.",
            "A city in the far west of Anbar, near the Syrian border.",
            PlaceCategory.CITY, 34.3833, 41.0167,
        ),
        Place(
            "rutba", "الرطبة", "Rutba",
            "مدينة في صحراء الأنبار الغربية على الطريق الدولي بين بغداد وعمّان.",
            "A city in Anbar's western desert on the international road between Baghdad and Amman.",
            PlaceCategory.CITY, 33.0333, 40.2833,
        ),
        Place(
            "lake_habbaniyah", "بحيرة الحبانية", "Lake Habbaniyah",
            "بحيرة بالقرب من الحبانية تُستخدم لتنظيم مياه نهر الفرات.",
            "A lake near Habbaniyah used to regulate the Euphrates' flow.",
            PlaceCategory.LANDMARK, 33.2500, 43.5500,
        ),
        Place(
            "haditha_dam", "سدّ حديثة", "Haditha Dam",
            "سدّ كبير على نهر الفرات بالقرب من مدينة حديثة.",
            "A large dam on the Euphrates near the city of Haditha.",
            PlaceCategory.LANDMARK, 34.2040, 42.3620,
        ),
        Place(
            "hit_waterwheels", "نواعير هيت", "Hit Waterwheels",
            "نواعير مائية تقليدية على نهر الفرات في مدينة هيت.",
            "Traditional waterwheels on the Euphrates in the city of Hit.",
            PlaceCategory.LANDMARK, 33.6440, 42.8230,
        ),
    )

    fun byId(id: String): Place? = all.firstOrNull { it.id == id }

    /** Matches Arabic or English names, ignoring Arabic diacritics and common letter variants. */
    fun search(query: String): List<Place> {
        val q = normalize(query)
        if (q.isBlank()) return all
        return all.filter { normalize(it.nameAr).contains(q) || normalize(it.nameEn).contains(q) }
    }

    private fun normalize(s: String): String =
        s.trim().lowercase()
            .filterNot { it in 'ً'..'ْ' }
            .replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')
            .replace('ة', 'ه').replace('ى', 'ي')
}

class FavoritesStore(context: Context) {
    private val prefs = context.applicationContext.getSharedPreferences("furat_prefs", Context.MODE_PRIVATE)

    fun load(): Set<String> = prefs.getStringSet(KEY, emptySet())?.toSet() ?: emptySet()

    fun save(ids: Set<String>) {
        prefs.edit().putStringSet(KEY, ids).apply()
    }

    private companion object {
        const val KEY = "favorites"
    }
}
