import fs from 'fs';
import PDFDocument from 'pdfkit';
import moment from 'moment';
import { IBukuRekapan, IDataRekapan } from '../interface';
import { getProdiName } from '../utils';

function createRekapan(data: IDataRekapan, path: any) {
  console.log('data', data);
  let doc = new PDFDocument({ size: 'A4', margin: 50 });

  generateHeader(doc);
  // generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, data.tif, 'tif');
  generateInvoiceTable(doc, data.agb, 'agb');
  generateInvoiceTable(doc, data.agt, 'agt');
  generateInvoiceTable(doc, data.ekm, 'ekm');
  generateInvoiceTable(doc, data.hkm, 'hkm');
  generateInvoiceTable(doc, data.man, 'man');
  generateInvoiceTable(doc, data.pbi, 'pbi');
  generateInvoiceTable(doc, data.pmt, 'pmt');
  generateInvoiceTable(doc, data.ptk, 'ptk');
  generateInvoiceTable(doc, data.thp, 'thp');
  generateFooter(doc);
  // generateFooterUpdatedAt(doc, invoice);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc: any) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Rekapan Pengajuan')
    .text('Buku Perpustakaan')
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
  console.log('data', data);
  for (i = 0; i < data.length; i++) {
    // const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, {
      judulBuku: data[i]?.judulBuku,
      penulis: data[i]?.penulis,
      penerbit: data[i]?.penerbit,
      tahunBuku: data[i]?.tahunBuku,
      diBuat: moment(data[i]?.diBuat).format('L'),
    });
    generateHr(doc, doc.y + 20);
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
  }
) {
  let yPos = doc.y;

  doc
    .fontSize(8)
    .text(data.judulBuku, 50, yPos)
    .text(data.penulis, 200, yPos)
    .text(data.penerbit, 250, yPos)
    .text(data.tahunBuku, 350, yPos)
    .text(
      data.diBuat === 'Dibuat' ? 'Dibuat' : moment(data.diBuat).format('L'),
      400,
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
