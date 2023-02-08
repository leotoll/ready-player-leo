import {rgb, PDFDocument} from 'pdf-lib';
import {toVolume, toPercent, toPrice} from './format';

const STARTING_PADDING = 50;
const TABLE_HEADERS = ['Name', 'Price', 'Volume(24h)', '24h %'];
const PDF_TITLE = 'Crypto stats';
const CRYPTO_DATA_API_URL = 'https://cryptingup.com/api/assets?size=20';

export const generateReport = async () => {
  const response = await fetch(CRYPTO_DATA_API_URL);
  const {assets} = await response.json();
  assets.sort((a, b) => b.change_24h - a.change_24h);

  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();
  const page = pdfDoc.addPage();
  const {height, width} = page.getSize();
  const colWidth = width / (TABLE_HEADERS.length + 1);

  page.drawText(PDF_TITLE, {
    x: width / 3,
    y: height - 100,
    size: 30,
    color: rgb(1, 0, 0),
  });

  TABLE_HEADERS.forEach((column, index) => {
    const field = form.createTextField(column);
    field.setText(column);
    field.addToPage(page, {
      x: STARTING_PADDING + index * colWidth,
      y: height - 150,
      height: 20,
      size: 20,
      width: colWidth,
    });
  });

  assets.forEach((asset, outerIndex) => {
    const {asset_id, price, volume_24h, change_24h} = asset;

    [
      {value: asset_id},
      {value: toPrice(price)},
      {value: toVolume(volume_24h)},
      {value: toPercent(change_24h)},
    ].forEach(({value}, index) => {
      const field = form.createTextField(`${asset_id}-${value}`);
      field.setText(value);
      field.addToPage(page, {
        x: STARTING_PADDING + index * colWidth,
        y: height - 170 - outerIndex * 20,
        height: 20,
        size: 20,
        width: colWidth,
      });
    });
  });

  return await pdfDoc.save();
};
