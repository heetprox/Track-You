// import React, { useRef } from "react";
// import { BgImagesContainer } from "./bgImagesContainer";
// import Magentic from "../ui/magentic";
// export function ContactSection({}) {
//   const { suscribe } = useAppSelector((state) => state.fullpageReducer.third);
//   const bgImagesSharedRef = useRef<gsap.core.Tween | null>(null);

//   return (
//     <section className="section section__5 third darkGradient ">

//       <Magentic // href="mailto:email.coex@gmail.com"
//         className="footer__heading anime cursor-pointer"
//         scrambleParams={{
//           text: "Contact",
//         }}
//         onMouseEnter={() => {
//           bgImagesSharedRef.current?.restart(true);
//         }}
//         onMouseLeave={() => {
//           bgImagesSharedRef.current?.reverse();
//         }}
//       >
//         <span className="shapka mask">
//           <span className="scrambleText inline-block text-left">Contact</span>
//           <span className="yellow__it">.</span>
//         </span>
//       </Magentic>
//       <BgImagesContainer bgImagesSharedRef={bgImagesSharedRef} />
//     </section>
//   );
// }
