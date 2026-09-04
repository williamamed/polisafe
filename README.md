
# 🛡️ Polisafe IAM & OAuth Server

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue)

**Polisafe** es una solución completa de **Identity and Access Management (IAM)** y **servidor OAuth 2.0 / OpenID Connect** autoalojable. Está diseñado para ser el núcleo de seguridad de tus aplicaciones, proporcionando autenticación, autorización, gestión de usuarios, roles, permisos y scopes, todo con un enfoque en la flexibilidad y el control total de tus datos.

## ✨ Características Principales

- **🔐 OAuth 2.0 & OpenID Connect**: Soporte completo para los flujos `authorization_code`, `implicit`, `password`, `client_credentials` y `refresh_token`.
- **👥 Gestión de Usuarios**: Registro, autenticación, perfiles, y recuperación de contraseñas.
- **🧩 Autorización Granular**: Sistema de permisos basado en recursos, roles y scopes (RBAC/ABAC).
- **🏢 Multi-Tenant**: Soporte nativo para múltiples organizaciones (tenants) en una sola instancia.
- **🔑 PKCE**: Soporte para el estándar PKCE (Proof Key for Code Exchange) para clientes públicos.
- **📱 Magic Links**: Autenticación sin contraseña mediante enlaces mágicos.
- **🔗 Proveedores Externos**: Integración con proveedores OAuth externos (Google, GitHub, etc.).
- **⚙️ Configurable por Cliente**: Cada cliente OAuth puede tener su propia configuración de expiración de tokens, scopes permitidos, etc.
- **🖥️ UI Integrada**: Interfaz de usuario para login, consentimiento y registro, completamente personalizable.
- **📊 Escalable**: Diseñado para ser desplegado en entornos de producción con alta disponibilidad.
- **🐳 Listo para Docker**: Incluye un `Dockerfile` y configuración para despliegue con Docker.

## 🚀 Tecnologías

- **[NestJS](https://nestjs.com/)**: Framework progresivo para Node.js.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático para un código más robusto.
- **[PostgreSQL](https://www.postgresql.org/)**: Base de datos relacional principal.
- **[Passport](http://www.passportjs.org/)**: Middleware de autenticación.
- **[JWT](https://jwt.io/)**: Tokens de acceso y refresco.
- **[Docker](https://www.docker.com/)**: Contenerización y despliegue.

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (v14 o superior)
- **Docker** y **Docker Compose** (opcional, para despliegue)

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/polisafe.git
cd polisafe
```

### 2. Configurar el archivo `.env`

Crea un archivo `.env` en la raíz del proyecto. Puedes basarte en el siguiente ejemplo:

```env
# NODE_ENV=production|development
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_contraseña_segura
DB_DIALECT=postgres
DB_NAME=polisafe

# Server Configuration
PORT=3000
APP_PREFIX=/api/v5/security

# JWT Configuration
PSL_JWT_REFRESH_EXPIRES_IN=1h
PLS_JWT_ACCESS_EXPIRES_IN=15m
PLS_PUBLIC_URL=https://id.tudominio.com

# Security
PLS_ORIGIN_COOKIE_SECRET=secret_aleatorio_muy_seguro

# Schemas (separados por coma)
SCHEMAS=security,oauth

# (Opcional) Configuración de Backbone para eventos
BACKBONE_SUBSCRIBE=https://tu-backbone.com/api/subscribe
BACKBONE_PUBLISH=https://tu-backbone.com/api/publish
BACKBONE_ENDPOINT=https://tu-backbone.com/api/endpoint
BACKBONE_NAME=polisafe:service

# (Opcional) UI
PLS_UI_MODE=""
PLS_UI_IA_CHAT=""
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Migrar la base de datos

El proyecto utiliza un sistema de migraciones para crear las tablas necesarias.

```bash
npm run migrate:refresh
```

**Nota**: Asegúrate de que la base de datos PostgreSQL esté en funcionamiento antes de ejecutar este comando.

### 5. Ejecutar en modo desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🐳 Despliegue con Docker (Recomendado)

### 1. Configurar variables de entorno

Puedes pasar las variables de entorno directamente en el `docker-compose.yml` o usando un archivo `.env`.

### 2. Construir y ejecutar

```bash
docker-compose up -d
```

Esto levantará el servicio en el puerto `5404` (mapeado al `3000` del contenedor). Ajusta los puertos según tu necesidad.

### 3. Configuración con Traefik (Opcional)

El archivo `docker-compose.yml` incluye labels para **Traefik**, lo que facilita el despliegue en un entorno de producción con un proxy inverso. Ajusta las reglas y el host según tu dominio.

## 🔌 Endpoints Principales

### OAuth 2.0 & OpenID Connect

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/polisafe/oauth/auth` | Inicia el flujo de autorización. |
| `POST` | `/polisafe/oauth/token` | Intercambia un código de autorización por tokens. |
| `POST` | `/polisafe/oauth/revoke` | Revoca un token de acceso o refresco. |
| `GET` | `/polisafe/openid/userinfo` | Obtiene la información del usuario autenticado. |
| `GET` | `/.well-known/openid-configuration` | Punto de descubrimiento OpenID Connect. |

### Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/polizei/admin/user/list` | Lista de usuarios. |
| `POST` | `/polizei/admin/user/create` | Crea un usuario. |
| `GET` | `/polizei/admin/roles/list` | Lista de roles. |
| `GET` | `/polizei/admin/scope/list` | Lista de scopes. |

> ⚠️ **Importante**: Los endpoints de administración requieren autenticación y permisos específicos.

## 🗂️ Estructura de Base de Datos

Polisafe utiliza **PostgreSQL** con los siguientes esquemas principales:

- `security`: Gestión de usuarios, roles, permisos y scopes.
- `oauth`: Almacenamiento de clientes OAuth, códigos de autorización y tokens.

## 🛠️ Personalización y Extensiones

- **Scopes y Permisos**: Puedes definir tus propios scopes y permisos a través de la API de administración.
- **UI**: Los templates (login, consent, register) se encuentran en la carpeta `public` y pueden ser sobreescritos o personalizados.
- **Proveedores Externos**: Puedes agregar nuevos proveedores OAuth en el servicio `ProvidersService`.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza tus cambios y haz commit (`git commit -m 'Añade nueva característica'`).
4.  Sube la rama (`git push origin feature/nueva-caracteristica`).
5.  Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## 💬 Soporte

Para preguntas o soporte, abre un issue en el repositorio o contacta a [soporte@tudominio.com](mailto:soporte@tudominio.com).

---

**Hecho con ❤️ por [Tu Nombre / Equipo]**PUBLISH=https://tu-backbone.com/api/publish
BACKBONE_ENDPOINT=https://tu-backbone.com/api/endpoint
BACKBONE_NAME=polisafe:service

# (Opcional) UI
PLS_UI_MODE=""
PLS_UI_IA_CHAT=""

