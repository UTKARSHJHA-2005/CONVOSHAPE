// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import photo1 from "../assets/photo1.jpg";
// import photo2 from "../assets/photo2.webp";
// import photo3 from "../assets/photo3.jpg";
// import photo4 from "../assets/photo4.jpg";

// const Profile = () => {
//   // const [userInfo, setUserInfo] = useState({
//   //   name: "Archit Sharma",
//   //   location: "Mumbai",
//   //   about:
//   //     "A charismatic and ambitious man with a sharp intellect and a compassionate heart. Passionate about personal growth, he embraces challenges with resilience and creativity. With a strong sense of purpose, he thrives on building meaningful connections, inspiring those around him. A visionary leader and lifelong learner, he balances confidence with humility, always striving for excellence.",
//   // });
//   // const [profilePic, setProfilePic] = useState(pic); 
//   // const [isEditing, setIsEditing] = useState(false);
//   // const [tempUserInfo, setTempUserInfo] = useState({ ...userInfo });

//   // const handleFileChange = (e) => {
//   //   const file = e.target.files[0];
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onload = () => {
//   //       setProfilePic(reader.result); 
//   //     };
//   //     reader.readAsDataURL(file);
//   //   }
//   // };

//   // const handleEditClick = () => {
//   //   setIsEditing(true);
//   // };

//   // const handleCancelClick = () => {
//   //   setIsEditing(false);
//   //   setTempUserInfo({ ...userInfo });
//   // };

//   // const handleSaveClick = () => {
//   //   setUserInfo({ ...tempUserInfo });
//   //   setIsEditing(false);
//   // };

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setTempUserInfo((prev) => ({ ...prev, [name]: value }));
//   // };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="bg-black text-white p-6 flex items-center">
//         <div className="relative">
//           <img
//             src={profilePic}
//             alt="Profile"
//             className="w-20 h-20 rounded-full mr-4"
//           />
//           {isEditing && (
//             <div className="absolute bottom-0 right-0">
//               <label className="cursor-pointer bg-blue-500 text-white text-xs rounded-full px-2 py-1 hover:bg-blue-600">
//                 Upload
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           )}
//         </div>
//         <div>
//           {isEditing ? (
//             <input
//               type="text"
//               name="name"
//               className="bg-gray-800 text-white rounded-md p-1"
//             />
//           ) : (
//             <h1 className="text-2xl font-semibold">{userInfo.name}</h1>
//           )}
//           {isEditing ? (
//             <input
//               type="text"
//               name="location"
//               className="bg-gray-800 text-gray-300 rounded-md p-1 mt-1"
//             />
//           ) : (
//             <p className="text-gray-400">{userInfo.location}</p>
//           )}
//         </div>
//         {!isEditing ? (
//           <button
//             className="ml-auto border border-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-800"
//           >
//             Edit Profile
//           </button>
//         ) : (
//           <div className="ml-auto flex gap-2">
//             <button
//               className="border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-white"
//             >
//               Save
//             </button>
//             <button
//               className="border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="p-6">
//         <h2 className="text-lg font-semibold mb-4">About</h2>
//         {isEditing ? (
//           <textarea
//             name="about"
//             className="w-full bg-white shadow p-4 rounded-lg resize-none"
//             rows="4"
//           />
//         ) : (
//           <div className="bg-white shadow p-4 rounded-lg">{userInfo.about}</div>
//         )}
//       </div>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Recent Photos</h2>
//           <button className="text-blue-500 hover:underline">Show all</button>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <img
//             src={photo1}
//             alt="Photo 1"
//             className="w-full h-40 object-cover rounded-lg"
//           />
//           <img
//             src={photo2}
//             alt="Photo 2"
//             className="w-full h-40 object-cover rounded-lg"
//           />
//           <img
//             src={photo3}
//             alt="Photo 3"
//             className="w-full h-40 object-cover rounded-lg"
//           />
//           <img
//             src={photo4}
//             alt="Photo 4"
//             className="w-full h-40 object-cover rounded-lg"
//           />
//         </div>
//       </div>
//       <Link to="/">
//         <div className="text-center">
//           <button className="bg-blue-500 text-white hover:bg-blue-600 hover:text-black font-semibold w-[500px] h-[50px] rounded-xl">
//             Log Out
//           </button>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default Profile;