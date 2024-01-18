const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
});

// Crea un cliente DynamoDB
const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
// Define el esquema de la tabla 'Frutas'
const tableParams = {
  TableName: 'Frutas',
  KeySchema: [
    {
      AttributeName: 'id_fruta',
      KeyType: 'HASH', // Clave primaria de hash
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id_fruta',
      AttributeType: 'N', // Número
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

// Crea la tabla 'Frutas'
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
    TableName: 'Frutas',
  };

  dynamoDB.waitFor('tableExists', params, (err, data) => {
    if (err) {
      console.error('Error al esperar a que la tabla esté activa:', err);
    } else {
      console.log('La tabla está activa, insertando datos...');
      // Ahora inserta datos en la tabla 'Frutas'
      insertData();
    }
  });
};

// Función para insertar datos en la tabla 'Permissions'
const insertData = () => {
  const itemsToInsert = [
    {
      id_fruta: 1,
      nombre: 'Manzana',
      precio: 2200,
    },
    {
      id_fruta: 2,
      nombre: 'Uvas',
      precio: 4000,
    },
    {
      id_fruta: 3,
      nombre: 'Banano',
      precio: 1000,
    },

  ];

  itemsToInsert.forEach((item) => {
    const params = {
      TableName: 'Frutas',
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


