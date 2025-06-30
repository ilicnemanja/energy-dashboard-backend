import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseHealth(): Promise<{
    status: string;
    timestamp: string;
    tables: string[];
    connection: boolean;
  }> {
    try {
      // Check if database connection is alive
      const isConnected = this.dataSource.isInitialized;

      if (!isConnected) {
        return {
          status: 'ERROR',
          timestamp: new Date().toISOString(),
          tables: [],
          connection: false,
        };
      }

      // Query all table names from the PostgreSQL database
      const tablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.dataSource.query(tablesQuery);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const tables = result.map(
        (row: { table_name: string }) => row.table_name,
      );

      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tables,
        connection: true,
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        tables: [],
        connection: false,
      };
    }
  }
}
