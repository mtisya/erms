import prisma from "../config/prisma";

async function main() {

    const roles = await prisma.role.findMany();

    console.log("Database connection successful");

    console.log(roles);

}


main()
.catch((error) => {

    console.error(error);

})
.finally(async () => {

    await prisma.$disconnect();

});