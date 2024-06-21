import { BucketImage } from "@/core/shared/entities/BucketImage"
import { InternalImage } from "@/core/shared/entities/Image"

export abstract class CoverImageRepository {
  public abstract upload(img: InternalImage): Promise<BucketImage>
}
