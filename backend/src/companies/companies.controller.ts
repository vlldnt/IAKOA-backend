import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('my-companies')
  @UseGuards(JwtAuthGuard)
  findAllByOwner(@GetUser() user: UserResponseDto) {
    return this.companiesService.findAllByOwner(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user: UserResponseDto) {
    return this.companiesService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: UserResponseDto) {
    return this.companiesService.remove(id, user.id, user.role);
  }
}
