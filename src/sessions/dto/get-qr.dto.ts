import { ApiProperty } from '@nestjs/swagger';

export class GetQRDto {
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgo...',
    description: 'Código QR en formato Base64',
  })
  qrCode: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen del código QR',
  })
  qrImage: string;
}
