// middlewares/authMiddleware.js
const { db } = require('../config/firebaseConfig');

exports.checkRole = (role) => async (req, res, next) => {
  const { uid } = req.user; // Asume que el UID del usuario está en req.user
  const userRef = db.collection('usuarios').doc(uid);
  const userDoc = await userRef.get();

  if (userDoc.exists && userDoc.data().rol === role) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado' });
  }
};