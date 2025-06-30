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
            <div className="flex bg-white w-full h-fit justify-center">
                <motion.nav
                    variants={navVariants as unknown as Variants}
                    className="  z-50 w-[70%] flex items-center justify-between sm:hidden xm:hidden md:hidden lg:flex"
                    style={{
                        padding: "clamp(0.75rem, 0.5vw, 200rem) 0"
                    }}

                    animate={hidden ? "hidden" : "vissible"}>
                    <div className="w-[30%] space text-3xl font-medium">
                        <Link href={"/"}>
                           TrackYou
                        </Link>
                    </div>
                    <div className="flex gap-x-[20px] w-[70%]">
                        {navbarItems.map((item) => (
                            <Link
                                key={item.id}
                                className={`w-fit paragraph font-medium font-NeueMontreal text-secondry capitalize flex flex-col hover space`}
                                href={item.href}>
                                <TextHover
                                    titile1={item.title}
                                    titile2={item.title}
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="w-[30%] items-center flex ">
                        <SimpleButton title="Login" href="/auth/signin" />
                        <div className="w-2"></div>
                        <SimpleButton title="Get Started" href="/auth/signin" />
                    </div>
                </motion.nav>
            </div>
        </>
    );
}
