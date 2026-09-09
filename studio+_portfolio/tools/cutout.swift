import Foundation
import Vision
import CoreImage
import AppKit

// usage: cutout <in.jpg> <out.png>
let args = CommandLine.arguments
guard args.count == 3 else { print("usage: cutout in out"); exit(1) }
let inURL = URL(fileURLWithPath: args[1]); let outURL = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: inURL) else { print("cannot read"); exit(1) }
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let res = req.results?.first else { print("no mask"); exit(2) }
let maskPB = try res.generateScaledMaskForImage(forInstances: res.allInstances, from: handler)
let mask = CIImage(cvPixelBuffer: maskPB)
// soften the edge very slightly so hair does not cut like paper
let soft = mask.applyingFilter("CIGaussianBlur", parameters: ["inputRadius": 0.6]).cropped(to: mask.extent)
let blend = CIFilter(name: "CIBlendWithMask")!
blend.setValue(ci, forKey: kCIInputImageKey)
blend.setValue(CIImage(color: .clear).cropped(to: ci.extent), forKey: kCIInputBackgroundImageKey)
blend.setValue(soft, forKey: kCIInputMaskImageKey)
let out = blend.outputImage!.cropped(to: ci.extent)
let ctx = CIContext()
guard let png = ctx.pngRepresentation(of: out, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!) else { print("encode fail"); exit(3) }
try png.write(to: outURL)
print("ok", Int(ci.extent.width), Int(ci.extent.height))
