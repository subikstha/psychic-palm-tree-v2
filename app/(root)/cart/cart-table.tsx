"use client";
import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { formatCurrency } from "@/lib/utils";
const CartTable = ({ cart }: { cart?: Cart }) => {
  console.log("Cart is", cart);
  const router = useRouter();
  //   const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-8 h2-bold tracking-tight">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-zinc-400 mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Go Shopping →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-8">
          <div className="overflow-x-auto md:col-span-3 glass-card p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-zinc-400 font-semibold">
                    Item
                  </TableHead>
                  <TableHead className="text-center text-zinc-400 font-semibold">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right text-zinc-400 font-semibold">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow
                    key={item.slug}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell>
                      <Link
                        className="flex items-center gap-4 group"
                        href={`/product/${item.slug}`}
                      >
                        <div className="rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-white group-hover:text-indigo-400 transition-colors font-medium">
                          {item.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          disabled={isPending}
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(
                                item.productId,
                              );
                              if (!res.success) {
                                console.log(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="size-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-white font-medium min-w-[1.5rem] text-center">
                          {item.qty}
                        </span>
                        <Button
                          disabled={isPending}
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);
                              if (!res.success) {
                                console.log(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="size-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-white font-semibold">
                      {formatCurrency(Number(item.price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <div className="space-y-4">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-zinc-400 text-sm font-medium mb-1">
                    Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)} items)
                  </h2>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(cart.itemsPrice)}
                  </div>
                </div>

                <Button
                  className="glass-button w-full h-12"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => router.push("/shipping-address"))
                  }
                >
                  {isPending ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="size-5 ml-2" />
                    </>
                  )}{" "}
                </Button>

                <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-4">
                  Secure Checkout Powered by Psychic Palm
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
