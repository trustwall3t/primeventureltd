'use client';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Form,
	FormDescription,
} from '@/components/ui/form';
import { BalanceSchema } from '../../../../../schema/balanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransition } from 'react';
import { updateUserBalance } from '../../../../actions/admin/updateUserBalance';
import { useEffect } from 'react';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	profitBalance: number | null;
	investmentBalance: number | null;
	targetBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
};

const BalanceForm = ({ user }: { user: UserData | null }) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof BalanceSchema>>({
		resolver: zodResolver(BalanceSchema),
		defaultValues: {
			balance: '',
			profit: '',
			investment: '',
			target: '',
			credit: true,
			userId: user?.id || '',
		},
	});

	// Update userId when user changes
	useEffect(() => {
		if (user?.id) {
			form.setValue('userId', user.id);
		}
	}, [user?.id, form]);

	const onSubmit = async (data: z.infer<typeof BalanceSchema>) => {
		if (!user?.id) {
			toast.error('No user selected', {
				position: 'top-right',
			});
			return;
		}

		// Validate that at least one field has a value
		if (!data.balance && !data.profit && !data.investment && !data.target) {
			toast.error('Please enter at least one value to update', {
				position: 'top-right',
			});
			return;
		}

		startTransition(async () => {
			try {
				const res = await updateUserBalance({
					...data,
					userId: user.id,
				});
				if (res.success) {
					toast.success('Balance updated successfully', {
						position: 'top-right',
					});
					form.reset({
						balance: '',
						profit: '',
						investment: '',
						target: '',
						credit: true,
						userId: user.id,
					});
				} else {
					toast.error(res.error || 'Failed to update balance', {
						position: 'top-right',
					});
				}
			} catch (err) {
				console.error('Form submission error:', err);
				toast.error('An unexpected error occurred', {
					position: 'top-right',
				});
			}
		});
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4 w-full  mx-auto mt-10'
			>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='flex  md:flex-col items-center gap-2 justify-between  bg-gray-500 px-4 py-2 rounded-lg'>
						<h2 className='text-white '> Balance</h2>
						<p className='text-white font-bold'>
							${user?.walletBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex  md:flex-col items-center gap-2 justify-between  bg-gray-500 px-4 py-2 rounded-lg'>
						<h2 className='text-white '>Profit </h2>
						<p className='text-white font-bold'>
							${user?.profitBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex  md:flex-col items-center gap-2 justify-between  bg-gray-500 px-4 py-2 rounded-lg'>
						<h2 className='text-white '>Investment </h2>
						<p className='text-white font-bold'>
							${user?.investmentBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex  md:flex-col items-center gap-2 justify-between  bg-gray-500 px-4 py-2 rounded-lg'>
						<h2 className='text-white '>Target </h2>
						<p className='text-white font-bold'>
							${user?.targetBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
				</div>
				{isPending && <Loader />}
				<FormField
					control={form.control}
					name='credit'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Credit</FormLabel>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>
								This will add a credit to the balance if
								checked.
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='balance'
					render={({ field }) => (
						<FormItem>
							<FormLabel> Account Balance</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='0.00'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='profit'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profit Balance</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='0.00'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='target'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Target Balance</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='0.00'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='investment'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Investment Balance</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='0.00'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					disabled={isPending}
					className='w-full'
				>
					{isPending ? 'Updating...' : 'Update'}
				</Button>
			</form>
		</Form>
	);
};

export default BalanceForm;
