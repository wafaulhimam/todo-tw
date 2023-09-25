export default function Shimmer () {
  return (
    <div className="w-screen h-full flex flex-row justify-center mt-[120px] mb-10">
        <div className="flex flex-col gap-4 items-center">
            <div className="bg-blue-gray-200 h-20 animate-pulse rounded-lg w-52"></div>            
            <div className="bg-blue-gray-200 h-10 animate-pulse rounded-lg w-[380px]"></div> 
            {Array.from({length: 3}, (_, index) => (
                <div key={`card-${index}`} className="bg-blue-gray-200 h-48 animate-pulse rounded-lg w-[380px]"></div> 
            ))}
        </div>
    </div>
  );
}
