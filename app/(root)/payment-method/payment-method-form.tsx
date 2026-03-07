"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
import { toast } from "sonner";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push("/place-order");
    });
  };
  return (
    <>
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        {/* Background Glows for the form */}
        <div className="max-h-lg pointer-events-none absolute top-1/2 left-1/2 h-full w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="glass-card relative z-10 w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="h2-bold mb-2">Payment Method</h1>
            <p className="text-sm text-zinc-400">
              Please select a payment method
            </p>
          </div>

          <Form {...form}>
            <form
              method="post"
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          {PAYMENT_METHODS.map((paymentMethod) => (
                            <FormItem
                              key={paymentMethod}
                              className="flex items-center space-y-0 space-x-3"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={paymentMethod}
                                  checked={field.value === paymentMethod}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {paymentMethod}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="glass-button mt-4 h-12 w-full"
              >
                {isPending ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethodForm;
