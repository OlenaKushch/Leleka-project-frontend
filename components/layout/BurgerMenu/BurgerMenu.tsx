'use client';

import { Drawer } from 'antd';
import { useUiStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './BurgerMenu.module.scss';
import { UserBar } from '@/components/layout/UserBar/UserBar';
import { AuthBar } from '@/components/layout/AuthBar/AuthBar';
import AppLogo from '@/components/auth/AppLogo';
import { NAV_ITEMS } from '@/components/layout/navigation';

export const BurgerMenu = () => {
    const { isBurgerMenuOpen, closeBurgerMenu } = useUiStore();
    const { user } = useAuthStore();
    const pathname = usePathname();

    return (
        <Drawer
            title={null}
            placement="left"
            onClose={closeBurgerMenu}
            open={isBurgerMenuOpen}
            styles={{ wrapper: { width: 335 } }}
            closeIcon={<span className={styles.closeIcon}>×</span>}
            className={styles.drawer}
        >
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/" className={styles.logo} onClick={closeBurgerMenu}>
                        <AppLogo className={styles.logoImg} />
                    </Link>
                    <button className={styles.closeButton} onClick={closeBurgerMenu} aria-label="Закрити меню">
                        ×
                    </button>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={user ? item.href : '/auth/login'}
                            className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
                            onClick={closeBurgerMenu}
                        >
                            <Image src={item.icon} alt={item.label} width={24} height={24} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    {user ? <UserBar /> : <AuthBar />}
                </div>
            </div>
        </Drawer>
    );
};
