// import React from 'react';
// import { useState } from 'react';

// import { UPDATE_CART_ITEM, REMOVE_FROM_CART } from "../api/apiService";

// export default function CartItem({ item, onUpdate }) {
//     const [quantity, setQuantity] = useState(item.quantity);

//     const handleUpdateQuantity = async () => {
//         try {
//             await UPDATE_CART_ITEM(item.id, { quantity });
//             onUpdate();
//             alert("Cart updated!");
//         } catch (error) {
//             alert("Failed to update cart");
//         }
//     };

//     const handleRemove = async () => {
//         try {
//             await REMOVE_FROM_CART(item.id);
//             onUpdate();
//             alert("Item removed!");
//         } catch (error) {
//             alert("Failed to remove item");
//         }
//     };

//     return (
//         <div className="flex items-center border-b py-4">
//             <img
//                 src={`http://localhost:8080/api/products/image/${item.productImage}`}
//                 alt={item.productName}
//                 className="w-16 h-16 object-cover mr-4"
//             />
//             <div className="flex-1">
//                 <h3 className="text-lg font-semibold">{item.productName}</h3>
//                 <p className="text-gray-600">${item.productPrice}</p>
//             </div>
//             <div className="flex items-center space-x-2">
//                 <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(Number(e.target.value))}
//                     className="w-16 p-2 border rounded"
//                     min="1"
//                 />
//                 <button onClick={handleUpdateQuantity} className="bg-red-500 text-white px-4 py-2 rounded">
//                     Update
//                 </button>
//                 <button onClick={handleRemove} className="bg-red-500 text-white px-4 py-2 rounded">
//                     Remove
//                 </button>
//             </div>
//         </div>
//     );
// }