export default class ProductResults {
  constructor(
    public available: boolean,
    public imgUrl: string,
    public price: string,
    public size: string,
    public title: string,
    public url: string,
  ) {}
}