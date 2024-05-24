import { BucketImageErrors } from "@/src/application/errors/buecket-image"

export class BucketImage {
  constructor(public readonly url: string) {
    if (!url.includes("https://") && !url.includes("http://")) {
      throw new BucketImageErrors.UrlMalformed(url)
    }
  }
}
