import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';

import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';


@Injectable()
class SchemaInitializer {
  constructor(private sequelize: Sequelize) { }

  async initializeSchemas() {
    try {
      // Conectar a la base de datos
      await this.sequelize.authenticate();
      console.log('Database connection established');

      // Verificar y crear esquemas
      const schemas = process.env.SCHEMAS ? process.env.SCHEMAS.split(',') : [];

      for (const schema of schemas) {
        await this.ensureSchema(schema);
      }

      console.log('All schemas verified/created successfully');
      process.exit(0);
    } catch (error) {
      console.error('Schema initialization failed:', error);
      process.exit(1);
    }
  }

  private async ensureSchema(schemaName: string) {
    try {
      // Para PostgreSQL
      const [results] = await this.sequelize.query(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = :schema`,
        {
          replacements: { schema: schemaName },
          type: 'SELECT'
        }
      );

      if (!results || (Array.isArray(results) && results.length === 0)) {
        console.log(`Creating schema: ${schemaName}`);
        await this.sequelize.query(
          `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`
        );
      } else {
        console.log(`Schema ${schemaName} already exists`);
      }
    } catch (error) {
      console.error(`Error ensuring schema ${schemaName}:`, error);
      throw error;
    }
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: false
    })
  ],
  providers: [SchemaInitializer],
  controllers: [],
  exports: [SchemaInitializer]
})
class AppModule { }


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const initializer = app.get(SchemaInitializer);
  await initializer.initializeSchemas();
}

bootstrap();