const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

module.exports.read = async (event) => {
  try {
    const canExecute = true; // Puedes implementar tu lógica de validación aquí

    if (canExecute) {
      const params = {
        TableName: TABLE_NAME,
      };

      const result = await dynamoDb.scan(params).promise();

      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Acceso denegado" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Ha ocurrido un error en el servidor", error }),
    };
  }
};






