const AWS = require('aws-sdk');


AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
});

// Crea un cliente DynamoDB
const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
// Define el esquema de la tabla 'Frutas'
const tableParams = {
  TableName: 'Paises',
  KeySchema: [
    {
      AttributeName: 'id_pais',
      KeyType: 'HASH', // Clave primaria de hash
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id_pais',
      AttributeType: 'N', // Número
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

// Crea la tabla 'Paises'
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
    TableName: 'Paises',
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
      id_pais: 1,
      nombre: 'Colombia',
      poblacion: '51 millones',
    },
    {
      id_pais: 2,
      nombre: 'Venezuela',
      poblacion: '28 millones',
    },

    {
      id_pais: 3,
      nombre: 'Brasil',
      poblacion: '214 millones',
    },
    {
      id_pais: 4,
      nombre: 'Argentina',
      poblacion: '45 millones',
    },
    {
      id_pais: 5,
      nombre: 'Chile',
      poblacion: '19 millones',
    },
    {
      id_pais: 6,
      nombre: 'Perú',
      poblacion: '33 millones',
    },
    {
      id_pais: 7,
      nombre: 'Bolivia',
      poblacion: '12 millones',
    },
    {
      id_pais: 8,
      nombre: 'araguay',
      poblacion: '6 millones',
    },
    {
      id_pais: 9,
      nombre: 'Uruguay',
      poblacion: '3 millones',
    },
    // ... (repite el mismo formato para los demás países)
  ];

  itemsToInsert.forEach((item) => {
    const params = {
      TableName: 'Paises',
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




