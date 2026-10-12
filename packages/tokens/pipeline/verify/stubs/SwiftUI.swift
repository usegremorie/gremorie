// Compile-time stand-in for SwiftUI.Color: the one initializer the generated
// tokens call, Color(.sRGB, red:green:blue:opacity:). Linux has no SwiftUI.
public struct Color: Sendable {
    public enum RGBColorSpace { case sRGB }

    public init(
        _: RGBColorSpace,
        red: Double,
        green: Double,
        blue: Double,
        opacity: Double
    ) {}
}
