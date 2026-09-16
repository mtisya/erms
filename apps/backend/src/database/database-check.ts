import prisma from "../config/prisma";

async function main() {
    try {
        const roles = await prisma.role.findMany();

        console.log("Database connection successful");
        console.log(roles);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}


main()
.catch((error) => {

    console.error(error);

})
.finally(async () => {

    await prisma.$disconnect();

});