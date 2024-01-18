const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Frutas'
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
    const id_fruta = parseInt(event.pathParameters.id, 10);

    const params = {
      TableName: 'Frutas',
      Key: {
        id_fruta: id_fruta,
      },
      UpdateExpression: 'SET nombre = :nombre, precio = :precio',
      ExpressionAttributeValues: {
        ':nombre': body.nombre,
        ':precio': parseInt(body.precio, 10),
        
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

