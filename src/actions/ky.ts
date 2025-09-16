'use server';

import { KycSchema } from '@/../../schema/KycShema';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

export async function createKyc(formData: FormData) {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	const user = await db.user.findUnique({
		where: {
			id: session.userId,
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	// Handle file upload
	const idImageFile = formData.get('idImage') as File;
	let imageUrl = '';

	if (idImageFile && idImageFile.size > 0) {
		try {
			imageUrl = await uploadToCloudinary(idImageFile);
		} catch (error) {
			
			return { error: 'Failed to upload image' + error?.toString() };
		}
	}

	const validatedFields = KycSchema.safeParse({
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		phone: formData.get('phone'),
		address: formData.get('address'),
		country: formData.get('country'),
		idNumber: formData.get('idNumber'),
		idType: formData.get('idType'),
		idImage: imageUrl, // Use the uploaded URL instead of the file
	});

	if (!validatedFields.success) {
		return { error: validatedFields.error.flatten().fieldErrors };
	}

	const {
		firstName,
		lastName,
		phone,
		address,
		country,
		idNumber,
		idType,
		idImage,
	} = validatedFields.data;
	const userKyc = await db.kyc.findFirst({
		where: {
			userId: user.id,
		},
	});
	if (userKyc) {
		return { error: 'KYC already exists, please wait for approval' };
	}
	const kyc = await db.kyc.create({
		data: {
			firstName,
			lastName,
			phone,
			address,
			country,
			idNumber,
			idType,
			idImage,
			status: 'pending',
			user: {
				connect: {
					id: user.id,
				},
			},
		},
	});

	if (!kyc) {
		return { error: 'Failed to create KYC' };
	}
	revalidatePath('/dashboard');

	return { success: 'KYC created successfully' };
}

export async function approveKyc(id: string) {
	const kyc = await db.kyc.findUnique({
		where: {
			id,
		},
	});
	if (!kyc) {
		return { error: 'KYC not found' };
	}
	await db.kyc.update({
		where: { id },
		data: { status: 'approved' },
	});
	await db.user.update({
		where: { id: kyc.userId },
		data: { isVerified: true },
	});
	revalidatePath('/admin/dashboard/kyc');
	return { success: 'KYC approved successfully' };

}

export async function rejectKyc(id: string) {
	const kyc = await db.kyc.findUnique({
		where: { id },
	});
	if (!kyc) {
		return { error: 'KYC not found' };
	}
	await db.kyc.update({
		where: { id },
		data: { status: 'rejected' },
	});
	await db.user.update({
		where: { id: kyc.userId },
		data: { isVerified: false },
	});
	revalidatePath('/admin/dashboard/kyc');
	return { success: 'KYC rejected successfully' };
}

export async function getKyc() {
	noStore();
	const kyc = await db.kyc.findMany({
		include: {
			user: true,
		},
	});
	return kyc;
}
