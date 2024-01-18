const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';
require('dotenv').config();

exports.login = async (event) => {
  try {
    let body;

    try {
      // Intenta parsear el cuerpo como JSON
      body = JSON.parse(event.body);
    } catch (error) {
      // Si falla, asume que el cuerpo ya es un objeto
      body = event.body;
    }

    const user_name = body.user_name;
    const password = body.password;

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'user_name = :username',
      ExpressionAttributeValues: { ':username': user_name },
    };

    const scanResult = await docClient.scan(params).promise();
    console.log(scanResult);
    let userResult = scanResult

    if (userResult.Items.length !== 0) {
        const user = userResult.Items[0];
  
        if (!(await bcrypt.compare(password, user.password))) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'La contraseña ingresada es incorrecta' })
          };
        }
        
        const permissionsParams = {
          TableName: 'Permissions',
          FilterExpression: 'id_type_user = :id_type_user',
          ExpressionAttributeValues: {':id_type_user': user.id_type_user}
        };
        const permissionsResult = await docClient.scan(permissionsParams).promise();
        
        
        const userJson = {
          id_user: user.id_user,
          nombres: user.nombres,
          apellidos: user.apellidos,
          user_name: user.user_name,
          email: user.email,
          id_status: user.id_status,
          id_type_user: user.id_type_user,
          permissions: {} // Ajusta según tu modelo de datos
        };
  
        // Construir userJson.permissions desde permissionsResult
        permissionsResult.Items.forEach(permission => {
          userJson.permissions[permission.tabla] = {
            can_create: permission.can_create,
            can_read: permission.can_read,
            can_update: permission.can_update,
            can_delete: permission.can_delete
          };
        });
        
        const token = jwt.sign(userJson, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TIME_SESSION });
        
        const cookiesOptions = {
          expiresIn: new Date(Date.now() + process.env.JWT_TIME_COOKIE),
          maxAge: process.env.JWT_TIME_COOKIE * 1000,
          httpOnly: true
        };

        return {
          statusCode: 200,
          body: JSON.stringify({
            user: userJson,
            token: token
          }),
          headers: {
            'Set-Cookie': `jwt=${token}; ${cookiesOptions}`
          }
        };
      }
       else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Usuario no registrado' })
        };
      }

  } catch (error) {
    console.error('Error en la función de login:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
