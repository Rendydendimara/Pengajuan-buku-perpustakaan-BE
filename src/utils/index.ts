export const getProdiName = (prodiCode: string) => {
  switch (prodiCode) {
    case 'tif':
      return 'Teknik Informatika';
    case 'thp':
      return 'Teknologi Hasil Perikanan';
    case 'agt':
      return 'Agroteknologi';
    case 'ptk':
      return 'Peternakan';
    case 'agb':
      return 'Agribisnis';
    case 'hkm':
      return 'Hukum';
    case 'pbi':
      return 'Pendidikan Biologi';
    case 'man':
      return 'Manajemen';
    case 'ekm':
      return 'Ekonomi Pembangunan';
    case 'pmt':
      return 'Pendidikan Matematika';

    default:
      return '';
  }
};
