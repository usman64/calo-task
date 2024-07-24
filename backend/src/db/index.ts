import fs from 'fs';
import path from 'path';

import { JobData } from '../lib/types';

class Database<T> {
  public cachedData: T[]; // ideally I'd cache this in another Redis instance
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initializeFile();
    this.cachedData = this.readDataFromFile();
  }

  add(data: T): void {
    this.cachedData.push(data);
    this.writeDataToFile(this.cachedData);
  }

  getById(id: string): T | undefined {
    const item = this.cachedData.find((item: any) => item.id === id);
    return item;
  }

  getAll(page: number = 1, pageSize: number = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = this.cachedData // @ts-ignore
                              .sort((a: T, b: T) => b.created_at - a.created_at) 
                              .slice(startIndex, endIndex);

    return {
      total: this.cachedData.length,
      page,
      pageSize,
      totalPages: Math.ceil(this.cachedData.length / pageSize),
      data: paginatedData,
    };
  }

  update(id: string, updatedFields: any): T | null {
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

  initializeFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  readDataFromFile(): T[] {
    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  writeDataToFile(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }
}

const db = new Database<JobData>(path.join(__dirname, 'data.txt'));

export default db;
