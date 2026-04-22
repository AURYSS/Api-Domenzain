# Privacidad de Datos - Documentación

## Estrategia de Privacidad de Datos

Este documento describe cómo el API maneja la privacidad y la seguridad de los datos de usuario.

## Principios Implementados

1. **Filtrado de Datos Sensibles**: Los datos sensibles (contraseña, hash, correo) nunca se exponen en respuestas JSON
2. **Separación de Contextos**: Se utilizan DTOs diferentes para datos públicos vs. privados
3. **Acceso Basado en Roles**: Solo administradores pueden ver la lista de usuarios públicos

## Endpoints y Filtrado de Datos

### 1. **GET /auth/me** - Perfil del Usuario Autenticado
- **DTO**: `ProfileDto`
- **Datos Expuestos**: `id`, `username`, `role`
- **Datos Filtrados**: `password`, `hash`, `created_at`, `lastname`, `name`
- **Nota**: Solo retorna información del usuario autenticado

```json
{
  "id": 1,
  "username": "juan_perez",
  "role": "admin"
}
```

### 2. **GET /user** - Lista de Usuarios (Solo Admin)
- **DTO**: `UserPublicDto` 
- **Datos Expuestos**: `id`, `name`, `lastname`, `role`, `created_at`, `task_count`
- **Datos Filtrados**: `password`, `hash`, `username`, `email`, `phone`
- **Requisito**: Guard AdminGuard (solo administradores)

```json
[
  {
    "id": 1,
    "name": "Juan",
    "lastname": "Pérez",
    "role": "user",
    "created_at": "2026-01-15T10:30:00Z",
    "task_count": 5
  }
]
```

### 3. **POST /auth/register** - Registro de Usuario
- **DTO**: `RegisterResponseDto`
- **Datos Retornados**: `userId`, `message`
- **Datos Filtrados**: Toda la información sensible del usuario

```json
{
  "message": "Usuario registrado con éxito",
  "userId": 1
}
```

### 4. **POST /auth/login** - Login de Usuario
- **DTO**: `LoginResponseDto`
- **Datos Retornados**: `success`, `message`
- **Datos Sensibles**: Guardados en cookies HTTP-Only (no expuestos en JSON)
- **Datos Filtrados**: Contraseña, hash, tokens JWT

```json
{
  "success": true,
  "message": "Logged in successfully"
}
```

### 5. **GET /api/task** - Tareas del Usuario
- **Datos de Autor Expuestos**: `id`, `name` (solo del autor)
- **Datos Filtrados**: `username`, `email`, `password`, `phone`, `role`

```json
[
  {
    "id": 1,
    "name": "Mi Tarea",
    "description": "Descripción",
    "priority": false,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "Juan"
    }
  }
]
```

## DTOs Implementados

### Módulo User (`src/modules/user/dto/`)

- **`user-public.dto.ts`**: Datos públicos de un usuario (para listado general)
  - `id`, `name`, `lastname`, `role`, `created_at`, `task_count`

- **`user-private.dto.ts`**: Datos privados de un usuario (para perfil propietario)
  - `id`, `username`, `name`, `lastname`, `role`, `created_at`, `task_count`

### Módulo Auth (`src/modules/auth/dto/`)

- **`profile.dto.ts`**: Perfil del usuario autenticado (endpoint GET /auth/me)
  - `id`, `username`, `role`

- **`register-response.dto.ts`**: Respuesta de registro
  - `userId`, `message`

- **`login-response.dto.ts`**: Respuesta de login
  - `success`, `message`

## Mejores Prácticas Implementadas

### 1. Uso de Prisma `select` para Filtrado en Base de Datos
```typescript
// ✅ CORRECTO: Solo seleccionar campos necesarios
const users = await this.prisma.user.findMany({
  select: {
    id: true,
    name: true,
    // password y hash excluidos
  }
});
```

### 2. Mapeo a DTOs
```typescript
// ✅ CORRECTO: Mapear respuesta de Prisma a DTO
private mapToUserPublicDto(user: any): UserPublicDto {
  return {
    id: user.id,
    name: user.name,
    // Solo campos públicos
  };
}
```

### 3. Cookies HTTP-Only para Tokens
```typescript
// ✅ CORRECTO: JWT guardado en cookies HTTP-Only
res.cookie('access_token', jwt, { 
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});
```

### 4. Guards para Control de Acceso
```typescript
// ✅ CORRECTO: AdminGuard en endpoint de listado de usuarios
@UseGuards(AdminGuard)
public async getUsers(): Promise<UserPublicDto[]> { }
```

## Flujo de Autenticación y Privacidad

```
1. REGISTRO (POST /auth/register)
   └─> Valida usuario único
   └─> Hashea contraseña con bcrypt
   └─> Retorna solo userId y mensaje

2. LOGIN (POST /auth/login)
   └─> Valida credenciales
   └─> Genera JWT y Refresh Token
   └─> Guarda tokens en cookies HTTP-Only
   └─> Retorna success: true (sin datos de usuario)

3. PERFIL (GET /auth/me)
   └─> Extrae payload del JWT de cookies
   └─> Retorna ProfileDto (id, username, role)
   └─> No expone contraseña ni información sensible

4. LISTADO DE USUARIOS (GET /user)
   └─> Requiere AdminGuard
   └─> Retorna UserPublicDto[] (datos públicos)
   └─> Nunca retorna username o password
```

## Variables de Entorno Críticas

Asegurar que estas variables estén configuradas correctamente:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Seguridad
NODE_ENV=production
JWT_SECRET=tu_secret_jwt_aqui
```

## Testing de Privacidad

Para verificar que los datos sensibles no se exponen:

```bash
# 1. Verificar registro - no debe incluir password
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","name":"Test"}'

# 2. Verificar login - no debe incluir password
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# 3. Verificar perfil - sin datos sensibles
curl -X GET http://localhost:3000/auth/me \
  -H "Cookie: access_token=..."

# 4. Verificar listado - solo admin
curl -X GET http://localhost:3000/user \
  -H "Cookie: access_token=..."
```

## Campos Considerados Sensibles

Los siguientes campos NO se exponen a menos que sea estrictamente necesario:

- ❌ `password` - Nunca exponible
- ❌ `hash` - Nunca exponible (refresh token hash)
- ❌ `username` - Solo para usuario autenticado
- ❌ `email` - No se expone (si se agrega a future)
- ❌ `phone` - No se expone (si se agrega en future)
- ❌ `ssn` - No se expone (si se agrega en future)

## Futuras Mejoras

1. Implementar rate limiting en endpoints de auth
2. Agregar logs de acceso (sin datos sensibles)
3. Implementar CORS restrictivo
4. Agregar validación de CSRF tokens
5. Implementar data masking en logs
