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

  @Transform(({ value }) => parseInt(value))
  @Expose()
  price: number;

  @Transform(({ value }) => parseInt(value))
  @Expose()
  mileage: number;

  @Transform(({ value }) => parseInt(value))
  @Expose()
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @Expose()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @Expose()
  lng: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
