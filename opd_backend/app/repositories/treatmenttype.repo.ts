import { prisma } from "../lib/prisma";

export const treatmenttypeRepo = {
    create: (data: any) => prisma.treatmenttype.create({ data }),
    findAll: () => prisma.treatmenttype.findMany(),
    findById: (id: number) =>
        prisma.treatmenttype.findUnique({ where: { TreatmentTypeID: id } }),
    update:(id:number,data:any)=>
        prisma.treatmenttype.update({where:{TreatmentTypeID:id},data}),
    delete:(id:number)=>
        prisma.treatmenttype.delete({where:{TreatmentTypeID:id}}),
}