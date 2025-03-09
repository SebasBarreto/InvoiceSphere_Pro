import { IsInt, IsPositive } from 'class-validator';

export class UpdateStockDto {
  /**
   * The quantity to be subtracted from the stock. Must be a positive integer.
   */
  @IsInt()
  @IsPositive()
  quantity: number;
}
