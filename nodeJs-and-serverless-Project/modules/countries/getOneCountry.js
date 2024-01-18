const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const readOne = async (event) => {
  try {
    // Puedes personalizar la lógica de autenticación y autorización aquí.
    // Aquí se asume que los datos son públicos.
    console.log(event.pathParameters.id)
    const id = parseInt(event.pathParameters.id, 10);

    const params = {
      TableName: 'Paises',
      Key: {
        id_pais: id,
      },
    };

    const result = await dynamoDb.get(params).promise();

    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
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
  readOne,
};



