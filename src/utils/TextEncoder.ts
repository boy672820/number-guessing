export class TextBuffer {
  private static encoder: TextEncoder = new TextEncoder();
  private static decoder: TextDecoder = new TextDecoder();

  public static encode(text: string): Uint8Array {
    return this.encoder.encode(text);
  }

  public static decode(buffer: Uint8Array): string {
    return this.decoder.decode(buffer);
  }
}
