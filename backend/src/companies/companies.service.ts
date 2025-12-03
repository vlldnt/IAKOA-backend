import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCompanyDto: CreateCompanyDto, userId: string): Promise<CompanyResponseDto> {
    try {
      const company = await this.prisma.company.create({
        data: {
          name: createCompanyDto.name,
          siren: createCompanyDto.siren,
          description: createCompanyDto.description ?? undefined,
          website: createCompanyDto.website ?? undefined,
          socialNetworks: createCompanyDto.socialNetworks ? JSON.parse(JSON.stringify(createCompanyDto.socialNetworks)) : undefined,
          isValidated: createCompanyDto.isValidated ?? false,
          ownerId: userId,
        },
      });

      return new CompanyResponseDto(company);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Une entreprise avec le SIREN ${createCompanyDto.siren} existe déjà.`);
      }
      throw error;
    }
  }

  async findAll(): Promise<CompanyResponseDto[]> {
    const companies = await this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return companies.map(company => new CompanyResponseDto(company));
  }

  async findAllByOwner(userId: string): Promise<CompanyResponseDto[]> {
    const companies = await this.prisma.company.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    return companies.map(company => new CompanyResponseDto(company));
  }

  async findOne(id: string, userId: string, userRole: Role): Promise<CompanyResponseDto> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée.`);
    }

    if (userRole !== Role.ADMIN && company.ownerId !== userId) {
      throw new UnauthorizedException(`Vous n'avez pas accès à cette entreprise.`);
    }

    return new CompanyResponseDto(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string, userRole: Role): Promise<CompanyResponseDto> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée.`);
    }

    if (userRole !== Role.ADMIN && company.ownerId !== userId) {
      throw new UnauthorizedException(`Vous n'êtes pas autorisé à modifier cette entreprise.`);
    }

    try {
      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: {
          name: updateCompanyDto.name ?? undefined,
          siren: updateCompanyDto.siren ?? undefined,
          description: updateCompanyDto.description ?? undefined,
          website: updateCompanyDto.website ?? undefined,
          socialNetworks: updateCompanyDto.socialNetworks ? JSON.parse(JSON.stringify(updateCompanyDto.socialNetworks)) : undefined,
          isValidated: updateCompanyDto.isValidated ?? undefined,
        },
      });

      return new CompanyResponseDto(updatedCompany);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Une entreprise avec le SIREN ${updateCompanyDto.siren} existe déjà.`);
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée.`);
      }
      throw error;
    }
  }

  async remove(id: string, userId: string, userRole: Role): Promise<{ message: string }> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée.`);
    }

    if (userRole !== Role.ADMIN && company.ownerId !== userId) {
      throw new UnauthorizedException(`Vous n'êtes pas autorisé à supprimer cette entreprise.`);
    }

    try {
      await this.prisma.company.delete({
        where: { id },
      });

      return { message: `Entreprise ${company.name} supprimée avec succès.` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée.`);
      }
      throw error;
    }
  }
}
