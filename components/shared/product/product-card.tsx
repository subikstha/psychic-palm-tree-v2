import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="glass-card overflow-hidden group hover:border-white/20 transition-all duration-300">
      <div className="p-0 flex flex-col items-center bg-zinc-900/40">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>
      <div className="p-5 grid gap-2">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
          {product.brand}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h2>
        </Link>
        <div className="flex-between gap-4 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-xs text-zinc-400">{product.rating}</span>
          </div>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-xs font-semibold text-red-400/80">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
