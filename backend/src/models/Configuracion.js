import mongoose from 'mongoose';

const configuracionSchema = new mongoose.Schema(
  {
    clave: { type: String, default: 'global', unique: true },
    whatsappNumero: { type: String, default: '' }, // solo dígitos, ej: 5493624031997
    whatsappMensajeBase: { type: String, default: 'Hola Hermanos Jota, quiero pagar:' }
  },
  { timestamps: true }
);

export default mongoose.model('Configuracion', configuracionSchema);