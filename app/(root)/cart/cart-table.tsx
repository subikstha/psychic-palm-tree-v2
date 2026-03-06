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
      <h1 className="h2-bold py-8 tracking-tight">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="mb-4 text-zinc-400">Your cart is empty.</p>
          <Link
            href="/"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Go Shopping →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-8">
          <div className="glass-card overflow-x-auto p-6 md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-semibold text-zinc-400">
                    Item
                  </TableHead>
                  <TableHead className="text-center font-semibold text-zinc-400">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right font-semibold text-zinc-400">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow
                    key={item.slug}
                    className="border-white/10 transition-colors hover:bg-white/5"
                  >
                    <TableCell>
                      <Link
                        className="group flex items-center gap-4"
                        href={`/product/${item.slug}`}
                      >
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-white transition-colors group-hover:text-indigo-400">
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
                          className="size-8 rounded-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800"
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
                        <span className="min-w-[1.5rem] text-center font-medium text-white">
                          {item.qty}
                        </span>
                        <Button
                          disabled={isPending}
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800"
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
                    <TableCell className="text-right font-semibold text-white">
                      {formatCurrency(Number(item.price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:col-span-1">
            <div className="glass-card sticky top-24 p-6">
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="mb-1 text-sm font-medium text-zinc-400">
                    Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)} items)
                  </h2>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(cart.itemsPrice)}
                  </div>
                </div>

                <Button
                  className="glass-button h-12 w-full"
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
                      <ArrowRight className="ml-2 size-5" />
                    </>
                  )}{" "}
                </Button>

                <p className="mt-4 text-center text-[10px] tracking-widest text-zinc-500 uppercase">
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
