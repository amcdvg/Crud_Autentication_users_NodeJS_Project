const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Paises'
module.exports.update = async (event) => {
  try {
    try {
        // Intenta parsear el cuerpo como JSON
        body = JSON.parse(event.body);
        //body = event.body;
    } catch (error) {
        // Si falla, asume que el cuerpo ya es un objeto
        body = event.body;
    }
    const id = parseInt(event.pathParameters.id, 10);

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id_pais: id,
      },
      UpdateExpression: 'SET nombre = :nombre, poblacion = :poblacion',
      ExpressionAttributeValues: {
        ':nombre': body.nombre,
        ':poblacion': parseInt(body.poblacion, 10),
        
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registro actualizado', updatedAttributes: result.Attributes }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ha ocurrido un error en el servidor', error }),
    };
  }
};

