// Face boxes for the home library: one JSON line per image.
// xcrun swiftc -O -sdk "$(xcrun --show-sdk-path)" faces.swift -o .faces
import Foundation
import Vision
import AppKit

for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let face = VNDetectFaceLandmarksRequest()
  let body = VNDetectHumanBodyPoseRequest()
  let h = VNImageRequestHandler(cgImage: cg, options: [:])
  try? h.perform([face, body])
  var out: [String: Any] = ["file": (path as NSString).lastPathComponent, "w": cg.width, "h": cg.height]
  if let f = (face.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
    let b = f.boundingBox
    out["face"] = [b.minX, 1 - b.maxY, b.width, b.height]
    out["roll"] = f.roll?.doubleValue ?? 0
    out["yaw"] = f.yaw?.doubleValue ?? 0
    if let l = f.landmarks?.leftPupil?.normalizedPoints.first, let r = f.landmarks?.rightPupil?.normalizedPoints.first {
      let p = { (q: CGPoint) -> [Double] in [Double(b.minX + q.x * b.width), Double(1 - (b.minY + q.y * b.height))] }
      out["eyes"] = [p(l), p(r)]
    }
  }
  if let p = body.results?.first, let pts = try? p.recognizedPoints(.all) {
    var j: [String: [Double]] = [:]
    for (k, v) in pts where v.confidence > 0.3 { j[k.rawValue.rawValue] = [Double(v.location.x), Double(1 - v.location.y)] }
    out["pose"] = j
  }
  let d = try! JSONSerialization.data(withJSONObject: out)
  print(String(data: d, encoding: .utf8)!)
}
