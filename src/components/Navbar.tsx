"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { navVariants } from "@/motion";
import { navbarItems } from "@/constants";
import { useMotionValueEvent, useScroll, motion, type Variants } from "framer-motion";
import MobileBar from "./MobileBar";
import TextHover from "./animation/TextHover";
import Button from "./Button";
import RoundButton from "./RoundButton";
import SimpleButton from "./SimpleButton";
import Logo from "./Logo";

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (previous && latest > previous) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <>
            <div className="absolute top-0 left-0 text-white sus overflow-hidden flex w-full h-fit justify-center"
            style={{
                paddingTop: "clamp(0.75em, 2.5vw, 200rem)",
                paddingLeft: 0,
                paddingRight: 0
            }}
            >
                <motion.nav
                    variants={navVariants as unknown as Variants}
                    className="bg-[#1a1a1a] rounded-lg  z-50 w-[40%] flex items-center justify-between sm:hidden xm:hidden md:hidden lg:flex"
                    style={{
                        padding: "clamp(0.5em, 0.25vw, 200rem)"
                    }}

                    animate={hidden ? "hidden" : "vissible"}>
                    <div className="w-[15%]  sus text-sm ">
                        <Link href={"/"}>
                           <Logo />
                        </Link>
                    </div>
                    <div className="flex gap-x-[20px] justify-center w-[60%]">
                        {navbarItems.map((item) => (
                            <Link
                                key={item.id}
                                className={`w-fit text-sm sus capitalize flex flex-col  hover`}
                                href={item.href}>
                                <TextHover
                                    titile1={item.title}
                                    titile2={item.title}
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="w-[25%]   flex justify-end">
                        <SimpleButton title="Login" href="/auth/signin" />
                        <div className="w-2"></div>
                        <SimpleButton title="Get Started" href="/auth/signin" />
                    </div>
                </motion.nav>
            </div>
        </>
    );
}
