export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  weight: number;
  volume: string;
}

export const shippingOrigin = {
  id: "63c308b5522da763fbd4ca81",
  code: "32.71.04",
  name: "Bogor Barat, Kota Bogor, Jawa Barat"
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Italian Riviera",
    price: 1000000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/blt3d6245b2b391c560/21359_Prod.png?format=webply&fit=bounds&quality=80&width=400&height=400&dpr=2",
    description:
      "You don't need a passport to embark on a captivating journey to one of the most beautiful regions in the world. Capture the serenity, vibrant colors and intricate architectural details of a typical Ligurian fishing village.",
    weight: 0.5,
    volume: "25x15x10",
  },
  {
    id: 2,
    name: "Transformers: Soundwave",
    price: 990000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/bltf513a3746b8267e9/10358_Prod_en-gb.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Recreate the fan-favorite Soundwave, the loyal lieutenant of the Decepticon leader Megatron along with his trusted companions Ravage and Laserbeak.",
    weight: 0.8,
    volume: "30x20x15",
  },
  {
    id: 3,
    name: "WALL-E and EVE",
    price: 1500000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/bltb61df5c6a83a2624/43279_Prod_en-gb.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Indulge your love of the Disney and Pixar movie WALL-E with this LEGO® | Disney building set with 4 iconic characters.",
    weight: 0.6,
    volume: "28x18x12",
  },
  {
    id: 4,
    name: "Hibiscus",
    price: 450000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/blteaa1b277ce8483e2/10372_Prod_1.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Embrace your inner florist with a LEGO® Botanicals Hibiscus building set that blooms with gorgeous details.",
    weight: 0.8,
    volume: "15x10x8",
  },
  {
    id: 5,
    name: "Italian Riviera",
    price: 1000000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/blt3d6245b2b391c560/21359_Prod.png?format=webply&fit=bounds&quality=80&width=400&height=400&dpr=2",
    description:
      "You don't need a passport to embark on a captivating journey to one of the most beautiful regions in the world. Capture the serenity, vibrant colors and intricate architectural details of a typical Ligurian fishing village.",
    weight: 0.2,
    volume: "25x15x10",
  },
  {
    id: 6,
    name: "Transformers: Soundwave",
    price: 990000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/bltf513a3746b8267e9/10358_Prod_en-gb.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Recreate the fan-favorite Soundwave, the loyal lieutenant of the Decepticon leader Megatron along with his trusted companions Ravage and Laserbeak.",
    weight: 0.7,
    volume: "30x20x15",
  },
  {
    id: 7,
    name: "WALL-E and EVE",
    price: 1500000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/bltb61df5c6a83a2624/43279_Prod_en-gb.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Indulge your love of the Disney and Pixar movie WALL-E with this LEGO® | Disney building set with 4 iconic characters.",
    weight: 0.5,
    volume: "28x18x12",
  },
  {
    id: 8,
    name: "Hibiscus",
    price: 450000,
    image:
      "https://www.lego.com/cdn/cs/set/assets/blteaa1b277ce8483e2/10372_Prod_1.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2",
    description:
      "Embrace your inner florist with a LEGO® Botanicals Hibiscus building set that blooms with gorgeous details.",
    weight: 0.3,
    volume: "15x10x8",
  },
];