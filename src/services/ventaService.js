import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  orderBy, 
  query, 
  doc, 
  getDoc,
  writeBatch,
  increment 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const registrarVenta = async (itemsCarrito, totalVenta, usuarioId) => {
  try {
    // Validación exhaustiva de datos
    const itemsValidados = itemsCarrito.map(item => {
      if (!item.id || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Cantidad inválida para el producto ${item.nombre || item.id}`);
      }
      if (typeof item.precioVenta !== 'number' || item.precioVenta <= 0) {
        throw new Error(`Precio inválido para el producto ${item.nombre || item.id}`);
      }
      
      return {
        productoId: item.id,
        nombre: item.nombre || 'Producto sin nombre',
        precioUnitario: item.precioVenta,
        cantidad: item.quantity,
        subtotal: item.precioVenta * item.quantity
      };
    });

    // Preparar los datos de la venta
    const ventaData = {
      usuarioId,
      items: itemsValidados,
      total: totalVenta,
      fecha: serverTimestamp(),
      estado: 'completada'
    };

    // Validación final antes de guardar
    if (ventaData.items.some(item => item.cantidad === undefined)) {
      throw new Error('Hay cantidades no definidas en los productos');
    }

    const batch = writeBatch(db);
    const nuevaVentaRef = doc(collection(db, 'ventas'));
    batch.set(nuevaVentaRef, ventaData);

    // Actualizar stock
    itemsCarrito.forEach(item => {
      const productoRef = doc(db, 'productos', item.id);
      batch.update(productoRef, {
        stock: increment(-item.quantity)
      });
    });

    await batch.commit();
    return { success: true, ventaId: nuevaVentaRef.id };
  } catch (error) {
    console.error('Error detallado al registrar venta:', error);
    return { success: false, error: error.message };
  }
};

export const obtenerHistorialVentas = async () => {
  try {
    const q = query(
      collection(db, 'ventas'), 
      orderBy('fecha', 'desc') // Ordenar por fecha descendente
    );
    
    const querySnapshot = await getDocs(q);
    
    const ventas = querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        fecha: data.fecha?.toDate() || new Date(),
        total: data.total || 0,
        items: Array.isArray(data.items) ? data.items : [],
        usuarioId: data.usuarioId || '',
        estado: data.estado || 'completada'
      };
    });

    return ventas;
  } catch (error) {
    console.error("Error al obtener historial de ventas:", error);
    throw new Error("No se pudo cargar el historial de ventas");
  }
};

export const obtenerDetalleVenta = async (ventaId) => {
  try {
    const docRef = doc(db, 'ventas', ventaId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fecha: data.fecha?.toDate() || new Date(),
        total: data.total || 0,
        items: Array.isArray(data.items) ? data.items : [],
        usuarioId: data.usuarioId || '',
        estado: data.estado || 'completada'
      };
    }
    throw new Error('Venta no encontrada');
  } catch (error) {
    console.error("Error al obtener detalle de venta:", error);
    throw error;
  }
};