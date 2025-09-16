import React from 'react';
import KycForm from '../_components/forms/KycForm';
import { getSession } from '@/lib/session';
import { CheckCircleIcon } from 'lucide-react';

const page = async () => {
	const session = await getSession();

	return (
		<div>
			{session?.user.isVerified ? (
				<div className=' w-full h-full rounded-md p-5 md:p-6  mb-4 space-y-4 flex justify-center items-center'>
					<div className='bg-blue-500/20 text-green-500 space-y-2 w-md py-20 flex flex-col items-center justify-center'>
						<CheckCircleIcon className='w-10 h-10 text-white' />
						<p className='text-sm font-medium'>
							Your KYC has been approved
						</p>
					</div>
				</div>
			) : (
				<>
					<h1 className='text-2xl font-bold'>KYC</h1>
					<p className=' text-gray-300'>
						Please fill in the form below to complete your KYC.
					</p>
					<KycForm />
				</>
			)}
		</div>
	);
};

export default page;
