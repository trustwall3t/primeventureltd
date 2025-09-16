
import Link from "next/link";
import Tradeview1 from "../_components/TradingView/Tradeview1";
import TradingView2 from "../_components/TradingView/TradingView2";
import { Button } from "@/components/ui/button"
const LiveTrading =  () => {

    return (
		<>
			<div className={`fixed top-0 left-0 z-50 flex flex-col items-center justify-center h-screen w-screen bg-black/80 `}>
				<div className='flex flex-col items-center justify-center gap-4 max-w-md bg-black p-4 rounded-md'>
					<h2 className='text-2xl font-bold'>watch live trading</h2>
					<p className='text-sm text-white text-center'>
						You are not eligible to view livestream
						of ongoing trades.
					</p>
					<div className='flex w-full items-center justify-center gap-10'>
						<Link href='/dashboard/deposit'>
                            <Button className='bg-green-500 hover:bg-green-600 text-white'>
                                Upgrade
                            </Button>
                        </Link>
                        <Link href='/dashboard'>
                            <Button variant='outline' className="bg-red-500 hover:bg-red-600 border-none text-white">Cancel</Button>
                        </Link>
					</div>
				</div>
			</div>
			<div className='w-full h-[500px]'>
				<Tradeview1 />
			</div>
			<div className='w-full h-[500px]'>
				<TradingView2 />
			</div>
		</>
	);
}

export default LiveTrading;