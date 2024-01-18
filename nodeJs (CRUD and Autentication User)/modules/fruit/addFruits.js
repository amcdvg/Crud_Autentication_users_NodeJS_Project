const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Frutas'

const create = async (event) => {
  try {
    let body;

    try {
      // Intenta parsear el cuerpo como JSON
      body = JSON.parse(event.body);
      //body = event.body;
    } catch (error) {
      // Si falla, asume que el cuerpo ya es un objeto
      body = event.body;
    }
    const nombre = body.nombre
    const precio = parseInt(body.precio, 10);

    const scanParams = {
        TableName: TABLE_NAME,
        ProjectionExpression: 'id_fruta',
      };
      
      let id_fruta;
  
      try {
        const scanResult = await dynamoDB.scan(scanParams).promise();
        const maxIdUser = scanResult.Items.reduce((max, item) => Math.max(max, item.id_fruta || 0), 0);
  
        // Incrementar el valor para el nuevo elemento
        id_fruta = maxIdUser + 1;
      } catch (error) {
        console.error('Error al obtener el valor de id_fruta:', error);
        // Devuelve una respuesta o maneja el error según tus necesidades
      }
    
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id_fruta: id_fruta,
        nombre: nombre,
        precio: precio
        
      },
    };


    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registro agregado' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ha ocurrido un error en el servidor', error }),
    };
  }
};

module.exports = {
  create,
};