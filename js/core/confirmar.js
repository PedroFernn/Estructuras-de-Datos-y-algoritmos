/* ============ Confirmación antes de eliminar un nodo o una arista ============ */
// El borrado solo ocurre si el usuario pulsa "Eliminar". Cancelar o Escape no cambian nada.
let CONF_CB=null;
function pedirConfirmacion(texto,onOk){
 CONF_CB=onOk;
 $('#confTxt').textContent=texto;
 $('#confModal').hidden=false;
 $('#confOk').focus();
}
function cerrarConfirmacion(ok){
 const cb=CONF_CB;CONF_CB=null;
 $('#confModal').hidden=true;
 if(ok&&cb)cb();
}
$('#confOk').onclick=()=>cerrarConfirmacion(true);
$('#confCancel').onclick=()=>cerrarConfirmacion(false);
// Texto del diálogo según el elemento a borrar
const txtNodo=id=>{const n=G.nd(id);return '¿Eliminar el nodo "'+((n&&n.label)??id)+'"? Sus aristas también se borrarán.'};
const txtArista=e=>{const a=G.nd(e.u),b=G.nd(e.v);return '¿Eliminar la arista '+((a&&a.label)??e.u)+(G.directed?' → ':' — ')+((b&&b.label)??e.v)+'?'};
