import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import ChatwootWidget from '@/components/chatwootWidget';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Prime Ventures Ltd - Welcome | Regulated Broker in Copy Trading, Trade with Zero Spreads',
	description: 'Prim Ventures Ltd is a regulated broker in copy trading, trade with zero spreads',
	authors: [{ name: 'Prim Ventures Ltd' }],
	openGraph: {
		title: 'Prime Ventures Ltd - Welcome | Regulated Broker in Copy Trading, Trade with Zero Spreads',
		description: 'Prime Ventures Ltd is a regulated broker in copy trading, trade with zero spreads',
		images: ['/logo.png'],
	},
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	
	return (
		<html lang='en'>
		
			<body className={inter.className}>
				{children}
				<Toaster />
				<ChatwootWidget />
			</body>
		</html>
	);
}
