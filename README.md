# Manos & Magia Studio — v6 (con panel /admin)

Este paquete agrega **Netlify CMS** para editar contenido desde `/admin`.
> Importante: Para que el CMS guarde cambios, el sitio debe estar conectado a un repositorio (GitHub/GitLab/Bitbucket) y tener **Netlify Identity + Git Gateway** activados.

## Pasos para activar el CMS
1. Subí esta carpeta a un **repo de GitHub** (o importalo en Netlify creando el sitio desde Git).
2. En Netlify, activá **Identity** (Settings → Identity → Enable Identity).
3. En Identity → **Services**, activá **Git Gateway**.
4. En Identity → **Registration**, elegí “Invite only” y enviate una invitación a `manosymagiastudio@gmail.com`.
5. Visitá `https://tu-sitio.netlify.app/admin`, iniciá sesión y empezá a editar.

## Colecciones editables
- **Ajustes** (`/data/texts.json`): título, descripción, links.
- **Productos** (`/data/products.json`): cards con título, precio desde, imagen.
- **Combos** (`/data/combos.json`): lista con ítems y precio.
- **Galería** (`/data/gallery.json`): imágenes de trabajos.

## Si seguís usando despliegue manual (ZIP)
Podés editar los archivos dentro de `/data/*.json` con cualquier editor de texto y volver a subir el ZIP a Netlify. El sitio toma esos datos al cargar.
