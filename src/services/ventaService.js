import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Ajusta según tu configuración de Firebase


// Función para registrar una venta en Firestore
export const registrarVenta = async (total, productos, usuarioId = null) => {
  try {
    const ventaRef = await addDoc(collection(db, 'ventas'), {
      total,
      productos, // Guarda los productos comprados
      usuarioId, // ID del usuario si está autenticado
      fecha: serverTimestamp() // Fecha automática de Firebase
    });

    return { id: ventaRef.id, total, productos, usuarioId, fecha: new Date() };
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    throw new Error('No se pudo registrar la venta');
  }
};


export const obtenerHistorialVentas = async () => {
  try {
    const ventasRef = collection(db, 'ventas');
    const q = query(ventasRef, orderBy('fecha', 'desc')); // Ordenar por fecha descendente
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate() || new Date() // Convertir Timestamp a Date
    }));
  } catch (error) {
    console.error('Error obteniendo historial de ventas:', error);
    return [];
  }
};
