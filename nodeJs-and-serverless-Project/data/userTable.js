const AWS = require('aws-sdk');

// Configura el cliente DynamoDB
AWS.config.update({
    region: 'us-east-1'
});

// Crea un cliente DynamoDB Document
const documentClient = new AWS.DynamoDB.DocumentClient();

// Función para crear la tabla 'Users'
const createUsersTable = () => {
    const dynamoDB = new AWS.DynamoDB();

    const tableParams = {
        TableName: 'Users',
        KeySchema: [
            {
                AttributeName: 'id_user',
                KeyType: 'HASH', // Clave primaria de hash
            },
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'id_user',
                AttributeType: 'N', // Número
            },
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
            // Espera 5 segundos (puedes ajustar este valor según sea necesario)
            setTimeout(() => {
                // Llama a la función para insertar datos y pasa documentClient como parámetro
                insertUserData(documentClient);
            }, 5000);
        }
    });
};

// Función para insertar datos en la tabla 'Users'
const insertUserData = (documentClient) => {
    const itemsToInsert = [
        {
            id_user: 1,
            nombres: 'Alex',
            apellidos: 'Moreno',
            user_name: 'alexmoreno',
            email: 'admin@dwings.com',
            password: '$2a$10$IsZEpmuKm5JF3mrn7GK/j.E9UPPNt2wUiIkWXxfNbOa8Mj1CCvP8u',
            token_verify: 'ejrErYQdBb4uKt4awHR9',
            id_status: 1,
            id_type_user: 1,
        },
        {
            id_user: 2,
            nombres: 'Gary',
            apellidos: 'Stu',
            user_name: 'garystu',
            email: 'gary@dwings.com',
            password: '$2a$10$IsZEpmuKm5JF3mrn7GK/j.E9UPPNt2wUiIkWXxfNbOa8Mj1CCvP8u',
            token_verify: '4CEiDUDlu6AJdzjDoYxn',
            id_status: 1,
            id_type_user: 2,
          },
          {
            id_user: 3,
            nombres: 'Usuario',
            apellidos: 'Prueba',
            user_name: 'test',
            email: 'test@dwings.com',
            password: '$2a$10$IsZEpmuKm5JF3mrn7GK/j.E9UPPNt2wUiIkWXxfNbOa8Mj1CCvP8u',
            token_verify: 'xeLjLRWnC0slV8iAbpDN',
            id_status: 1,
            id_type_user: 3,
          },
    ];

    itemsToInsert.forEach((item) => {
        const params = {
            TableName: 'Users',
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

// Llama a la función para crear la tabla 'Users'
createUsersTable();
