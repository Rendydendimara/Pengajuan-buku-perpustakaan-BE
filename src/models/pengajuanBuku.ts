import { model, Model, Schema } from 'mongoose';
import { IPengajuanBuku } from '../interface/IPengajuanBuku';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type PengajuanBukuDocument = Document & IPengajuanBuku;

// For model
interface IPengajuanBukuModel extends Model<PengajuanBukuDocument> { }

// Create a Schema corresponding to the document interface.
const PengajuanBukuSchema: Schema<PengajuanBukuDocument> = new Schema({
  pesanAdmin: {
    type: String,
  },
  pesanDosen: {
    type: String,
  },
  buku: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Buku',
        required: true,
      },
      jumlah: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: 'diproses',
      },
    },
  ],
  status: {
    type: String,
    required: true,
    default: 'diproses',
  },
  bukuLink: [
    {
      jumlah: {
        type: Number,
        required: true,
      },
      linkBuku: {
        type: String,
        default: null,
      },
    },
  ],
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
