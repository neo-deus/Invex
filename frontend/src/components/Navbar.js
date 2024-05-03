import icon from "@/assets/icon.png"
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
    return (
        <nav className="fixed top-0 z-20 left-0 right-0 px-[8%]  pt-[2%]">
            <div className="flex justify-between border border-secondary-text p-2 lg:px-[3%] px-[5%] rounded-full border-opacity-40 backdrop-blur-md bg-white/20">
                    <Image src={icon} alt="icon" className="w-12 h-12 ml-10"/>
                    <div>
                        <Link href="/personaldashboard">
                        <div className="text-white text-lg mr-7">
                            Personal
                        </div>
                        </Link>
                    </div>
            </div>
        </nav>
    )
}

export default Navbar;