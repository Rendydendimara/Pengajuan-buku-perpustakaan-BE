export interface IBukuRekapan {
  judulBuku: string;
  penulis: string;
  penerbit: string;
  tahunBuku: string;
  diBuat: string;
}

export interface IDataRekapan {
  hkm: IBukuRekapan[];
  pbi: IBukuRekapan[];
  man: IBukuRekapan[];
  ekm: IBukuRekapan[];
  pmt: IBukuRekapan[];
  ptk: IBukuRekapan[];
  agt: IBukuRekapan[];
  agb: IBukuRekapan[];
  thp: IBukuRekapan[];
  tif: IBukuRekapan[];
}
