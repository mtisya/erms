import { Prisma, PrismaClient } from "@prisma/client";
import { getRequestContext } from "../common/context/request.context";


const auditPrisma = new PrismaClient({
    log: [
        "error",
        "warn"
    ]
});



function sanitizeData(
    data: any
){

    if (!data) {
        return undefined;
    }


    const clean = {
        ...data
    };


    delete clean.password;
    delete clean.token;


    return clean;

}




async function writeAuditLog(
    action: string,
    model: string,
    recordId?: string,
    oldData?: unknown,
    newData?: unknown
){

    // Prevent audit loop
    if(model === "AuditLog"){
        return;
    }


    const context =
        getRequestContext();



    await auditPrisma.auditLog.create({

        data: {

            userId:
                context?.userId ?? undefined,


            action,


            module:
                model,


            recordId,


            oldData:
                oldData
                ? sanitizeData(oldData) as Prisma.InputJsonValue
                : undefined,


            newData:
                newData
                ? sanitizeData(newData) as Prisma.InputJsonValue
                : undefined,


            ipAddress:
                context?.ipAddress ?? undefined,


            userAgent:
                context?.userAgent ?? undefined

        } as Prisma.AuditLogUncheckedCreateInput

    });

}




export function auditExtension(){

    return Prisma.defineExtension({

        name:"audit-extension",


        query:{


            $allModels:{


                async create({
                    query,
                    args,
                    model
                }){


                    const result =
                        await query(args);



                    await writeAuditLog(

                        "CREATE",

                        model,

                        (result as any)?.id,

                        undefined,

                        result

                    );


                    return result;

                },



                async update({
                    query,
                    args,
                    model
                }){


                    const delegate =
                        (auditPrisma as any)[
                            model.charAt(0).toLowerCase()
                            +
                            model.slice(1)
                        ];



                    const oldRecord =
                        await delegate?.findUnique({

                            where: args.where

                        });



                    const result =
                        await query(args);



                    await writeAuditLog(

                        "UPDATE",

                        model,

                        (result as any)?.id,

                        oldRecord,

                        result

                    );



                    return result;

                },



                async delete({
                    query,
                    args,
                    model
                }){


                    const delegate =
                        (auditPrisma as any)[
                            model.charAt(0).toLowerCase()
                            +
                            model.slice(1)
                        ];



                    const oldRecord =
                        await delegate?.findUnique({

                            where: args.where

                        });



                    const result =
                        await query(args);



                    await writeAuditLog(

                        "DELETE",

                        model,

                        (result as any)?.id,

                        oldRecord,

                        undefined

                    );



                    return result;

                }


            }


        }


    });

}