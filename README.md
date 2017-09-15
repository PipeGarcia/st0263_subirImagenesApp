# Subir Imagenes App
Tópicos Especiales en Telemática

Realizado por:

* Andrés Felipe García Granados
* Cristian David Suaza Cárdenas
* Stiven Andrés Hurtado Loaiza

# Descripción de la aplicación

Aplicación web que permite gestionar imágenes, donde hay un CRUD tanto de usuarios como de las imágenes 
(subir, eliminar, buscar y descargar imagenes; crear, actualizar, eliminar usuarios).

# 1. Análisis

# 1.1 Requisitos funcionales:

  1. Crear usuario
  2. Cambiar nombre de usuario
  3. Cambiar email
  4. Cambiar contraseña
  5. Eliminar usuario
  6. Iniciar sesión
  7. Cerrar sesión
  8. Subir imagen
  9. Buscar imagen por nombre con extensión (Ej: imagen.jpg)
  10. Eliminar imagen por nombre con extensión (Ej: imagen.jpg)
  11. Autenticar usuario con Google
  12. Descargar imágenes
  
# 1.2 Definición de tecnología de desarrollo y despliegue

  - Lenguaje de Programación: Javascript
  - Framework web backend: NodeJS - Express
  - Framework web frontend: no aplica - se usan templates HTML para las vistas
  - Base de datos: MongoDB
  - Web App Server: NodeJS
  - Web Server: NGINX y Apache Web Server
  
# 2. Desarrollo

  Se utiliza el patrón MVC, para la parte de autenticación de los usuarios se utilizó passport, lo cual ayudó 
  para el login y el logout. En cuanto a las imágenes, se utilizó multer, el cual facilita el proceso para subir 
  archivos. Además se utiliza passport-google-oauth para la autenticación con Google y por último se utiliza el
  modulo de node "compression" para comprimir los assets y el módulo "node-cache" para la implementación de cache
  con respecto a las imágenes.
  
# 3. Diseño

# 3.1 Modelo de datos:

  users:
  
    username: {
      type: String,
      index:true
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  
  images:
    
    username: {
      type: String,
    },
    originalname: {
      type: String
    },
    destination: {
      type: String
    }
  
  # 3.2 Servicios Web
  
  - Servicio Web: Se inserta un registro de Imagen en la base de datos. Método: POST URI: /
  - Servicio Web: Realiza la búsqueda de imagenes en la base de datos por campo username. Método: 
  POST URI: /myImages
  - Servicio Web: Borra una Imagen de la base de datos por campo originalname. Método: 
  POST URI: /deleteImage
  - Servicio Web: Actualiza nombre de usuario en la base de datos por campo username. Método: POST URI: /settings2
  - Servicio Web: Actualiza email del usuario en la base de datos por campo email. Método: POST URI: /settingsEmail
  - Servicio Web: Actualiza la contraseña del usuario en la base de datos por campo password. Método: POST URI: /settingsPassword
  - Servicio Web: Elimina el Usuario de la base de datos por campo password. Método:
  POST URI: /settingsEliminar

  
