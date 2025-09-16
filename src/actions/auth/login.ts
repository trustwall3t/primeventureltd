'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UserLoginSchema } from '../../../schema/UserSchema';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';




export const login = async (formData: z.infer<typeof UserLoginSchema>) => {
	const validatedFields = UserLoginSchema.safeParse({
		email: formData.email,
		password: formData.password,
	});
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const { email, password } = validatedFields.data;

	const user = await db.user.findUnique({ where: { email } });
	if (!user) {
		return { error: 'User not found' };
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return { error: 'Invalid credentials' };
	}
	if (!user.confirm) {
		return { error: 'Email not verified' };
	}
	const kyc = await db.kyc.findFirst({
		where: {
			userId: user.id,
		},
	});
	
	await createSession(user.id);

	const userData = {
		id: user.id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		address: user.address,
		country: user.country,
		AccountType: user.AccountType,
		isVerified: kyc?.status == 'approved' ? true : false,
		walletBalance: user.walletBalance,
		investmentBalance: user.investmentBalance,
		profitBalance: user.profitBalance,
		createdAt: user.createdAt,
		token: null,
		confirm: null,
		password: '', // Empty string as we don't want to expose the password
		isVerifying: kyc?.status === 'pending' ? true : false,
		kycStatus: kyc?.status,
		
	};

	return { success: true, user: userData };
};

export const logout = async () => {
	await deleteSession();
	redirect('/auth/login');
};

