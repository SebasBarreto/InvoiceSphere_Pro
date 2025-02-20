import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // Importa el ConfigModule
import { UsersModule } from './users/users.module';  // Tu módulo de usuarios
import { AuthModule } from './auth/auth.module';  // Tu módulo de autenticación
import { MongooseModule } from '@nestjs/mongoose';  // Mongoose para conectar con la base de datos
import { APP_GUARD } from '@nestjs/core';
import { PublicGuard } from './auth/public.guard';  // Asegúrate de importar correctamente el PublicGuard
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot('mongodb+srv://Sebas:Sebas234@cluster0.hk3ie.mongodb.net/Spherepro?retryWrites=true&w=majority&appName=Cluster0'), // Conexión a MongoDB
    UsersModule,
    AuthModule, ProductsModule,InvoicesModule
  ],
  providers: [

  ],
})
export class AppModule {}
