"use client"

import Link from "next/link"

export function Footer() {
    return (
        <footer className="fixed  bottom-0 left-0 z-20 w-full p-4 border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600   ">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://qianniuspace.com/" className="hover:underline">qianniu</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <Link href="https://qianniuspace.com" className="hover:underline me-4 md:me-6">About</Link>
                </li>
                <li>
                    <Link href="https://github.com/qianniucity" className="hover:underline">Github</Link>
                </li>
            </ul>
        </footer>
    )
}
