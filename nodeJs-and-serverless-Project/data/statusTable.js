const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
});

const dynamoDB = new AWS.DynamoDB();

// Función para crear la tabla 'Status'
const createStatusTable = () => {
  const tableParams = {
    TableName: 'Status',
    KeySchema: [
      { AttributeName: 'id_status', KeyType: 'HASH' },
      { AttributeName: 'tiempo_activada', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id_status', AttributeType: 'N' },
      { AttributeName: 'tiempo_activada', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  dynamoDB.createTable(tableParams, (err, data) => {
    if (err) {
      console.error('Error al crear la tabla:', err);
    } else {
      console.log('Tabla creada con éxito:', data);

      // Llama a la función para insertar datos solo cuando la tabla esté en el estado 'ACTIVE'
      waitForTableToBeActive();
    }
  });
};

const waitForTableToBeActive = () => {
  const params = {
    TableName: 'Status',
  };

  dynamoDB.waitFor('tableExists', params, (err, data) => {
    if (err) {
      console.error('Error al esperar a que la tabla esté activa:', err);
    } else {
      console.log('La tabla está activa, insertando datos...');
      // Llama a la función para insertar datos
      insertStatusData();
    }
  });
};

// Función para insertar datos en la tabla 'Status'
const insertStatusData = () => {
  const itemsToInsert = [
    { id_status: { N: '1' }, nombre: { S: 'Activado' }, tiempo_activada: { N: Math.floor(Date.now() / 1000).toString() } },
    { id_status: { N: '2' }, nombre: { S: 'Pendiente' }, tiempo_activada: { N: Math.floor(Date.now() / 1000).toString() } },
    { id_status: { N: '3' }, nombre: { S: 'Desactivado' }, tiempo_activada: { N: Math.floor(Date.now() / 1000).toString() } },
  ];

  itemsToInsert.forEach((item) => {
    const params = {
      TableName: 'Status',
      Item: item,
    };

    dynamoDB.putItem(params, (error, result) => {
      if (error) {
        console.error('Error al insertar datos:', error);
      } else {
        console.log('Datos insertados con éxito:', result);
      }
    });
  });
};

// Llama a la función para crear la tabla 'Status'
createStatusTable();










