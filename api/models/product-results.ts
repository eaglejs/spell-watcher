export default class ProductResults {
  constructor(
    public size: string,
    public url: string,
    public available: boolean,
    public imgUrl: string,
    public title: string,
    public price: string
  ) {}
}