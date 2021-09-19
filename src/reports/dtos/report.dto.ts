import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  mileage: number;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
