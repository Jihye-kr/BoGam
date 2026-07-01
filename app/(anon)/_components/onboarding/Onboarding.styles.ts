export const styles = {
  container: "flex flex-col h-screen text-black",

  header: "h-12 px-4 flex justify-end items-center shrink-0",

  skip: "text-sm text-gray-400 hover:text-gray-600 transition-colors",

  viewport: "relative flex-1 overflow-hidden",

  track: "h-full flex transition-transform duration-300 ease-out",

  draggingTrack: "transition-none",

  slideWrap: "shrink-0 basis-full flex flex-col items-center text-center select-none relative px-8",

  content: "flex flex-col items-center justify-center flex-1 pb-20",

  icon: "text-8xl mb-8",

  title: "text-xl font-bold text-gray-900",

  desc: "mt-3 text-sm text-gray-500 leading-relaxed max-w-[280px] px-2",

  fixedDots: "absolute bottom-8 left-0 right-0 flex justify-center",

  dots: "flex gap-2 items-center",

  dot: "h-2 rounded-full transition-all duration-200 ease-in-out",

  dotInactive: "w-2 bg-gray-200",

  dotActive: "w-5 bg-brand",

  fixedStartBtn: "absolute bottom-6 left-0 right-0 flex justify-center",

  startBtn: "px-8 py-3 rounded-2xl bg-brand text-white text-base font-semibold shadow-md active:scale-95 transition-transform"
};
