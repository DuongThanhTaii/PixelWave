"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("./lib/prisma");
async function main() {
    const username = 'duongthanhtai1308';
    const email = 'duongthanhtai1308@admin.pixelwave';
    const password = '13082005tai';
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: { username }
    });
    if (existingUser) {
        console.log(`User ${username} already exists. Ensuring they are ADMIN...`);
        await prisma_1.prisma.user.update({
            where: { id: existingUser.id },
            data: { role: client_1.Role.ADMIN }
        });
        console.log('Role updated to ADMIN.');
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    await prisma_1.prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
            displayName: 'Thành Tài',
            role: client_1.Role.ADMIN
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
    await prisma_1.prisma.$disconnect();
});
