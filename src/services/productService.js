import { getFirestore, collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, getDoc,writeBatch  } from 'firebase/firestore';
import { app } from '../config/firebaseConfig';

const db = getFirestore(app);

// Crear un producto
export const createProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...product,
      // Asegurar que codigoBarras sea número o null
      codigoBarras: product.codigoBarras ? Number(product.codigoBarras) : null,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Obtener todos los productos con sus proveedores
export const getProducts = async () => {
  try {
    // 1. Obtener todos los proveedores primero para optimizar
    const proveedoresSnapshot = await getDocs(collection(db, 'proveedores'));
    const proveedoresMap = {};
    proveedoresSnapshot.forEach(doc => {
      proveedoresMap[doc.id] = doc.data().nombre;
    });

    // 2. Obtener todos los productos
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const productos = productosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convertir código de barras a string para el frontend (o null)
      codigoBarras: doc.data().codigoBarras?.toString() || null,
      // Manejar stockMinimo correctamente
      stockMinimo: doc.data().stockMinimo !== undefined ? doc.data().stockMinimo : null
    }));

    // 3. Obtener relaciones producto-proveedor y combinar datos
    const productosConProveedores = await Promise.all(
      productos.map(async (producto) => {
        try {
          // Obtener relaciones para este producto
          const q = query(
            collection(db, 'producto_proveedor'),
            where('productoId', '==', producto.id)
          );
          const querySnapshot = await getDocs(q);
          
          const proveedoresIds = [];
          querySnapshot.forEach(doc => {
            proveedoresIds.push(doc.data().proveedorId);
          });

          // Mapear IDs a nombres de proveedores
          const proveedoresNombres = proveedoresIds.map(id => proveedoresMap[id] || `Proveedor ${id}`);

          return {
            ...producto,
            proveedores: proveedoresNombres.length > 0 ? proveedoresNombres : [proveedoresMap[producto.proveedorId] || 'Sin proveedor'],
            proveedorIds: proveedoresIds.length > 0 ? proveedoresIds : [producto.proveedorId].filter(Boolean)
          };
        } catch (error) {
          console.error(`Error procesando producto ${producto.id}:`, error);
          return {
            ...producto,
            proveedores: ['Error al cargar proveedores'],
            proveedorIds: []
          };
        }
      })
    );

    return productosConProveedores;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'productos', productId));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Obtener proveedores de un producto
export const obtenerProveedoresDeProducto = async (productoId) => {
  try {
    const q = query(
      collection(db, 'producto_proveedor'),
      where('productoId', '==', productoId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().proveedorId);
  } catch (error) {
    console.error("Error getting product suppliers:", error);
    throw error;
  }
};

// Obtener todos los proveedores
// En productService.js
export const getProveedores = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'proveedores'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting suppliers:", error);
    throw error;
  }
};

// Obtener un producto por su ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'productos', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        id: productSnap.id,
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        precioVenta: data.precioVenta || 0,
        precioCompra: data.precioCompra || 0,
        stock: data.stock || 0,
        stockMinimo: data.stockMinimo !== undefined ? data.stockMinimo : null,
        codigoBarras: data.codigoBarras?.toString() || '', // Convertir a string vacío si es null/undefined
        proveedorId: data.proveedorId || '',
        familiaId: data.familiaId || '', // Agregado el campo familiaId
        createdAt: data.createdAt?.toDate() || null
      };
    } else {
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    throw error;
  }
};


