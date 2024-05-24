import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

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
