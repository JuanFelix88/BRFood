import { BucketImage } from "@/core/shared/entities/BucketImage"
import { InternalImage } from "@/core/shared/entities/Image"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"

@injectable()
export class UploadImageToBucket implements Usecase {
  public async handle(image: InternalImage): Promise<BucketImage> {
    return new BucketImage("https://example.com")
  }
}