// Actualizar un producto
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'productos', productId);
    await updateDoc(productRef, {
      ...productData,
      // Convertir código de barras a número para Firebase (o null si está vacío)
      codigoBarras: productData.codigoBarras ? Number(productData.codigoBarras) : null,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Crear un proveedor
export const createProveedor = async (proveedor) => {
  try {
    const docRef = await addDoc(collection(db, 'proveedores'), {
      ...proveedor,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

// Buscar producto por código de barras
export const searchProductByBarcode = async (barcode) => {
  try {
    // Si el barcode es string vacío, retornar null
    if (!barcode || barcode.toString().trim() === '') return null;
    
    // Convertir a número para la consulta en Firebase
    const barcodeNumber = Number(barcode);
    
    const q = query(
      collection(db, 'productos'),
      where('codigoBarras', '==', barcodeNumber)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convertir código de barras a string para el frontend
        codigoBarras: data.codigoBarras?.toString() || ''
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
  }

};

// Añade estas funciones al final de tu productService.js

// Obtener todas las familias
export const getFamilias = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'familias'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting familias:", error);
    throw error;
  }
};

// Crear nueva familia
export const createFamilia = async (nombre) => {
  try {
    const docRef = await addDoc(collection(db, 'familias'), {
      nombre,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating familia:", error);
    throw error;
  }
};


// Eliminar una familia
export const deleteFamilia = async (id) => {
  try {
    await deleteDoc(doc(db, 'familias', id));
  } catch (error) {
    console.error("Error al querer eliminar una familia:", error);
    throw error;
  }
};


export const deleteProveedor = async (proveedorId) => {
  try {
    const proveedorRef = doc(db, "proveedores", proveedorId);
    const proveedorSnap = await getDoc(proveedorRef);

    if (!proveedorSnap.exists()) {
      throw new Error("El proveedor no existe");
    }

    // Verificar si hay productos asociados a este proveedor
    const productosQuery = query(
      collection(db, "productos"),
      where("proveedorId", "==", proveedorId)
    );
    const productosSnapshot = await getDocs(productosQuery);

    if (!productosSnapshot.empty) {
      throw new Error("Este proveedor tiene productos asociados y no puede ser eliminado.");
    }

    // Si no tiene productos asociados, eliminar proveedor
    await deleteDoc(proveedorRef);
  } catch (error) {
    console.error("Error eliminando proveedor:", error);
    throw error;
  }
};


export const getProveedorById = async (proveedorId) => {
  try {
    const proveedorRef = doc(db, 'proveedores', proveedorId);
    const proveedorSnap = await getDoc(proveedorRef);
    
    if (proveedorSnap.exists()) {
      return {
        id: proveedorSnap.id,
        nombre: proveedorSnap.data().nombre || '',
        telefono: proveedorSnap.data().telefono || '',
        email: proveedorSnap.data().email || '',
        direccion: proveedorSnap.data().direccion || '',
        notas: proveedorSnap.data().notas || '',
        createdAt: proveedorSnap.data().createdAt?.toDate() || null
      };
    } else {
      throw new Error('Proveedor no encontrado');
    }
  } catch (error) {
    console.error("Error getting proveedor by ID:", error);
    throw error;
  }
};

// Actualizar un proveedor
export const updateProveedor = async (proveedorId, proveedorData) => {
  try {
    const proveedorRef = doc(db, 'proveedores', proveedorId);
    await updateDoc(proveedorRef, {
      ...proveedorData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating proveedor:", error);
    throw error;
  }
};


export const updateProductPrices = async ({ type, id, updateType, value }) => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);
    
    // Obtener productos del proveedor/familia
    const q = query(
      collection(db, 'productos'),
      where(type === 'proveedor' ? 'proveedorId' : 'familiaId', '==', id)
    );

    const snapshot = await getDocs(q);
    
    // Procesar cada producto
    snapshot.forEach((doc) => {
      const product = doc.data();
      const productRef = doc.ref;
      
      // Calcular nuevo precio compra
      let newCompra = product.precioCompra;
      if (updateType === 'percentage') {
        newCompra *= (1 + value / 100);
      } else {
        newCompra += value;
      }
      newCompra = parseFloat(newCompra.toFixed(2));
      
      // Calcular nuevo precio venta manteniendo el margen
      const margen = product.precioVenta - product.precioCompra;
      const newVenta = parseFloat((newCompra + margen).toFixed(2));
      
      // Preparar actualización
      batch.update(productRef, {
        precioCompra: newCompra,
        precioVenta: newVenta,
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    return { updated: snapshot.size };
  } catch (error) {
    console.error("Error updating prices:", error);
    throw new Error("No se pudieron actualizar los precios");
  }
};

export const updateStock = async (productId, quantityChange) => {
  try {
    const productRef = doc(db, 'productos', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Producto no encontrado');
    }

    const currentStock = productSnap.data().stock || 0;
    const newStock = currentStock - quantityChange; // Cambiado de "+" a "-"

    // Validación para evitar stock negativo
    if (newStock < 0) {
      throw new Error(`No hay suficiente stock para el producto ${productSnap.data().nombre}`);
    }

    await updateDoc(productRef, {
      stock: newStock,
      updatedAt: new Date()
    });

    return newStock;
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};