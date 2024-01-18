const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
});

const dynamoDB = new AWS.DynamoDB();

// Función para crear la tabla 'TypeUsers'
const createTypeUsersTable = () => {
  const tableParams = {
    TableName: 'TypeUsers',
    KeySchema: [
      { AttributeName: 'id_type_user',
        KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id_type_user', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  dynamoDB.createTable(tableParams, (err, data) => {
    if (err) {
      console.error('Error al crear la tabla TypeUsers:', err);
    } else {
      console.log('Tabla TypeUsers creada con éxito:', data);

      // Llama a la función para insertar datos solo cuando la tabla esté en el estado 'ACTIVE'
      waitForTypeUsersTableToBeActive();
    }
  });
};

const waitForTypeUsersTableToBeActive = () => {
  const params = {
    TableName: 'TypeUsers',
  };

  dynamoDB.waitFor('tableExists', params, (err, data) => {
    if (err) {
      console.error('Error al esperar a que la tabla TypeUsers esté activa:', err);
    } else {
      console.log('La tabla TypeUsers está activa, insertando datos...');
      // Llama a la función para insertar datos
      insertTypeUsersData();
    }
  });
};

// Función para insertar datos en la tabla 'TypeUsers'
const insertTypeUsersData = () => {
    const itemsToInsert = [
      { id_type_user: { N: '1' }, nombre: { S: 'Programador' }, id_status: { N: '1' } },
      { id_type_user: { N: '2' }, nombre: { S: 'Admin' }, id_status: { N: '1' } },
      { id_type_user: { N: '3' }, nombre: { S: 'Gerencia' }, id_status: { N: '1' } },
    ];
  
    itemsToInsert.forEach((item) => {
      const params = {
        TableName: 'TypeUsers',
        Item: item,
      };
  
      dynamoDB.putItem(params, (error, result) => {
        if (error) {
          console.error('Error al insertar datos en TypeUsers:', error);
        } else {
          console.log('Datos insertados con éxito en TypeUsers:', result);
        }
      });
    });
  };
  
  // Llama a la función para crear la tabla 'TypeUsers'
  createTypeUsersTable();