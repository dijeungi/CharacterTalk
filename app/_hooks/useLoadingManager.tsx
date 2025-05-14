// import { useLoading } from "@/_context/Loading";

// export const useLoadingManager = () => {
//   const { setIsLoading } = useLoading();

//   const startLoading = () => {
//     setIsLoading(true);
//   };

//   const stopLoading = () => {
//     setIsLoading(false);
//   };

//   const withLoading = async (fn: () => Promise<any>) => {
//     try {
//       startLoading();
//       await fn();
//     } finally {
//       stopLoading();
//     }
//   };

//   return { startLoading, stopLoading, withLoading };
// };
