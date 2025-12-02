import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une nouvelle entreprise',
    description: 'Crée une entreprise associée à l\'utilisateur connecté.',
  })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ status: 201, description: 'Entreprise créée avec succès', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les entreprises',
    description: 'Retourne la liste de toutes les entreprises.',
  })
  @ApiResponse({ status: 200, description: 'Liste des entreprises', type: [CompanyResponseDto] })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('my-companies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer mes entreprises',
    description: 'Retourne toutes les entreprises appartenant à l\'utilisateur connecté.',
  })
  @ApiResponse({ status: 200, description: 'Liste de mes entreprises', type: [CompanyResponseDto] })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAllByOwner(@GetUser() user: UserResponseDto) {
    return this.companiesService.findAllByOwner(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer une entreprise par ID',
    description: 'Retourne les détails d\'une entreprise spécifique.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'entreprise', example: 'cm3xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Entreprise trouvée', type: CompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  findOne(@Param('id') id: string, @GetUser() user: UserResponseDto) {
    return this.companiesService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour une entreprise',
    description: 'Met à jour partiellement les informations d\'une entreprise.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'entreprise', example: 'cm3xxxxxxxxxxxx' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Entreprise mise à jour avec succès', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une entreprise',
    description: 'Supprime définitivement une entreprise.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'entreprise', example: 'cm3xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Entreprise supprimée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  remove(@Param('id') id: string, @GetUser() user: UserResponseDto) {
    return this.companiesService.remove(id, user.id, user.role);
  }
}
