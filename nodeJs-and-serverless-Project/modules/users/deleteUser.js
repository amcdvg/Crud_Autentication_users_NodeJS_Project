const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users'

const remove = async (event) => {
  try {
    
    const id = parseInt(event.pathParameters.id, 10);
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id_user: id,
      },
    };

    const result = await dynamoDb.delete(params).promise();

    if (result && result.Attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Registro eliminado' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Registro no encontrado' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ha ocurrido un error en el servidor', error }),
    };
  }
};

module.exports = {
  delete: remove,
};
