// const SizeControl = ({ size, onSizeChange, min = 100, max = 400 }) => (
//     <div className="bg-white p-3 p-md-4 mt-3 mbt-lg-4 text-capitalize rounded-1">
//         <h3 className="text-lg font-semibold mb-4">Size</h3>
//         <div className="space-y-3">
//             <input
//                 type="range"
//                 min={min}
//                 max={max}
//                 value={size}
//                 onChange={(e) => onSizeChange(parseInt(e.target.value))}
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//             <div className="flex justify-between text-sm text-gray-600">
//                 <span>{min}px</span>
//                 <span className="font-medium">{size}px</span>
//                 <span>{max}px</span>
//             </div>
//         </div>
//     </div>
// );
//
// export default SizeControl;