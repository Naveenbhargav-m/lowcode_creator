// function Panel({ children, title }) {
//     return (
//         <div style={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             padding: "16px",
//             margin: "16px 0",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             backgroundColor:"white"
//         }}>
//             <h3 style={{ marginBottom: "8px" }}>{title}</h3>
//             <div>{children}</div>
//         </div>
//     );
// }

// function AsModal({ children, isOpen, onClose }) {
//     if (!isOpen) return null;

//     return (
//         <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//         }}>
//             <div style={{
//                 backgroundColor: "#fff",
//                 padding: "24px",
//                 borderRadius: "8px",
//                 minWidth: "300px",
//                 boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
//             }}>
//                 <button onClick={onClose} style={{
//                     position: "absolute",
//                     top: "8px",
//                     right: "8px",
//                     background: "none",
//                     border: "none",
//                     fontSize: "16px",
//                     cursor: "pointer"
//                 }}>✖</button>
//                 {children}
//             </div>
//         </div>
//     );
// }



// export {Panel , AsModal};