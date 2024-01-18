const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { generateRandomString } = require('../tools/tools');

AWS.config.update({ region: 'us-east-1' });
const TABLE_NAME = 'Users';
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
    const nombres = body.nombres
    const apellidos = body.apellidos
    const  user_name = body.user_name
    const email = body.email
    const password  = body.password
    const id_status = body.id_status
    const id_type_user = body.id_type_user

    const hashedPassword = await bcrypt.hash(password, 8);
    const token_verify = await generateRandomString(20);

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id_user: id,
      },
      UpdateExpression: 'SET nombres = :nombres, apellidos = :apellidos, user_name = :user_name, email = :email, password = :hashedPassword, id_status = :id_status, id_type_user = :id_type_user, token_verify = :token_verify',
      ExpressionAttributeValues: {
        ":nombres" : nombres,
        ":apellidos": apellidos,
        ":user_name":  user_name,
        ":email": email,
        ":hashedPassword": password,
        ":id_status": id_status,
        ":id_type_user": id_type_user,
        ":token_verify":  token_verify
        
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

