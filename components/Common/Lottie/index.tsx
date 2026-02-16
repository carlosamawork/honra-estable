// 'use client';
// import { useEffect, useRef } from 'react';

// interface LottieProps {
//   data: string;
// }

// export default function LottieComponent({ data }: LottieProps) {
//   const animationContainer = useRef<HTMLDivElement>(null);



// useEffect(() => {
//     import('lottie-web').then((module) => {
//       const lottie = module.default;
//       lottie.loadAnimation({
//         container: animationContainer.current!,
//         renderer: 'svg',
//         loop: false,
//         autoplay: true,
//         path: data,
//       });
//     });
//   }, [data]);
//   return <div ref={animationContainer}></div>;
// }