export interface Promotion {
  idPromotion?: number;
  namePromotion: string;
  typePromotion: 'PERCENT' | 'MONEY';
  promotionalValue: number;
  dateStart: string;
  dateEnd: string;
}
