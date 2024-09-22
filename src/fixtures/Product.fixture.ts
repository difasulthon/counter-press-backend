import { Product } from "@prisma/client";

type ProductFixture = Pick<
  Product,
  "name" | "price" | "image" | "availableStock"
>;

const Products: ProductFixture[] = [
  {
    name: "SPECS ACCELERATOR ALPHAFORM CORE FG SILVER SAFETY YELLOW KINGFISHER",
    price: 369000,
    image: "https://topsystem.id/api/product//300/1725618439.jpg",
    availableStock: 0,
  },
];

export default Products;
