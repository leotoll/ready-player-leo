import {generateReport} from '@/utils';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/pdf');
  const pdfBytes = await generateReport();

  res.send(Buffer.from(pdfBytes));
}

export const config = {
  api: {
    bodyParser: false,
  },
};
