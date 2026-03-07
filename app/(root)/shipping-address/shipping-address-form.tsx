"use client";

import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.action";
import { toast } from "sonner";
// import { updateUserAddress } from "@/lib/actions/user.actions";
// import { shippingAddressDefaultValues } from '@/lib/constants';

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress | null;
}) => {
  const router = useRouter();
  //   const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || {},
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      console.log("Values submitted to the form are", values);
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      //   if (!res.success) {
      //     // TODO: Show success toast message
      //     // toast({
      //     //   variant: "destructive",
      //     //   description: res.message,
      //     // });
      //     return;
      //   }

      router.push("/payment-method");
    });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      {/* Background Glows for the form */}
      <div className="max-h-lg pointer-events-none absolute top-1/2 left-1/2 h-full w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="glass-card relative z-10 w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="h2-bold mb-2">Shipping Address</h1>
          <p className="text-sm text-zinc-400">
            Please enter the address where you&apos;d like your order delivered.
          </p>
        </div>

        <Form {...form}>
          <form
            method="post"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="glass-input h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        className="glass-input h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          className="glass-input h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">
                        Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          {...field}
                          className="glass-input h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="USA"
                        {...field}
                        className="glass-input h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
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
                  Continue to Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
