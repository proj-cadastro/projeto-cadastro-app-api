import { createManyProfessors } from "../modules/professor/professor.service";
import { CreateProfessorDto } from "../types/professor.dto";

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

    verifyDuplicatedValue(professors, "email")
    verifyDuplicatedValue(professors, "lattes")

    try {
        if (professors.length) await createManyProfessors(professors);
    } catch (e: any) {
        throw new Error(e);
    }

    return { professors };
};

const verifyDuplicatedValue = (list: any[], key: string): void => {
    const count: Record<string, number> = {};

    list.forEach(item => {
        const value = String(item[key] ?? "");
        count[value] = (count[value] || 0) + 1;

        if (count[value] > 1 && value !== "") {
            throw new Error(`Valor duplicado encontrado no campo: "${key}": ${value}`);
        }
    });
};

