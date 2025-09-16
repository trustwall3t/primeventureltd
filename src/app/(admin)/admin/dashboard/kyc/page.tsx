import {
	Table,
	TableRow,
	TableHeader,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {  CheckIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { approveKyc, getKyc, rejectKyc } from '@/actions/ky';
import Image from 'next/image';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { revalidatePath } from 'next/cache';

async function handleApproveKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await approveKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

async function handleRejectKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await rejectKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

const Kyc = async () => {
	const kyc = await getKyc();
	return (
		<div>
			<h1 className='text-2xl font-bold mb-5 bg-gray-100/50 py-5 pl-5 '>
				Manage KYC
			</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>KYC Status</TableHead>
						<TableHead>ID Number</TableHead>
						<TableHead>ID Type</TableHead>
						<TableHead>Country</TableHead>
						<TableHead> File</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{kyc.map((kyc) => (
						<TableRow key={kyc.id}>
							<TableCell>
								{kyc.firstName} {kyc.lastName}
							</TableCell>
							<TableCell>{kyc.user.email}</TableCell>
							<TableCell>{kyc.user.phone}</TableCell>
							<TableCell>{kyc.status === 'pending' ? <PendingBadge /> : kyc.status === 'approved' ? <SuccessBadge /> : <CancelledBadge />}</TableCell>
							<TableCell>{kyc.idNumber}</TableCell>
							<TableCell>{kyc.idType}</TableCell>
							<TableCell>{kyc.country}</TableCell>
							<TableCell className=''>
								<Image
									src={kyc.idImage}
									alt='KYC'
									width={100}
									height={100}
									className='w-10 h-10 object-cover'
								/>
								<Link
									href={kyc.idImage}
									target='_blank'
									className='text-blue-500 text-sm'
								>
									View
								</Link>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
								<form action={handleApproveKyc}>
									<input
										type='hidden'
										name='kycId'
										value={kyc.id}
									/>
									<Button
										variant='outline'
										className='bg-green-500 text-white h-7 w-12 text-sm '
										type='submit'
									>
										<CheckIcon className='w-4 h-4' />
									</Button>
								</form>
								<form action={handleRejectKyc}>
									<input
										type='hidden'
										name='kycId'
										value={kyc.id}
									/>
								<Button
									variant='outline'
									className='bg-red-500 text-white h-7 w-12 text-sm '
									type='submit'
								>
											<XIcon className='w-4 h-4' />
										</Button>
									</form>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default Kyc;
