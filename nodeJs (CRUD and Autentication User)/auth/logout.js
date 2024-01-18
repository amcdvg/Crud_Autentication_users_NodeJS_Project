const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.logout = async (event) => {
  try {
    const req = JSON.parse(event.body);

    if (req.headers.authorization) {
      const bearerToken = req.headers.authorization.split(" ")[1];

      // Verificar la existencia del token en DynamoDB
      const params = {
        TableName: 'Users',
        Key: { token: bearerToken },
      };

      const result = await dynamoDb.get(params).promise();

      if (result.Item) {
        // Eliminar el token de DynamoDB
        await dynamoDb.delete(params).promise();

        // Construir una respuesta adecuada para un evento
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: "logout" }),
        };

        return response;
      } else {
        // Construir una respuesta adecuada para un evento
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: "Este usuario no se encuentra autenticado" }),
        };

        return response;
      }
    } else {
      // Construir una respuesta adecuada para un evento
      const response = {
        statusCode: 401,
        body: JSON.stringify({ message: "Error de autenticación", error: { name: "NoAuthHeader", message: "La clave de autenticación no proporcionada" } }),
      };

      return response;
    }
  } catch (error) {
    // Construir una respuesta adecuada para un evento
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Error de autenticación", error }),
    };

    return response;
  }
};
