import { model, Model, Schema } from 'mongoose';
import { IKatalogBuku } from '../interface/IKatalogBuku';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type KatalogBukuDocument = Document & IKatalogBuku;

// For model
interface IKategoriMakalahModel extends Model<KatalogBukuDocument> {}

// Create a Schema corresponding to the document interface.
const KatalogBukuSchema: Schema<KatalogBukuDocument> = new Schema({
  name: {
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
  updatedAt: {
    type: Date,
    default: null,
  },
});

const KatalogBuku = model<KatalogBukuDocument, IKategoriMakalahModel>(
  'KatalogBuku',
  KatalogBukuSchema
);
export default KatalogBuku;
