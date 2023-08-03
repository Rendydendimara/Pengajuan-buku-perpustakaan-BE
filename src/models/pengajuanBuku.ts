import { model, Model, Schema } from 'mongoose';
import { IPengajuanBuku } from '../interface/IPengajuanBuku';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type PengajuanBukuDocument = Document & IPengajuanBuku;

// For model
interface IPengajuanBukuModel extends Model<PengajuanBukuDocument> {}

// Create a Schema corresponding to the document interface.
const PengajuanBukuSchema: Schema<PengajuanBukuDocument> = new Schema({
  pesanAdmin: {
    type: String,
  },
  pesanDosen: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'diproses',
  },
  buku: {
    type: Schema.Types.ObjectId,
    ref: 'Buku',
    required: true,
  },
  dosenProdi: {
    type: Schema.Types.ObjectId,
    ref: 'DosenProdi',
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

const PengajuanBuku = model<PengajuanBukuDocument, IPengajuanBukuModel>(
  'PengajuanBuku',
  PengajuanBukuSchema
);
export default PengajuanBuku;
