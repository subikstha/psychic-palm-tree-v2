"use server";

export const signUpWithCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return {
    success: true,
    message: "User creation success",
  };
};

export const signIn = async (prevState: unknown, formData: FormData) => {
  return {
    success: true,
    message: "User signed in success",
  };
};
