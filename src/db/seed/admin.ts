import Admin from '../../models/admin';
import { hashingPassword } from '../../service/password';

export const createAdminSeeds = async () => {
  try {
    const adminPayload = {
      nidn: '12345',
      password: 'Password',
      kelamin: 'P',
      namaLengkap: 'Admin',
      noTelfon: '08223455667',
      email: 'admin@gmail.com',
    };
    const hashPass: any = await hashingPassword(adminPayload.password);
    adminPayload.password = hashPass;
    await Admin.create(adminPayload);
    console.log('success create admin');
  } catch (err) {
    console.log('err', err);
  }
};
