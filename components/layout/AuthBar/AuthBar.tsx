'use client';

import Link from 'next/link';
import styles from './AuthBar.module.scss';

export const AuthBar = () => {
    return (
        <div className={styles.authBar}>
            <Link href="/auth/login" className={styles.link}>
                Увійти
            </Link>
            <Link href="/auth/register" className={`${styles.link} ${styles.linkRegister}`}>
                Зареєструватися
            </Link>
        </div>
    );
};
