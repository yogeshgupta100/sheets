import axios from "axios";

const handleCsvData = async ({ sheetId }: { sheetId: string }): Promise<string[][]> => {
    try {
        const response = await axios.get<string>(`http://localhost:8080/sheets/${sheetId}.csv`);
        const csvDataString = response.data;

        const csvData: string[][] = csvDataString
            .split('\n')
            .map((row: string) => row.split(',').map((cell: string) => cell.trim()));
        return csvData;
    } catch (error: any) {
        console.log(error, error.message);
        return [];
    }
};

export { handleCsvData };
