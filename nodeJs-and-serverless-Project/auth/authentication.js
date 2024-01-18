const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

module.exports.isAuth = async (event) => {
  try {
    // Obtener información del evento HTTP (req)
    const { headers, cookies } = event;

    if (headers.authorization) {
      const bearerToken = headers.authorization.split(" ")[1];

      if (cookies.jwt && bearerToken === cookies.jwt) {
        const decode = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

        const params = {
          TableName: TABLE_NAME,
          Key: { user_name: decode.user_name },
        };

        const user = await docClient.get(params).promise();

        if (user.Item) {
          return {
            statusCode: 200,
            body: JSON.stringify({
              nombres: user.Item.nombres,
              apellidos: user.Item.apellidos,
              user_name: user.Item.user_name,
              email: user.Item.email,
              id_status: user.Item.id_status,
              id_type_user: user.Item.id_type_user,
              permissions: decode.permissions
            }),
          };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: "Usuario no encontrado" }),
          };
        }
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Este usuario no se encuentra autenticado",
          }),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Error de autenticación",
          error: {
            name: "NoAuthHeader",
            message: "La clave de autenticación no proporcionada",
          },
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error de autenticación",
        error,
      }),
    };
  }
};