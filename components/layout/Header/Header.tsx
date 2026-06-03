'use client';



import Link from 'next/link';
import styles from './Header.module.scss';
import AppLogo from '@/components/auth/AppLogo';
import { MenuOutlined } from '@ant-design/icons';
import { useUiStore } from '@/store/ui.store';
import { usePathname } from 'next/navigation';

export const Header = () => {
    const { openBurgerMenu } = useUiStore();
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith('/auth');
    if (isAuthPage) return null;

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.header__logo} aria-label="Мій день">
                <AppLogo className={styles.header__logo_img} />
            </Link>

            <button className={styles.header__burger} onClick={openBurgerMenu} aria-label="Відкрити меню">
                <MenuOutlined />
            </button>
        </header>
    );
};
