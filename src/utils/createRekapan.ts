import fs from 'fs';
import PDFDocument from 'pdfkit';
import moment from 'moment';
import { IBukuRekapan, IDataRekapan } from '../interface';
import { getProdiName } from '../utils';

function createRekapan(dataMultiple: IDataRekapan, dataSingle: IBukuRekapan[], path: any, type: "single" | "multiple", prodi: any) {
  let doc = new PDFDocument({ size: 'A1', margin: 50 });

  generateHeader(doc);
  // generateCustomerInformation(doc, invoice);
  if (type === 'multiple') {
    generateInvoiceTable(doc, dataMultiple.tif, 'tif');
    generateInvoiceTable(doc, dataMultiple.agb, 'agb');
    generateInvoiceTable(doc, dataMultiple.agt, 'agt');
    generateInvoiceTable(doc, dataMultiple.ekm, 'ekm');
    generateInvoiceTable(doc, dataMultiple.hkm, 'hkm');
    generateInvoiceTable(doc, dataMultiple.man, 'man');
    generateInvoiceTable(doc, dataMultiple.pbi, 'pbi');
    generateInvoiceTable(doc, dataMultiple.pmt, 'pmt');
    generateInvoiceTable(doc, dataMultiple.ptk, 'ptk');
    generateInvoiceTable(doc, dataMultiple.thp, 'thp');
  } else {
    generateInvoiceTable(doc, dataSingle, prodi);

  }
  generateFooter(doc);
  // generateFooterUpdatedAt(doc, invoice);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc: any) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Rekapan Pengajuan Buku Perpustakaan')
    .fontSize(10)
    .text('Universitas Kristen Wira Wacana Sumba.', { align: 'right' })
    .text('Fakultas sains dan teknologi', { align: 'right' })
    .text('Jl. R. Suprapto No.35, Prailiu', { align: 'right' })
    .text('Waingapu, Kabupaten Sumba Timur, Nusa Tenggara Timur', {
      align: 'right',
    });
}

function generateInvoiceTable(
  doc: any,
  data: IBukuRekapan[],
  prodiTitle: string
) {
  let i;
  // const invoiceTableTop = 330;
  doc
    .fillColor('#444444')
    .fontSize(13)
    .text(getProdiName(prodiTitle), 50, doc.y + 50);
  doc.font('Helvetica-Bold');
  // generateBr(doc, 20);
  // generateBr(doc, 100);
  generateTableRow(doc, {
    judulBuku: 'Judul Buku',
    penulis: 'Penulis',
    penerbit: 'Penerbit',
    tahunBuku: 'Tahun Buku',
    diBuat: 'Dibuat',
  });
  // doc.table(
  //   [
  //     ['cell11'],
  //     ['cell21'],
  //     ['cell31'],
  //     ['cell12'],
  //     ['cell22'],
  //     ['cell32'],
  //     ['cell13'],
  //     ['cell23'],
  //     ['cell33'],
  //   ],
  //   {
  //     width: 20,
  //     height: 40,
  //     x: 30,
  //     y: 40,
  //   }
  // );
  // generateTableRow(doc, invoiceTableTop, {
  //   judulBuku: 'Judul Buku',
  //   penulis: 'Penulis',
  //   penerbit: 'Penerbit',
  //   tahunBuku: 'Tahun Buku',
  //   diBuat: 'Dibuat',
  // });
  doc.font('Helvetica');
  for (i = 0; i < data.length; i++) {
    // const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, {
      judulBuku: data[i]?.judulBuku,
      penulis: data[i]?.penulis,
      penerbit: data[i]?.penerbit,
      tahunBuku: data[i]?.tahunBuku,
      diBuat: moment(data[i]?.diBuat).format('L'),
      isGenerateData: true
    });
  }
}

function generateFooter(doc: any) {
  doc
    .fontSize(10)
    .text(
      `Dibuat Pada ${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
      0,
      doc.y + 300,
      { align: 'center' }
    );
}

function generateTableRow(
  doc: any,
  // y: any,
  data: {
    judulBuku: any;
    penulis: any;
    penerbit: any;
    tahunBuku: any;
    diBuat: any;
    isGenerateData?: boolean
  }
) {
  let yPos = doc.y;

  doc
    .fontSize(8)
    .text(data.judulBuku, 50, yPos)
    .text(data.penulis, 900, yPos)
    .text(data.penerbit, 1200, yPos)
    .text(data.tahunBuku, 1400, yPos)
    .text(
      data.diBuat === 'Dibuat' ? 'Dibuat' : moment(data.diBuat).format('L'),
      1500,
      yPos
    );

  // docz
  //   .fontSize(10)
  //   .text(data.judulBuku)
  //   .text(data.penulis, { width: 90, align: 'right' })
  //   .text(data.penerbit, { width: 90, align: 'right' })
  //   .text(moment(data.diBuat).format('L'), { align: 'right' });
}

function generateHr(doc: any, y: any) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateBr(doc: any, y: any) {
  doc.strokeColor('#aaaaaa').lineWidth(0).moveTo(50, y).lineTo(550, y).stroke();
}

export default createRekapan;
