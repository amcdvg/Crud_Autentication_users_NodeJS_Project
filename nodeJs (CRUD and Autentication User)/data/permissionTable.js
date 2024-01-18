const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
});

const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

// Define el esquema de la tabla 'Permissions'
const tableParams = {
  TableName: 'Permissions',
  KeySchema: [
    {
      AttributeName: 'id_permission',
      KeyType: 'HASH', // Clave primaria de hash
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id_permission',
      AttributeType: 'N', // Número
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

// Crea la tabla 'Permissions'
dynamoDB.createTable(tableParams, (err, data) => {
  if (err) {
    console.error('Error al crear la tabla:', err);
  } else {
    console.log('Tabla creada con éxito:', data);
    // Espera a que la tabla esté activa antes de insertar datos
    waitForTableToBeActive();
  }
});

// Función para esperar a que la tabla esté activa
const waitForTableToBeActive = () => {
  const params = {
    TableName: 'Permissions',
  };

  dynamoDB.waitFor('tableExists', params, (err, data) => {
    if (err) {
      console.error('Error al esperar a que la tabla esté activa:', err);
    } else {
      console.log('La tabla está activa, insertando datos...');
      // Ahora inserta datos en la tabla 'Permissions'
      insertData();
    }
  });
};

// Función para insertar datos en la tabla 'Permissions'
const insertData = () => {
  const itemsToInsert = [
    {
      id_permission: 1,
      id_type_user: 1,
      tabla: 'users',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 3,
      id_type_user: 1,
      tabla: 'frutas',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 4,
      id_type_user: 1,
      tabla: 'paises',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 5,
      id_type_user: 2,
      tabla: 'users',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 6,
      id_type_user: 2,
      tabla: 'frutas',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 7,
      id_type_user: 2,
      tabla: 'paises',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    },
    {
      id_permission: 8,
      id_type_user: 3,
      tabla: 'frutas',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: false,
    },
    {
      id_permission: 9,
      id_type_user: 3,
      tabla: 'paises',
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: false,
    },

  ];

  itemsToInsert.forEach((item) => {
    const params = {
      TableName: 'Permissions',
      Item: item,
    };

    documentClient.put(params, (error, result) => {
      if (error) {
        console.error('Error al insertar datos:', error);
      } else {
        console.log('Datos insertados con éxito:', result);
      }
    });
  });
};
