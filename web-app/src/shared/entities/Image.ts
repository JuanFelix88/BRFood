export class InternalImage {
  constructor(
    private readonly base64Data: string,
    public readonly ext?: string
  ) {}

  public static fromBase64(base64: string, ext: string): InternalImage {
    return new InternalImage(base64)
  }

  public get base64(): string {
    return this.base64Data
  }

  public get buffer(): Buffer {
    return Buffer.from(this.base64Data, "base64")
  }
}
