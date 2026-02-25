import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: hashSync("password", 10),
      role: "admin",
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: hashSync("password", 10),
      role: "user",
    },
  ],
  products: [
    {
      name: "Moondrop Aria",
      slug: "moondrop-aria",
      category: "In-Ear Monitors",
      description:
        "Well-balanced tuning with smooth treble and excellent detail for the price.",
      images: [
        "/images/sample-products/aria-1.jpg",
        "/images/sample-products/aria-2.jpg",
      ],
      price: "79.99",
      brand: "Moondrop",
      rating: "4.8",
      numReviews: 120,
      stock: 15,
      isFeatured: true,
      banner: "banner-aria.jpg",
    },
    {
      name: "7Hz Salnotes Zero",
      slug: "7hz-salnotes-zero",
      category: "In-Ear Monitors",
      description:
        "Budget-friendly neutral tuning with impressive clarity and imaging.",
      images: [
        "/images/sample-products/zero-1.jpg",
        "/images/sample-products/zero-2.jpg",
      ],
      price: "19.99",
      brand: "7Hz",
      rating: "4.6",
      numReviews: 210,
      stock: 30,
      isFeatured: true,
      banner: "banner-zero.jpg",
    },
    {
      name: "Truthear Hexa",
      slug: "truthear-hexa",
      category: "In-Ear Monitors",
      description:
        "Hybrid configuration with clean mids and controlled bass response.",
      images: [
        "/images/sample-products/hexa-1.jpg",
        "/images/sample-products/hexa-2.jpg",
      ],
      price: "79.99",
      brand: "Truthear",
      rating: "4.7",
      numReviews: 95,
      stock: 12,
      isFeatured: false,
      banner: null,
    },
    {
      name: "KZ ZS10 Pro X",
      slug: "kz-zs10-pro-x",
      category: "In-Ear Monitors",
      description: "V-shaped tuning with energetic treble and punchy bass.",
      images: [
        "/images/sample-products/zs10-1.jpg",
        "/images/sample-products/zs10-2.jpg",
      ],
      price: "49.99",
      brand: "KZ",
      rating: "4.3",
      numReviews: 340,
      stock: 25,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Tin HiFi T3 Plus",
      slug: "tin-hifi-t3-plus",
      category: "In-Ear Monitors",
      description: "Warm and smooth tuning with good technical performance.",
      images: [
        "/images/sample-products/t3plus-1.jpg",
        "/images/sample-products/t3plus-2.jpg",
      ],
      price: "69.0",
      brand: "Tin HiFi",
      rating: "4.5",
      numReviews: 150,
      stock: 18,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Letshuoer S12",
      slug: "letshuoer-s12",
      category: "In-Ear Monitors",
      description:
        "Planar magnetic driver with fast transient response and detailed treble.",
      images: [
        "/images/sample-products/s12-1.jpg",
        "/images/sample-products/s12-2.jpg",
      ],
      price: "149.0",
      brand: "Letshuoer",
      rating: "4.9",
      numReviews: 80,
      stock: 10,
      isFeatured: true,
      banner: "banner-s12.jpg",
    },
  ],
};

export default sampleData;
