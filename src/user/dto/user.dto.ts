import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  email?: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;
}
