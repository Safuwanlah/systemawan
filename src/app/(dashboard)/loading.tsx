export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      {/* Subtle spinner matching the dark theme */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#252946]"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#3867FF] animate-spin"></div>
      </div>
      <p className="text-[#858BA8] text-[14px] font-medium animate-pulse">Memuat data...</p>
    </div>
  );
}
