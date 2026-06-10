import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ListBusinessesDto, ListMenusDto, ListUsersDto, UpdateUserDto } from './admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('users')
  listUsers(@Query() q: ListUsersDto) {
    return this.admin.listUsers(q);
  }

  @Get('users/:id')
  userDetail(@Param('id') id: string) {
    return this.admin.userDetail(id);
  }

  @Patch('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.admin.updateUser(id, dto);
  }

  @Get('businesses')
  listBusinesses(@Query() q: ListBusinessesDto) {
    return this.admin.listBusinesses(q);
  }

  @Get('menus')
  listMenus(@Query() q: ListMenusDto) {
    return this.admin.listMenus(q);
  }
}
