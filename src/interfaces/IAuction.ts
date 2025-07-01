export interface IAuction {
  id?: string;
  name: string;
  basePrice: number;
  description: string;
  startTime: string;
  endTime: string;
  type?: string;
}
