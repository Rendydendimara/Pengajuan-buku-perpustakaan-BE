import bcrypt from 'bcrypt';
import { model, Model, Schema } from 'mongoose';
import { IDosenProdi } from '../interface/IDosenProdi';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type DosenProdiDocument = Document & IDosenProdi;

// For model
interface IDosenProdiModel extends Model<DosenProdiDocument> {
  findByUsername: (username: string) => Promise<DosenProdiDocument>;
  findByEmail: (email: string) => Promise<DosenProdiDocument>;
}

// Create a Schema corresponding to the document interface.
const DosenProdiSchema: Schema<DosenProdiDocument> = new Schema({
  nidn: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  kelamin: {
    type: String,
    required: true,
  },
  namaLengkap: {
    type: String,
    required: true,
  },
  noTelfon: {
    type: String,
  },
  programStudi: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },

  isSuspend: {
    type: Boolean,
    default: false,
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

// Methods
DosenProdiSchema.methods.isValidPassword = async function (
  this: DosenProdiDocument,
  password: string
): Promise<boolean> {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

// Hide password field
DosenProdiSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    return ret;
  },
});

const DosenProdi = model<DosenProdiDocument, IDosenProdiModel>(
  'DosenProdi',
  DosenProdiSchema
);
export default DosenProdi;
