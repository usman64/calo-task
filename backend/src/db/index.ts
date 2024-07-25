import fs from 'fs';

export interface getAllType<T> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[]
}

export class Database<T> {
  public cachedData: T[];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initializeFile();
    this.cachedData = this.readDataFromFile();
  }

  public add(data: T): void {
    this.cachedData.push(data);
    this.writeDataToFile(this.cachedData);
  }

  public getById(id: string): T | undefined {
    const item = this.cachedData.find((item: any) => item.id === id);
    return item;
  }

  public getAll(page: number = 1, pageSize: number = 10, sortKey: string = ''): getAllType<T> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = this.cachedData // @ts-ignore
                              .sort((a: T, b: T) => b[sortKey] - a[sortKey]) 
                              .slice(startIndex, endIndex);

    return {
      total: this.cachedData.length,
      page,
      pageSize,
      totalPages: Math.ceil(this.cachedData.length / pageSize),
      data: paginatedData,
    };
  }

  public update(id: string, updatedFields: any): T | null {
    this.cachedData = this.readDataFromFile();
    const index = this.cachedData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      this.cachedData[index] = { ...this.cachedData[index], ...updatedFields };
      this.writeDataToFile(this.cachedData);
      console.log(`Updated record with id: ${id}`);
      return this.cachedData[index];
    } else {
      console.log(`Record with id: ${id} not found`);
      return null;
    }
  }

  public clear(): void {
    this.writeDataToFile([]);
  }

  private initializeFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  private readDataFromFile(): T[] {
    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  private writeDataToFile(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }
}
