import {useState} from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const REPORT_API = '/api/report';
const REPORT_NAME = 'Report.pdf';

export default function Home() {
  const [loading, setLoading] = useState(false);

  console.log('loading', loading);
  const handlePdf = async () => {
    setLoading(true);

    try {
      const response = await fetch(REPORT_API);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = REPORT_NAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ready Player Leo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Button
          loading={loading}
          onClick={handlePdf}
          className={styles.button}
          disabled={loading}
          variant="contained"
          color="error">
          {loading ? <CircularProgress /> : 'Lonely Pdf Button'}
        </Button>
      </main>
    </>
  );
}
