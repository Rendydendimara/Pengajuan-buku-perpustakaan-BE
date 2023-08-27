import bcrypt from 'bcrypt';
import { model, Model, Schema } from 'mongoose';
import { IAdmin } from '../interface/IAdmin';

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
export type AdminDocument = Document & IAdmin;

// For model
interface IAdminModel extends Model<AdminDocument> {
  findByUsername: (username: string) => Promise<AdminDocument>;
  findByEmail: (email: string) => Promise<AdminDocument>;
}

// Create a Schema corresponding to the document interface.
const AdminSchema: Schema<AdminDocument> = new Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    default: null,
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
AdminSchema.methods.isValidPassword = async function (
  this: AdminDocument,
  password: string
): Promise<boolean> {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

// Hide password field
AdminSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    return ret;
  },
});

const Admin = model<AdminDocument, IAdminModel>('Admin', AdminSchema);
export default Admin;
