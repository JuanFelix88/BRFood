import { BucketImage } from "@/src/shared/entities/BucketImage"
import { InternalImage } from "@/src/shared/entities/Image"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"

@injectable()
export class UploadImageToBucket implements Usecase {
  public async handle(image: InternalImage): Promise<BucketImage> {
    return new BucketImage("https://example.com")
  }
}
