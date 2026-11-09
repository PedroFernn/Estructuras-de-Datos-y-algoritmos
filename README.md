# Graph Lab

Visualizador interactivo de grafos, listas enlazadas y árboles binarios de búsqueda (BST). Permite construir estructuras a mano, ejecutar algoritmos paso a paso con reproducción, pausa y paso atrás, y escribir tus propios algoritmos en un editor integrado.

## Uso rápido

No necesita servidor ni dependencias. Abre `index.html` en el navegador.

Se usa Google Fonts para las tipografías de los temas, así que se necesita conexión a internet para ver las fuentes correctamente. Sin conexión, la app sigue funcionando con fuentes del sistema.

## Estructuras

El selector va por niveles: primero eliges **Tipo** (Lineales o No lineales); después aparece la familia (por ejemplo Cola o Árbol) y, si tiene variantes, un tercer selector (por ejemplo Cola simple, Deque o Cola de prioridad). Las variantes marcadas *próximamente* aún no están implementadas.

**Lineales**
- **Arreglo**: agregar al final, quitar el último.
- **Pila**: push, pop.
- **Cola**: encolar, desencolar.
- **Deque**: insertar y quitar por ambos extremos.
- **Cola de prioridad**: insertar (ordenada por valor numérico) y extraer el mínimo.
- **Lista doble**: cada nodo tiene `next` y `prev`. Insertar al inicio o al final, eliminar por valor.
- **Lista circular**: como la lista simple, pero el último apunta al primero.
- **Lista enlazada** (simple): operaciones originales.

**No lineales**
- **Grafo**: dirigido o no dirigido, ponderado o no. Con *Peso = distancia* el peso es `w = ⌊distancia / escala⌋`.
- **Árbol BST**: insertar y eliminar.
- **Árbol binario**: inserción por niveles (llena cada nivel de izquierda a derecha).
- **AVL**: inserción y eliminación con factor de equilibrio y rotaciones LL, RR, LR y RL.
- **Rojinegro**: inserción con recoloreo y rotaciones. La raíz siempre es negra.
- **B** (máximo 3 claves por nodo): inserción con división de nodos. Cada nodo muestra sus claves separadas por `|`.
- **B+** (máximo 3 claves): las claves están en las hojas; las hojas están enlazadas entre sí (línea de enlace).
- **Trie**: inserción de palabras; cada nodo es una letra y los nodos marcados con color indican fin de palabra.
- **Tabla hash** (7 buckets, h(k) = k mod 7):
  - *Encadenamiento*: cada bucket es una lista de claves.
  - *Sondeo lineal*: arreglo de 7 slots; si el slot está ocupado, se prueba el siguiente.
- **Heap mín** y **Heap máx**: insertar y extraer la raíz. Se dibujan por niveles.

Las estructuras lineales y los heaps guardan su secuencia de valores y reconstruyen el grafo en cada operación.

## Modos de edición

Antes de borrar un nodo o una arista (con la herramienta Eliminar o con Supr/Backspace) aparece una confirmación. Usa **Eliminar** (o Enter) para continuar, o **Cancelar** (o Escape) para conservar el elemento.

Los atajos de letra (`V`, `N`, `E`, `D`) funcionan cuando el foco está en el lienzo o fuera de campos de texto. Dentro del editor de código, de los campos de texto y de los selectores, usa `Alt+1`, `Alt+2`, `Alt+3` y `Alt+4` para cambiar de modo, así no se interfiere con lo que escribes.


| Modo | Atajo | Acción |
|---|---|---|
| Mover | `V` | Arrastra nodos. Clic selecciona. `Supr` elimina. Doble clic renombra o edita peso. |
| Nodo | `N` | Clic en el lienzo crea un nodo. |
| Arista | `E` | Arrastra de origen a destino. Clic derecho también conecta dos nodos. |
| Eliminar | `D` | Clic en nodo o arista para borrarlo. |

## Algoritmos

**Grafo**
- BFS, DFS, Dijkstra, A*, Prim, Kruskal
- Bellman-Ford (detecta ciclos negativos alcanzables)
- Floyd-Warshall (muestra la matriz tras cada intermedio `k`)
- Topológico (Kahn; requiere grafo dirigido)

