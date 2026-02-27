// import Footer from "@/components/footer";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col bg-[#09090b] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[150px] pointer-events-none" />

      <Header />
      <main className="flex-1 wrapper relative z-10">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
