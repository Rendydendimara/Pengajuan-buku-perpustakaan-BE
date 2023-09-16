import { model, Model, Schema } from 'mongoose';
import { IBuku } from '../interface/IBuku';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type BukuDocument = Document & IBuku;

// For model
interface IBukuModel extends Model<BukuDocument> {}

// Create a Schema corresponding to the document interface.
const BukuSchema: Schema<BukuDocument> = new Schema({
  judul: {
    type: String,
    required: true,
    unique: true,
  },
  penulis: {
    type: String,
    required: true,
  },
  tahunTerbit: {
    type: String,
    required: true,
  },
  bahasa: {
    type: String,
    required: true,
  },
  harga: {
    type: Number,
  },
  katalog: {
    type: Schema.Types.ObjectId,
    ref: 'KatalogBuku',
    required: true,
  },
  prodi: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  tanggalUpload: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const Buku = model<BukuDocument, IBukuModel>('Buku', BukuSchema);
export default Buku;
