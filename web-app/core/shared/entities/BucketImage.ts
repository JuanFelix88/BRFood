import { BucketImageErrors } from "@/core/application/errors/bucket-image"
import { Serializable } from "./Serializable"

export class BucketImage implements Serializable {
  constructor(public readonly url: string) {
    if (!url.includes("https://") && !url.includes("http://")) {
      throw new BucketImageErrors.UrlMalformed(url)
    }
  }

  public toJSON(): string {
    return this.url
  }
}
