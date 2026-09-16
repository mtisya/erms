import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";


export function requirePermission(
    permissionName: string
) {


    return async (
        req: any,
        res: Response,
        next: NextFunction
    ) => {


        try {


            const userId = req.user?.userId;


            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message: "Unauthorized"

                });

            }



            const user = await prisma.user.findUnique({

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



            if (!user) {

                return res.status(401).json({

                    success: false,

                    message: "User not found"

                });

            }



            const permissions =
                user.role.permissions.map(
                    item => item.permission.name
                );



            if (
                !permissions.includes(permissionName)
            ) {


                return res.status(403).json({

                    success:false,

                    message:"Permission denied"

                });

            }



            next();



        } catch(error) {


            console.error(error);


            return res.status(500).json({

                success:false,

                message:"Authorization error"

            });


        }


    };


}