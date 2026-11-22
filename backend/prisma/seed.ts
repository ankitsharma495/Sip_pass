import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding cities...');

  const blr = await prisma.city.upsert({
    where: { slug: 'bengaluru' },
    update: {},
    create: {
      id: 'city-blr-01',
      name: 'Bengaluru',
      slug: 'bengaluru',
      state: 'Karnataka',
      country: 'IN',
      latitude: 12.9716,
      longitude: 77.5946,
      isActive: true,
    },
  });

  const bom = await prisma.city.upsert({
    where: { slug: 'mumbai' },
    update: {},
    create: {
      id: 'city-bom-02',
      name: 'Mumbai',
      slug: 'mumbai',
      state: 'Maharashtra',
      country: 'IN',
      latitude: 19.076,
      longitude: 72.8777,
      isActive: true,
    },
  });

  const del = await prisma.city.upsert({
    where: { slug: 'delhi-ncr' },
    update: {},
    create: {
      id: 'city-del-03',
      name: 'Delhi NCR',
      slug: 'delhi-ncr',
      state: 'Delhi',
      country: 'IN',
      latitude: 28.6139,
      longitude: 77.209,
      isActive: true,
    },
  });

  console.log(`Seeded cities: ${blr.name}, ${bom.name}, ${del.name}`);

  // Seed default demo user Aarav Mehta
  const demoUser = await prisma.user.upsert({
    where: { phone: '+919820451290' },
    update: {},
    create: {
      phone: '+919820451290',
      fullName: 'Aarav Mehta',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida/ALJJyrAub6XVPs9AqO-Phn9pcCTO3fxgJnjVu55f5LbzOm7zge1uRfVMMQuqH-wHZc2fOc9bynKYyn22McZ9Hlz-8X236ng24b2nIxfMbArNRuH8HdN37lUumsH3iKHCVR6PIKiL5O2aRMbFQnxryqhfi5MWUqbSa5-6QoVnC7aItsWCrFKhNkP6XjF1oW5DPmJF7OZBBY7LfMbk59xu9vfZ4sVmeeciaqqNIDRPGRKfChMOFxnVKEaKC0uZA_bsWwzvnArc',
      cityId: blr.id,
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  });

  console.log(`Seeded demo user: ${demoUser.fullName} (${demoUser.phone})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
