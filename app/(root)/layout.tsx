// import Footer from "@/components/footer";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#09090b]">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-purple-500/5 blur-[150px]" />

      <Header />
      <main className="wrapper relative z-10 mt-8 flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
