import {
    PrismaClient,
    ScopeLevel
} from "@prisma/client";


const prisma = new PrismaClient();


/*
|--------------------------------------------------------------------------
| REQUIRE PERMISSION
|--------------------------------------------------------------------------
|
| Checks whether the user has the specified permission.
|
*/

export async function requirePermission(
    userId: string,
    permissionName: string
): Promise<void> {

    const user =
        await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });


    /*
    |--------------------------------------------------------------------------
    | User Not Found
    |--------------------------------------------------------------------------
    */

    if (!user) {
        throw new Error(
            "User not found."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN
    |--------------------------------------------------------------------------
    |
    | Super administrators have unrestricted access.
    |
    */

    if (user.role.name === "SUPER_ADMIN") {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Get User Permissions
    |--------------------------------------------------------------------------
    */

    const permissions =
        user.role.permissions.map(
            item => item.permission.name
        );


    /*
    |--------------------------------------------------------------------------
    | Check Permission
    |--------------------------------------------------------------------------
    */

    if (!permissions.includes(permissionName)) {
        throw new Error(
            `Permission denied: ${permissionName}`
        );
    }
}


/*
|--------------------------------------------------------------------------
| REQUIRE GEOGRAPHICAL SCOPE
|--------------------------------------------------------------------------
|
| Checks whether the authenticated user is authorized to access
| the requested geographical area.
|
*/

export async function requireScope(
    userId: string,
    level: ScopeLevel,
    scopeId: string
): Promise<void> {

    const user =
        await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                role: true
            }
        });


    /*
    |--------------------------------------------------------------------------
    | User Not Found
    |--------------------------------------------------------------------------
    */

    if (!user) {
        throw new Error(
            "User not found."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN
    |--------------------------------------------------------------------------
    |
    | Super administrators are not restricted by geographical scope.
    |
    */

    if (user.role.name === "SUPER_ADMIN") {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Find Authorized Scope
    |--------------------------------------------------------------------------
    */

    let scope = null;


    switch (level) {

        case ScopeLevel.COUNTY:

            scope =
                await prisma.userScope.findFirst({
                    where: {
                        userId,
                        level: ScopeLevel.COUNTY,
                        countyId: scopeId
                    }
                });

            break;


        case ScopeLevel.CONSTITUENCY:

            scope =
                await prisma.userScope.findFirst({
                    where: {
                        userId,
                        level: ScopeLevel.CONSTITUENCY,
                        constituencyId: scopeId
                    }
                });

            break;


        case ScopeLevel.WARD:

            scope =
                await prisma.userScope.findFirst({
                    where: {
                        userId,
                        level: ScopeLevel.WARD,
                        wardId: scopeId
                    }
                });

            break;


        case ScopeLevel.POLLING_STATION:

            scope =
                await prisma.userScope.findFirst({
                    where: {
                        userId,
                        level: ScopeLevel.POLLING_STATION,
                        pollingStationId: scopeId
                    }
                });

            break;


        default:

            throw new Error(
                "Invalid geographical scope."
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Authorization Failed
    |--------------------------------------------------------------------------
    */

    if (!scope) {
        throw new Error(
            "You are not authorized for this geographical area."
        );
    }
}