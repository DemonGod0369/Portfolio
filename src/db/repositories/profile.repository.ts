import { prisma } from '../connection.ts';
import { formatRow } from './common.ts';

export async function getProfile() {
  const row = await prisma.profile.findFirst();
  return row ? formatRow(row) : null;
}

export async function updateProfile(data: any) {
  try {
    const existing = await prisma.profile.findFirst();
    if (!existing) {
      const created = await prisma.profile.create({
        data: {
          name: data.name || '',
          headline: data.headline ?? null,
          shortBio: data.shortBio ?? null,
          longBio: data.longBio ?? null,
          profileImageUrl: data.profileImageUrl ?? null,
          visitingCardImageUrl: data.visitingCardImageUrl ?? null,
          dateOfBirth: data.dateOfBirth ?? null,
          address: data.address ?? null,
          email: data.email ?? null,
          alternateEmail: data.alternateEmail ?? null,
          primaryEmailLabel: data.primaryEmailLabel ?? null,
          alternateEmailLabel: data.alternateEmailLabel ?? null,
          phone: data.phone ?? null,
          secondaryPhone: data.secondaryPhone ?? null,
          phoneDisplayOption: data.phoneDisplayOption ?? null,
          whatsappNumber: data.whatsappNumber ?? null,
          location: data.location ?? null,
          website: data.website ?? null,
          availabilityStatus: data.availabilityStatus ?? null,
          availabilityCustomNote: data.availabilityCustomNote ?? null,
          timezone: data.timezone ?? null,
          responseTime: data.responseTime ?? null,
          languagesSpoken: data.languagesSpoken || [],
        },
      });
      return formatRow(created);
    }

    const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: updateData,
    });
    return formatRow(updated);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw new Error('Failed to update profile in database.', { cause: error });
  }
}
