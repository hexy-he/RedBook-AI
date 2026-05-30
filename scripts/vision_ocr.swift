import Foundation
import Vision
import AppKit

func recognize(path: String) -> String {
    let url = URL(fileURLWithPath: path)
    guard let image = NSImage(contentsOf: url),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return ""
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["zh-Hans", "zh-Hant", "en-US"]

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
    } catch {
        fputs("OCR failed for \(path): \(error)\n", stderr)
        return ""
    }

    let observations = request.results ?? []
    return observations.compactMap { observation in
        observation.topCandidates(1).first?.string
    }.joined(separator: "\n")
}

let paths = Array(CommandLine.arguments.dropFirst())
if paths.isEmpty {
    fputs("Usage: vision_ocr <image> [image...]\n", stderr)
    exit(2)
}

for (index, path) in paths.enumerated() {
    if index > 0 {
        print("\n---OCR_FILE_BREAK---\n")
    }
    print(recognize(path: path))
}
