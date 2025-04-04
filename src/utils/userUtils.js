import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const updateUserRoleToAdmin = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Si el documento no existe, lo creamos con rol admin
      await setDoc(userRef, { role: "admin" });
      console.log("Documento creado y rol asignado como admin");
    } else {
      // Si ya existe, solo actualizamos el rol
      await updateDoc(userRef, { role: "admin" });
      console.log("Rol actualizado a admin");
    }
  } catch (error) {
    console.error("Error al actualizar rol:", error);
  }
};
