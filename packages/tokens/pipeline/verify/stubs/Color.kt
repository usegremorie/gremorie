// Compile-time stand-in for androidx.compose.ui.graphics.Color: the two
// factory overloads Compose exposes, Color(Long) and Color(Int).
package androidx.compose.ui.graphics

class Color(val packed: ULong)

fun Color(color: Long): Color = Color(packed = color.toULong())

fun Color(color: Int): Color = Color(packed = color.toLong().toULong())
