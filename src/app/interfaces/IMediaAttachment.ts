export interface IMediaAttachment {
  fileName: string;
  url: string;
  contentType: string;
  size: number;
  // Polimórfico
  entityId: string;   // Guid em C# → string em TS
  entityType: string;
}
