import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="glass-card group overflow-hidden transition-all duration-300 hover:border-white/20">
      <div className="flex flex-col items-center bg-zinc-900/40 p-0">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="grid gap-2 p-5">
        <div className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
          {product.brand}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-indigo-400">
            {product.name}
          </h2>
        </Link>
        <div className="flex-between mt-2 gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs text-yellow-500">★</span>
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
