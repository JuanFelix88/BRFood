import { BucketImageErrors } from "@/core/application/errors/bucket-image"
import { HTTPTransformable } from "../utils"
import { Serializable } from "./Serializable"

@HTTPTransformable()
export class BucketImage implements Serializable {
  constructor(public readonly url: string) {
    if (!url.includes("https://") && !url.includes("http://")) {
      throw new BucketImageErrors.UrlMalformed(url)
    }
  }
  fromJSON(): unknown {
    throw new Error("Method not implemented.")
  }

  public toJSON(): string {
    return this.url
  }
}
