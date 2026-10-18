import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rewind } from 'lucide-react';
import { useT } from '../store/AppContext';
import { Blobs, Page } from '../components/ui';

export default function NotFound({ inApp = false }: { inApp?: boolean }) {
  const { tx } = useT();
  return (
    <Page className={inApp ? 'grid place-items-center py-16' : 'relative grid min-h-screen place-items-center overflow-hidden px-4'}>
      {!inApp && <Blobs />}
      <div className="text-center">
        <motion.p className="text-8xl font-extrabold text-gradient" animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          404?
        </motion.p>
        <h1 className="mt-4 text-2xl font-extrabold">{tx('Bu sahifaning ildizi topilmadi', 'Корень этой страницы не найден', "We couldn't find this page's root")}</h1>
        <p className="mt-2 text-muted">{tx('Keling, boshiga qaytamiz.', 'Давайте вернёмся в начало.', "Let's go back to the start.")}</p>
        <Link to={inApp ? '/app' : '/'} className="btn-primary mt-6">
          <Rewind className="h-4 w-4" /> {tx('Bosh sahifa', 'На главную', 'Home')}
        </Link>
      </div>
    </Page>
  );
}
