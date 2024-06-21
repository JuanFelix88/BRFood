import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace BucketImageErrors {
  export class UrlMalformed extends AppError {
    constructor(url: string) {
      super("Bucket url malformed", {
        [Lang.EN]: `Bucket url malformed: ${url}`,
        [Lang.PT_BR]: `Url do Bucket é inválido: ${url}`,
      })
    }
  }
}
