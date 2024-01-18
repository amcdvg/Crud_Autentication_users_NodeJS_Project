// const jwt = require("jsonwebtoken")

// exports.userValidator = async (req, res, table, action) => {
//   let response = false
//   jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY, (error, authData) => {
//     if(!error){
//       if(typeof authData.permissions[table] !== "undefined" && typeof authData.permissions[table][action] !== "undefined"){
//         if(authData.permissions[table][action] != 0){
//           response = true
//         }else{
//           response = false
//         }
//       }
//     }else{
//       response = false
//     }
//   })
//   return response
// }

// exports.generateRandomString = async (num) => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   let result1 = ''
//   const charactersLength = characters.length
//   for (let i = 0; i < num; i++) {
//     result1 += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result1
// }
const jwt = require("jsonwebtoken");

exports.userValidator = (event, table, action) => {
  return new Promise((resolve, reject) => {
    const headers = event.headers || {}; // Asegúrate de que headers esté definido
    const cookieHeader = headers.cookie || '';
    
    // Extraer el token JWT del encabezado de la cookie
    const tokenMatch = cookieHeader.match(/jwt=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      resolve(false);
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
      if (!error && authData) {
        if (
          typeof authData.permissions[table] !== "undefined" &&
          typeof authData.permissions[table][action] !== "undefined"
        ) {
          resolve(authData.permissions[table][action] !== 0);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};

exports.generateRandomString = (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
};
