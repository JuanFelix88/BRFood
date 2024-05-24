import { BucketImage } from "@/src/shared/entities/BucketImage"
import { InternalImage } from "@/src/shared/entities/Image"

export abstract class CoverImageRepository {
  public abstract upload(img: InternalImage): Promise<BucketImage>
}
