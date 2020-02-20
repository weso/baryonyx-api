# Arquetipo API Rest Node

Arquetipo para API Rest en Node, con integración con Graylog y base de datos Mongo.

## Características integradas

Dentro del proyecto se incluyen las siguientes características:

* [ESLint](https://github.com/eslint/eslint): Linting
* [Mongoose](https://mongoosejs.com/): Conexión con MongoDB
* [log4js](https://www.npmjs.com/package/log4js): Logs

## Inicialización de la aplicación

Para inicializar la aplicación es preciso ejecutar el siguiente comando:

    npm run start

### Variables de entorno

Previamente a la inicialización, es imprescindible configurar las siguientes variables de entorno:

* SERVER_PORT: puerto en el que se arrancará el servidor. Por defecto 3000
* MONGO_URI: URI de conexión con Mongo. Por defecto mongodb://localhost:27017/app
* MONGO_USER: Usuario de conexión con Mongo. Por defecto ''
* MONGO_PASS: Password de conexión con Mongo. Por defecto ''
* LOG_LEVEL: nivel de log configurado, por defecto 'info'
* GRAYLOG_ENABLE: Habilita la conexión con Graylog. Por defecto false
* GRAYLOG_HOST: Host de Graylog. Por defecto 'graylog'
* GRAYLOG_PORT: Puerto de Graylog. Por defecto 12201
* GRAYLOG_APP_NAME: Nombre de la aplicación para Graylog. Por defecto node-baseapp

## Logging

Para realizar el logging de la aplicación se utiliza la librería "log4js". Esta utilidad permite establecer diferentes niveles de log y configurar a partir de qué nivel se muestran los logs.

Para configurar el nivel de log que se muestra, en el fichero server.js, se debe establecer el valor de la variable "winston.level" con uno de los siguientes valores, ordenados de menor a mayor nivel de detalle:

* error
* warn
* info
* verbose
* debug
* silly

Por ejempo, en caso de establecer el nivel "info":

```js
logger.level = 'info';
```

Otra opción, podría ser utilizar el valor de una variable de entorno establecida en el sistema (opción configurada actualmente):

```js
logger.level = process.env.LOG_LEVEL
```

## Linting

Para validar que el código de la aplicación cumple los estándares, se utilizará la utilidar ESLint.

Para ejecutarla, es preciso instalar en primer lugar la dependencia a nivel global:

    npm install --global eslint

Para pasar el escáner del código hay que ejecutar el siguiente comando:

    eslint **/*.js

## Entorno de desarrollo con Docker

Se ha configurado en el directorio docker-devenv un entorno de desarrollo con Mongo, mediante una plantilla de docker-compose. Para levantarlo se precisa tener instalado Docker en el equipo.

```bash
docker-compose up -d
```