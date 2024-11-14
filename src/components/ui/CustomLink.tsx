"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const CustomLink = ({ href, children, className }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleClick = (e) => {
        e.preventDefault();
        startTransition(() => {
            router.push(href); // use `useRouter` for navigation
        });
    };

    return (
        <Link className={className} href={href} onClick={handleClick}>
            {children}
        </Link>
    );
};

export default CustomLink;