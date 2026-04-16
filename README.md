# Haircut Reservation System

API REST para la gestión de citas en peluquerías y barberías. Permite a los clientes agendar citas con profesionales, y le da a los administradores control total sobre servicios, horarios y disponibilidad.

## El problema que resuelve

Las peluquerías suelen manejar las citas de forma manual — por teléfono o en papel — lo que genera dobles reservas y conflictos de horario. Esta API maneja los intentos de reserva concurrentes de forma segura, garantizando que dos clientes nunca puedan reservar al mismo profesional en el mismo horario.

## Stack tecnológico

- **Node.js** + **Express 5**
- **MySQL 8** (via `mysql2`)
- **Swagger UI** para la documentación de la API

## Estructura del proyecto

```
├── controllers/       # Manejo de requests y validación de datos
├── repository/        # Consultas a la base de datos
├── routes/            # Definición de rutas
├── middlewares/       # Manejo de errores
├── utils/             # Helpers, validadores y clases de error
├── config/            # Configuración de Swagger
├── environments/      # Carga de variables de entorno
├── scripts/           # Dump de la base de datos (schema + datos de prueba)
└── db/                # Pool de conexiones MySQL
```

## Cómo correrlo

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nicolas-2001/haircut_reservation_system.git
cd haircut_reservation_system
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Llenar el `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=reservations_db
API_PORT=3000
NODE_ENV=development
DEBUG=false
```

### 4. Crear la base de datos

Ejecutar el script en el cliente MySQL:

```bash
mysql -u root -p < scripts/Database.sql
```

Esto crea la base de datos, todas las tablas y carga los datos de prueba.

### 5. Iniciar el servidor

```bash
npm start
```

La API estará disponible en `http://localhost:3000/api`
Documentación Swagger en `http://localhost:3000/api-docs`

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/clients | Obtener todos los clientes |
| POST | /api/clients | Crear un cliente |
| PATCH | /api/clients/:id | Actualizar un cliente |
| PATCH | /api/clients/:id/deactivate | Desactivar un cliente |
| GET | /api/professionals | Obtener todos los profesionales con sus servicios |
| POST | /api/professionals | Crear un profesional |
| PATCH | /api/professionals/:id | Actualizar un profesional |
| PATCH | /api/professionals/:id/deactivate | Desactivar un profesional |
| POST | /api/professionals/:id/services | Asignar un servicio a un profesional |
| GET | /api/services | Obtener todos los servicios |
| POST | /api/services | Crear un servicio |
| PATCH | /api/services/:id | Actualizar un servicio |
| PATCH | /api/services/:id/deactivate | Desactivar un servicio |
| GET | /api/appointments | Obtener citas (con filtros opcionales) |
| GET | /api/appointments/:id | Obtener una cita por ID |
| POST | /api/appointments | Crear una cita |
| PATCH | /api/appointments/:id | Actualizar una cita |

El endpoint de citas soporta filtros por query params: `client_id`, `professional_id`, `service_id`, `status_id`, `date_from`, `date_to`.

## Cómo se maneja la concurrencia

Uno de los desafíos principales de un sistema de reservas es evitar que dos usuarios reserven al mismo profesional en el mismo horario al mismo tiempo. Un enfoque ingenuo de verificar disponibilidad y luego insertar falla bajo carga concurrente — ambas solicitudes pueden pasar la validación antes de que cualquiera escriba en la base de datos.

Para resolver esto, la creación de citas usa una transacción MySQL con un bloqueo `SELECT ... FOR UPDATE`:

1. Se abre una transacción en una conexión dedicada.
2. Antes de insertar, se ejecuta un `SELECT ... FOR UPDATE` que busca citas existentes que se solapan con el horario solicitado para el mismo profesional — excluyendo las canceladas.
3. La cláusula `FOR UPDATE` bloquea las filas coincidentes (o el gap en el índice si no hay filas), impidiendo que cualquier otra transacción inserte una cita conflictiva hasta que la actual haga commit o rollback.
4. Si hay conflicto, la transacción se revierte y se retorna un `409 Conflict`.
5. Si no hay conflicto, la cita se inserta y se confirma de forma atómica.

Esto garantiza que incluso bajo solicitudes simultáneas, solo una reserva puede tener éxito para un horario determinado.
