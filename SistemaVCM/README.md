# Sistema de Información · Violencia Contra la Mujer (Lima y Callao)

Sitio web estático (HTML + CSS + JS) conectado a **Supabase**. Se abre con *Go Live* de VS Code
y se publica gratis en **GitHub Pages**.

Usuario: `admin`  ·  Contraseña: `admin123`

## Estructura
```
index.html            login + aplicación
css/styles.css        diseño (vidrio translúcido, morado)
js/config.js          ← aquí pegas la URL y la clave de Supabase
js/db.js              conexión (Supabase o modo local)
js/app.js             dashboard, consultas, reportes, estadísticas, mapa
assets/logo.png       tu sticker
data/*.json           datos para probar SIN Supabase (modo local)
supabase/schema.sql   tablas + seguridad
supabase/csv/*.csv    tus datos ya limpios, listos para importar
```

## 0) Probar primero (sin Supabase)
Abre la carpeta en VS Code → clic derecho en `index.html` → **Open with Live Server**.
Con `config.js` vacío funciona en *modo demostración* con los datos de `/data`.

## 1) Crear las tablas en Supabase
1. supabase.com → New project.
2. **SQL Editor → New query**, pega todo `supabase/schema.sql` → **Run**.

## 2) Importar los datos
En **Table Editor**, abre cada tabla → **Insert → Import data from CSV** y sube el archivo del mismo nombre
de `supabase/csv/`:

| Tabla | CSV | Filas |
|---|---|---|
| casos_mensuales | casos_mensuales.csv | 3 504 |
| cem_atenciones | cem_atenciones.csv | 100 |
| fiscalia_casos | fiscalia_casos.csv | 24 |
| familias_atendidas | familias_atendidas.csv | 1 966 |

(No toques la columna `id`; se genera sola.)

## 3) Crear el usuario admin
**Authentication → Users → Add user → Create new user**
- Email: `admin@sistema.local`
- Password: `admin123`
- Marca **Auto Confirm User**.

En el login escribes solo `admin`; el sistema lo convierte a `admin@sistema.local`.

## 4) Conectar
**Project Settings → API**: copia *Project URL* y la clave *anon public* en `js/config.js`.
La clave anon es pública por diseño; los datos están protegidos por el login (RLS en `schema.sql`).

## 5) Subir a GitHub
```bash
git init
git add .
git commit -m "Sistema de información VCM"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```
Luego en GitHub: **Settings → Pages → Branch: main / root → Save**.

## Notas
- Las credenciales aparecen precargadas en el login. Para quitarlas, borra `value="admin"` y `value="admin123"` en `index.html`.
- El mapa usa ubicaciones referenciales (centro aproximado) de los distritos de Lima Metropolitana y Callao.
- No había datos de *personas desaparecidas* en los archivos, por eso el sistema cubre solo violencia contra la mujer.
