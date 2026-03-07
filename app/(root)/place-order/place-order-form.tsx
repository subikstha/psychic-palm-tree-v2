"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.action";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      const res = await createOrder();

      if (res.success) {
        toast.success(res.message);
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button disabled={isPending} className="w-full" type="submit">
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}{" "}
        Place Order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;
