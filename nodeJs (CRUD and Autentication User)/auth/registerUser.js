const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { generateRandomString } = require('../tools/tools');

AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

exports.register = async (event) => {
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

    console.log('Cuerpo del evento:', event.body);
    console.log('Objeto body después del parseo:', body);

    const nombres = body.nombres
    const apellidos = body.apellidos
    const  user_name = body.user_name
    const email = body.email
    const password  = body.password

    // Realiza una operación de actualización atómica para incrementar el contador
    const scanParams = {
      TableName: TABLE_NAME,
      ProjectionExpression: 'id_user',
    };
    
    let id_user;

    try {
      const scanResult = await dynamoDB.scan(scanParams).promise();
      const maxIdUser = scanResult.Items.reduce((max, item) => Math.max(max, item.id_user || 0), 0);

      // Incrementar el valor para el nuevo elemento
      id_user = maxIdUser + 1;
    } catch (error) {
      console.error('Error al obtener el valor de id_user:', error);
      // Devuelve una respuesta o maneja el error según tus necesidades
    }

    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword)
    const token_verify = await generateRandomString(20);
    //ConfigurationServicePlaceholders.log(token_verify)
    const id_status = 1;
    const id_type_user = 3;

    const dataUser = {
      id_user,
      apellidos,
      email,
      id_status,
      id_type_user,
      nombres,
      password: hashedPassword,
      token_verify,
      user_name,
      body
      
    };
    

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'user_name = :username',
      ExpressionAttributeValues: { ':username': user_name },
    };
    
    const existingUser = await dynamoDB.scan(params).promise();
    
    if (existingUser.Items.length > 0) {
      // Usuario existe
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'El usuario ya existe' }),
      };
    } else {
      const insertParams = {
        TableName: TABLE_NAME,
        Item: dataUser,
      };

      await dynamoDB.put(insertParams).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Usuario Registrado' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error de registro', error }),
    };
  }
};

