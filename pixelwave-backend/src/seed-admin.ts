import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

async function main() {
  const username = 'duongthanhtai1308';
  const email = 'duongthanhtai1308@admin.pixelwave';
  const password = '13082005tai';

  const existingUser = await prisma.user.findFirst({
    where: { username }
  });

  if (existingUser) {
    console.log(`User ${username} already exists. Ensuring they are ADMIN...`);
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: Role.ADMIN }
    });
    console.log('Role updated to ADMIN.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      displayName: 'Thành Tài',
      role: Role.ADMIN
    }
  });

  console.log(`Successfully created admin user: ${username}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
