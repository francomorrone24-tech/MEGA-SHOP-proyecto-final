# MegaShop - Plataforma de Comercio Electrónico

Desarrollo frontend de una tienda virtual moderna optimizada con una paleta de colores oscura y acentos cyan. El sistema interactúa dinámicamente con una API externa para la gestión de catálogo y maneja la persistencia del flujo de compras en el cliente.

## Funcionalidades Implementadas
- **Maquetación Adaptativa:** Estructura fluida construida sobre Bootstrap 5, garantizando una correcta visualización en dispositivos móviles, tablets y ordenadores.
- **Consumo Asincrónico de Datos:** Integración con servicio REST (FakeStoreAPI) mediante Fetch API para la carga dinámica de artículos.
- **Localización de Catálogo:** Formateo de precios adaptado a Pesos Argentinos (ARS) y procesamiento local de nomenclaturas comerciales.
- **Módulo de Carrito Integrado:** Lógica nativa en JavaScript para agregar productos, actualizar cantidades dinámicamente, remover ítems y totalizar costos con persistencia local mediante LocalStorage.