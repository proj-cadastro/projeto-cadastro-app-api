import { createManyProfessors } from "../modules/professor/professor.service";
import { CreateProfessorDto } from "../types/professor.dto";
import prisma from "../prisma/client";


import * as xlsx from 'xlsx';

export const uploadProfessorFile = async (fileBuffer: Buffer) => {
    const workBook = xlsx.read(fileBuffer, { type: "buffer" });

    const extractSheetData = (sheetName: string) => {
        const sheet = workBook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json<CreateProfessorDto>(sheet, { header: 0 });
    };

    const data = extractSheetData(workBook.SheetNames[0]);

    const professors = data.map((prof) => ({
        ...prof,
        idUnidade: String(prof.idUnidade)
    }))

    verifyDuplicatedValueInExcelFile(professors, "email")
    verifyDuplicatedValueInExcelFile(professors, "lattes")
    await verifyDuplicatedValueInDB(professors)

    try {
        if (professors.length) await createManyProfessors(professors);
    } catch (e: any) {
        throw new Error(e);
    }

    return { professors };
};

const verifyDuplicatedValueInDB = async (list: any[]) => {

    //verifica os campos únicos da tabela
    const emails = list.map(p => p.email).filter(Boolean)
    const lattess = list.map(p => p.lattes).filter(Boolean)

    const existing = await prisma.professor.findMany({
        where: {
            OR: [
                { email: { in: emails } },
                { lattes: { in: lattess } }
            ]
        },
        select: {
            email: true,
            lattes: true//
        }
    })

    if (existing.length) {
        const duplicated = existing.map(p => p.email || p.lattes).join(", ");
        throw new Error(`Valores já cadastrados na plataforma: ${duplicated}`)
    }
    return false
};

const verifyDuplicatedValueInExcelFile = (list: any[], key: string) => {
    const count: Record<string, string[]> = {
        emails: [],
        lattes: []
    };

    list.forEach(item => {


        // const value = String(item["email"] ?? "");
        // count[value] = (count[value] || 0) + 1;

        // if (count[value] > 1 && value !== "") {
        //     throw new Error(`Valor duplicado encontrado no campo: "${key}": ${value}`);

        // }
    });
}

//count = {"email": 1}
