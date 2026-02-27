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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      {/* Background Glows for the form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md glass-card p-8 z-10">
        <div className="mb-8">
          <h1 className="h2-bold mb-2">Shipping Address</h1>
          <p className="text-zinc-400 text-sm">
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
                    <FormMessage className="text-red-400 text-xs" />
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
                    <FormMessage className="text-red-400 text-xs" />
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
                      <FormMessage className="text-red-400 text-xs" />
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
                      <FormMessage className="text-red-400 text-xs" />
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
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="glass-button w-full h-12 mt-4"
            >
              {isPending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
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
