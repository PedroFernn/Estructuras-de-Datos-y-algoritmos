# Graph Lab

Visualizador interactivo de grafos, listas enlazadas y árboles binarios de búsqueda (BST). Permite construir estructuras a mano, ejecutar algoritmos paso a paso con reproducción, pausa y paso atrás, y escribir tus propios algoritmos en un editor integrado.

## Uso rápido

No necesita servidor ni dependencias. Abre `index.html` en el navegador.

Se usa Google Fonts para las tipografías de los temas, así que se necesita conexión a internet para ver las fuentes correctamente. Sin conexión, la app sigue funcionando con fuentes del sistema.

## Estructuras

- **Grafo**: dirigido o no dirigido, ponderado o no. Con la opción *Peso = distancia* el peso de cada arista es `w = ⌊distancia / escala⌋` y se recalcula al arrastrar nodos.
- **Lista enlazada**: lista dirigida en cadena. Inserción al final o al inicio, eliminación de un valor.
- **Árbol BST**: árbol binario de búsqueda con inserción y eliminación. La eliminación reconstruye el árbol sin el valor.

## Modos de edición

| Modo | Atajo | Acción |
|---|---|---|
| Mover | `V` | Arrastra nodos. Clic selecciona. `Supr` elimina. Doble clic renombra o edita peso. |
| Nodo | `N` | Clic en el lienzo crea un nodo. |
| Arista | `E` | Arrastra de origen a destino. Clic derecho también conecta dos nodos. |
| Eliminar | `D` | Clic en nodo o arista para borrarlo. |

## Algoritmos

**Grafo**
- BFS
- DFS
- Dijkstra (camino mínimo con pesos no negativos)
- A* (heurística: distancia euclídea × mínima razón peso/longitud, admisible)
- Prim (MST, trata el grafo como no dirigido)
- Kruskal (MST con Union-Find, trata el grafo como no dirigido)

**Lista**
- Recorrer
- Buscar
- Nodo medio (tortuga y liebre)
- Detectar ciclo (Floyd)

**Árbol**
- Preorden, inorden, postorden, por niveles
- BST: buscar
- Altura
- Validar BST

Todos los algoritmos están en `js/` y se pueden editar desde la pestaña **Código**. Si modificas uno, el selector cambia a *Personalizado*.

## API para algoritmos personalizados

Los algoritmos son funciones asíncronas que reciben `graph`, `visualizer` y `params`.

```js
// graph (solo lectura)
graph.nodes                 // ids de nodos
graph.edges                 // [{from, to, weight}]
graph.neighbors(id)         // [{to, weight}]
graph.h(a, b)               // heurística para A*
graph.left(id) / graph.right(id) / graph.children(id)   // solo árboles

// params
params.start, params.end    // nodos elegidos en los selectores Inicio y Destino

// visualizer (graba cada paso)
await visualizer.visitNode(id, estado)        // estado: unvisited | queued | current | visited | path, o un color CSS
await visualizer.highlightEdge(u, v, estado)
await visualizer.log(mensaje)
await visualizer.setStructure(nombre, valor)  // se muestra en el panel de datos
await visualizer.showPath([ids])
```

Cada algoritmo se ejecuta una sola vez y graba los pasos. Después el reproductor los muestra, así puedes retroceder sin volver a ejecutar. Hay un límite de 5000 pasos para evitar bucles infinitos.

## Temas

Desde la pestaña **Tema** o el selector del barra superior:

- **Moderno** (por defecto), con modo claro y oscuro según el sistema.
- **Pixel Art**, con fuente pixelada, bordes en dither y líneas de escaneo.
- **Personalizado**: edita el JSON de la pestaña y pulsa *Aplicar tema*.

Campos del JSON: `name`, `font`, `fontSize`, `radius`, `shadow`, `shape` (`circle`, `square`, `hex`, `pixel`), `line` (`solid`, `dashed`, `dotted`, `dither`), `width`, `pathWidth`, `crisp`, `scan`, `palette` (`bg`, `panel`, `text`, `muted`, `border`, `edge`, `accent`) y `states` (`unvisited`, `queued`, `current`, `visited`, `path`).

También puedes registrar temas desde la consola con `registerSkin(id, cfg)`.

## Estructura del proyecto

```
graph-lab/
├─ index.html
├─ css/
│  ├─ base.css       layout, botones, pestañas, editor
│  ├─ tema.css       variables de color, líneas de escaneo
│  └─ log.css        estilos del log
└─ js/
   ├─ core/          utilidades, estado, estructuras, reproductor, editor, UI, main
   ├─ grafos/        motor del grafo, algoritmos, geometría, render, edición, opciones
   ├─ listas/        operaciones de lista y sus algoritmos
   ├─ arboles/       operaciones BST y sus algoritmos
   ├─ log/           grabador de pasos (Recorder) y panel de log
   └─ tema/          skins, formas, interfaz de temas
```

Los archivos se cargan como scripts clásicos, en el orden definido en `index.html`. No usan módulos ES, así que funcionan abriendo el archivo directamente desde el disco.

## Notas

- El aislamiento del código de usuario no es un sandbox real. Se sombrean globales peligrosos (`fetch`, `localStorage`, `window`, etc.) y se limita el número de pasos, pero no uses la app con código que no sea de confianza.
- Los atajos de teclado no se activan mientras escribes en el editor de código o en campos de texto.
