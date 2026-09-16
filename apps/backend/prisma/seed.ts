import { PrismaClient, Permission } from "@prisma/client";


import bcrypt from "bcrypt";


const prisma = new PrismaClient();


async function main() {

    console.log("Starting database seed...");


    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    */

    const permissions = [

        // User Management
        "USER_VIEW",
        "USER_CREATE",
        "USER_UPDATE",
        "USER_DELETE",


        // Elections
        "ELECTION_VIEW",
        "ELECTION_CREATE",
        "ELECTION_UPDATE",
        "ELECTION_DELETE",


        // Geography
        "COUNTY_VIEW",
        "COUNTY_CREATE",
        "COUNTY_UPDATE",
        "COUNTY_DELETE",

        "CONSTITUENCY_VIEW",
        "CONSTITUENCY_CREATE",
        "CONSTITUENCY_UPDATE",
        "CONSTITUENCY_DELETE",

        "WARD_VIEW",
        "WARD_CREATE",
        "WARD_UPDATE",
        "WARD_DELETE",
        
        "POLLING_STATION_VIEW",
        "POLLING_STATION_CREATE",
        "POLLING_STATION_UPDATE",
        "POLLING_STATION_DELETE",


        // Results
        "RESULT_ENTER",
        "RESULT_EDIT",
        "RESULT_APPROVE",
        "RESULT_VIEW",

        "AUDIT_VIEW",
        
        // Reports
        "REPORT_VIEW"

    ];



const permissionRecords: Record<string, Permission> = {};

for (const permission of permissions) {

    const record =
        await prisma.permission.upsert({

            where: {
                name: permission
            },

            update: {},

            create: {

                name: permission,

                description:
                    permission
                    .replaceAll("_", " ")
                    .toLowerCase()

            }

        });


    permissionRecords[permission] = record;

}



    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    */

    const roles = [

        "SUPER_ADMIN",

        "NATIONAL_ADMIN",

        "COUNTY_ADMIN",

        "CONSTITUENCY_ADMIN",

        "RETURNING_OFFICER",

        "PRESIDING_OFFICER",

        "VIEWER"

    ];



    for (const roleName of roles) {


        await prisma.role.upsert({

            where:{
                name:roleName
            },

            update:{},

            create:{
                name:roleName,
                description:`${roleName} role`
            }

        });


    }



    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN Permissions
    |--------------------------------------------------------------------------
    */


    const superAdminRole =
        await prisma.role.findUnique({

            where:{
                name:"SUPER_ADMIN"
            }

        });



    if(!superAdminRole){

        throw new Error(
            "SUPER_ADMIN role not found"
        );

    }



    for(
        const permission of Object.values(permissionRecords)
    ){


        await prisma.rolePermission.upsert({

            where:{

                roleId_permissionId:{

                    roleId:superAdminRole.id,

                    permissionId:permission.id

                }

            },

            update:{},

            create:{

                roleId:superAdminRole.id,

                permissionId:permission.id

            }

        });


    }



    /*
    |--------------------------------------------------------------------------
    | Default Admin User
    |--------------------------------------------------------------------------
    */


    const password =
        await bcrypt.hash(
            "Admin@123",
            10
        );



    await prisma.user.upsert({

        where:{

            email:"admin@erms.com"

        },


        update:{


            roleId:superAdminRole.id

        },


        create:{


            firstName:"System",

            lastName:"Administrator",

            email:"admin@erms.com",

            password,

            roleId:superAdminRole.id

        }

    });



    console.log(
        "Seed completed successfully"
    );


}



main()

.catch((error)=>{

    console.error(error);

    process.exit(1);

})

.finally(async()=>{

    await prisma.$disconnect();

});