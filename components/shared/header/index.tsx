import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import { APP_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="wrapper flex-between h-16">
        <div className="flex-start">
          <Link href="/" className="flex-start gap-2">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              priority={true}
              className="brightness-110"
            />
            <span className="hidden lg:block font-bold text-xl tracking-tight text-white">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
