import {Cantata_One, Playfair_Display, Orbitron, Roboto} from 'next/font/google'

export const canta_one = Cantata_One({
    weight: '400',
    subsets: ['latin'],
})
export const playfair_display = Playfair_Display({
    subsets: ['latin'],
})
export const orbitron = Orbitron({
    subsets: ['latin'],
    weight: '600',
    display: 'swap',
})

export const roboto = Roboto({
    subsets: ['latin'],
})
