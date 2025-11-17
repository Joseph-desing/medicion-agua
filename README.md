Aplicación móvil para registro de mediciones de agua
Desarrollar una aplicación móvil en Ionic que permita a las personas encargadas de tomar las lecturas de los medidores de agua en el Distrito Metropolitano de Quito registrar y validar las mediciones de manera digital.
La aplicación debe permitir al usuario registrar información detallada de cada medición, incluyendo:

Fotografía del medidor (como evidencia visual).

Ubicación geográfica obtenida directamente desde el GPS del dispositivo.

Valor del medidor y observaciones adicionales.

Foto de la fachada de la casa.

Cada registro debe guardar las coordenadas GPS (latitud y longitud) y generar automáticamente un enlace que abra la ubicación en Google Maps, permitiendo validar visualmente el punto donde se realizó la lectura.

Todos los datos recopilados deberán ser almacenados en un servicio en la nube, utilizando Firebase o Supabase como backend.

El sistema debe contemplar dos tipos de perfiles de usuario con diferentes permisos de acceso:

Administrador: puede visualizar todos los registros realizados por los medidores, incluyendo fotos, coordenadas y enlaces de ubicación.

Medidor: puede registrar nuevas lecturas y visualizar únicamente sus propios registros.

El objetivo es garantizar la trazabilidad, autenticidad y validación con evidencia de cada lectura tomada en campo, facilitando el control y la supervisión de las mediciones realizadas en diferentes zonas del Distrito Metropolitano de Quito.

Entregables: apk y repositorio de github con readme detallado.

1.- Es crear la carpeta donde va ir todo el proyecto.
<img width="1911" height="1079" alt="image" src="https://github.com/user-attachments/assets/bd6e6bdb-cc96-403e-a47e-837c406181c4" />

2.- Creamos el proyecto en ionic stanmodule
<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/57a76a86-e184-4df6-91b9-a123046f425b" />

3.- Creamos las todas las carpetas que vamos a utilizar para la realizacion del proyecto 
<img width="665" height="1037" alt="image" src="https://github.com/user-attachments/assets/794ae1fc-3b0a-4bab-8812-0e424fb7eb29" />
<img width="655" height="984" alt="image" src="https://github.com/user-attachments/assets/cd9645f0-8a9c-4941-a9d4-a6b2cce24e7d" />
<img width="565" height="1002" alt="image" src="https://github.com/user-attachments/assets/2c2d0966-ae6d-45cb-8fbd-79c0900a392b" />
Con las carpetas ya creados realizamos las respectivas creacion del login, para crear nuevo usuario, para el usuario y el administrador.
<img width="1900" height="1079" alt="image" src="https://github.com/user-attachments/assets/c908bcb2-fb18-478e-9502-a249a3e989ef" />
<img width="1908" height="1079" alt="image" src="https://github.com/user-attachments/assets/0b9d33be-32f6-435a-88da-fb3c06fe9b6b" />

Registro de nuevo usuario o admi.
<img width="1905" height="1017" alt="image" src="https://github.com/user-attachments/assets/2c14e8a5-05e2-472c-8c49-4161247ccf61" />
<img width="1894" height="1079" alt="image" src="https://github.com/user-attachments/assets/9d6df8bb-8aca-405b-b38c-4207e0cb5e8f" />

4.- Vamos a crear la base en supabase y todo lo que necesite para registrar el usuario y el admin donde se guarden los datos que me piden.
<img width="1913" height="910" alt="image" src="https://github.com/user-attachments/assets/81ded9b3-eb6a-40ba-a375-394d552f1311" />

5.- Aqui se iran registrando los usaurio y admin
<img width="1919" height="833" alt="image" src="https://github.com/user-attachments/assets/c7aa61db-ca41-4f0a-a031-6b040e0b560d" />

6.- Entramos al registro del usuario.
<img width="1919" height="984" alt="image" src="https://github.com/user-attachments/assets/6e80ca08-8f30-4f28-bfa2-845fc6740339" />
<img width="1919" height="1048" alt="image" src="https://github.com/user-attachments/assets/bdce6ed7-82e9-4262-ae47-cdb026ac8da3" />

7.- Aqui podemso registrar nuevas lecturas de medidores.
<img width="1919" height="900" alt="image" src="https://github.com/user-attachments/assets/4f47a33f-1b81-45a5-8731-859b3502169c" />

8.- Aqui se ira guardando todos los datos que se vaya  ingresando.
<img width="1919" height="900" alt="image" src="https://github.com/user-attachments/assets/66bcfb61-1ddf-475e-b0b5-bff8c9eac992" />

9.- Aqui es el panel del administrador donde podra ver todas las lecturas de los usuarios que ayan ingresado.
<img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/24ecfe2c-a4ac-44c1-ae97-83e19abacb26" />

<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/8af2b776-ad3f-4a7e-98a2-d7eba52598fd" />
10.- Aqui me permite ver la ubicacion del google maps.
<img width="1917" height="1013" alt="image" src="https://github.com/user-attachments/assets/8c3dad05-a07b-44a5-9483-e308269b1fdd" />

11.- Generamos el apk 
<img width="1919" height="1074" alt="image" src="https://github.com/user-attachments/assets/bc3ffc66-ce3c-432d-9005-1d64d55b5456" />
<img width="538" height="841" alt="image" src="https://github.com/user-attachments/assets/c3244b6a-d6a0-4f91-95d2-0c35616e3830" />

12.- Con esto estaria completo la aplcacion que me permite ingresar como usuairio y poner datos de mi medidor y tambien puedo ser administrador y puedo ver todas las lecturas.