**Árbol (BST y binario)**
- Preorden, inorden, postorden, por niveles, altura (BST también: buscar, validar BST)

**Árbol AVL y Rojinegro**
- AVL: insertar con rotaciones (animado), buscar
- Rojinegro: insertar con recoloreo y rotaciones (animado), buscar

**B y B+**
- B: buscar (recorre los nodos y baja al hijo correspondiente)
- B+: buscar, recorrer hojas (sigue los enlaces entre hojas)

**Trie**
- Buscar prefijo (indica si el prefijo existe y si es palabra completa)

**Tabla hash**
- Función hash: muestra h(k) para cada clave
- Encadenamiento: buscar en la cadena del bucket
- Sondeo lineal: insertar y buscar probando slots

**Lista (simple, doble, circular)**
- Recorrer, buscar, nodo medio, detectar ciclo (Floyd), invertir punteros

**Arreglo**
- Búsqueda binaria (el arreglo debe estar ordenado)
- Two pointers (par con suma objetivo; requiere arreglo ordenado)
- Sliding window (suma máxima de ventana de tamaño `k`)

**Pila**
- Siguiente mayor (stack monotónica)
- Infija a postfija (shunting-yard): escribe la expresión en el campo *valor*, por ejemplo `3+4*2`
- Evaluar postfija: escribe la expresión con espacios, por ejemplo `3 4 + 2 *`

**Cola / Deque / Cola de prioridad**
- Ventana máxima con deque (usa el campo *valor* como tamaño de ventana)

**Heap (mín y máx)**
- Heapify, sift-up (último), sift-down (raíz)

Todos los algoritmos están en `js/` y se pueden editar desde la pestaña **Código**. Si modificas uno, el selector cambia a *Personalizado*.

Para los algoritmos que necesitan un valor (`k`, objetivo, expresión), escríbelo en el campo *valor* antes de reproducir.

### Limitaciones actuales

- En heaps, los intercambios se ven en el panel de datos, pero no mueven los nodos del lienzo.
- *Invertir punteros* y las rotaciones animadas muestran el proceso y el resultado, pero no modifican la estructura. La operación *Insertar* o *Eliminar* sí la modifica.
- El Rojinegro solo tiene inserción (no eliminación).
- El tamaño de la tabla hash es fijo (7). Las claves deben ser números.
- El B y el B+ tienen máximo 3 claves por nodo (orden 4).
- La eliminación en B, B+ y Trie no está implementada.

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
   ├─ core/          utilidades, estado, estructuras, selector, reproductor, editor, UI, main
   ├─ grafos/        motor del grafo, algoritmos, geometría, render, edición, opciones
   ├─ listas/        operaciones de lista y sus algoritmos
   ├─ arboles/       operaciones BST y sus algoritmos
   ├─ estructuras/   arreglo, pila, cola, deque, cola de prioridad, listas doble/circular, heaps y sus algoritmos
   ├─ log/           grabador de pasos (Recorder) y panel de log
   └─ tema/          skins, formas, interfaz de temas
```

Los archivos se cargan como scripts clásicos, en el orden definido en `index.html`. No usan módulos ES, así que funcionan abriendo el archivo directamente desde el disco.

## Seguridad y ejecución

Cada algoritmo se ejecuta en un **Web Worker** separado de la página:

- No tiene acceso al DOM, a `window`, a `localStorage` ni a `sessionStorage`.
- Se anulan en el global `fetch`, `XMLHttpRequest`, `WebSocket`, `importScripts`, `indexedDB`, `caches`, `postMessage` y otros. Los globales anulados son no escribibles y no configurables, así que no se pueden recuperar con `Function('return this')()`.
- Si el código entra en un bucle síncrono sin `await`, el hilo principal termina el Worker a los 4 segundos y muestra un aviso en el log. La página nunca se congela.
- Hay un límite de 5000 pasos grabados.

Esto reduce mucho la superficie de ataque, pero no es una garantía de seguridad de nivel de producción. Como buena práctica, no ejecutes código que no conozcas.

## Notas

- Los atajos `V`, `N`, `E`, `D` no se activan dentro de campos de texto; usa `Alt+1..4` allí.
